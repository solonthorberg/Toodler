import AddButton, { AddButtonHandle } from "@/src/components/buttons/addButton";
import HeaderAddButton from "@/src/components/buttons/HeaderAddButton";
import BoardCard from "@/src/components/cards/boardCard/boardCard";
import BoardForm from "@/src/components/Forms/BoardForm";
import { boardService } from "@/src/services/boardService";
import { Board } from "@/src/types/board";
import sharedStyles from "@/src/views/styles";
import { Stack } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, Text, View } from "react-native";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);
  const addRef = useRef<AddButtonHandle>(null); // ref to the AddButton modal

  const loadBoards = useCallback(() => {
    try {
      const data = boardService.getBoards() as Board[];
      setBoards(data);
    } catch (error) {
      console.error("Error loading boards:", error);
    }
  }, []);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const sortedBoards = useMemo(
    () => [...boards].sort((a, b) => a.name.localeCompare(b.name)),
    [boards]
  );

  const handleCreateBoard = useCallback((payload: any) => {
    try {
      if (!payload.name?.trim()) return;

      const newBoard = boardService.addBoard(
        payload.name,
        payload.description || "",
        payload.thumbnailPhoto || ""
      );

      setBoards((prevBoards) => [...prevBoards, newBoard]);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }, []);

  const handleDeleteBoard = useCallback(
    (boardId: number) => {
      boardService.deleteBoard(boardId);
      loadBoards();
    },
    [loadBoards]
  );

  return (
    <View style={sharedStyles.container}>
      {/* Put the + in the NAV HEADER (top-right) */}
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderAddButton
              onPress={() => addRef.current?.open()}
              accessibilityLabel="Add board"
              color={tintColor ?? "#111"}
            />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.title}>Boards</Text>

        {boards.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyText}>
              No boards yet. Create your first board!!
            </Text>
          </View>
        ) : (
          sortedBoards.map((board) => (
            <BoardCard
              key={board.id.toString()}
              board={{ ...board, description: board.description ?? "" }}
              onDelete={handleDeleteBoard}
            />
          ))
        )}

        {/* This owns the modal; the header + simply calls ref.open() */}
        <AddButton ref={addRef} accessibilityLabel="Add board">
          <BoardForm onCreate={handleCreateBoard} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
