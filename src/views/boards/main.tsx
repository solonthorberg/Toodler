import BoardCard from "@/src/components/BoardCard/boardCard";
import AddButton from "@/src/components/Button/AddButton";
import BoardForm from "@/src/components/Forms/BoardForm";
import { boardService } from "@/src/services/boardService";
import { Board } from "@/src/types/board";
import sharedStyles from "@/src/views/styles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);

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
    [boards],
  );

  const handleCreateBoard = useCallback((payload: any) => {
    try {
      if (!payload.name?.trim()) {
        return;
      }

      const newBoard = boardService.addBoard(
        payload.name,
        payload.description || "",
        payload.thumbnailPhoto || "",
      );

      setBoards((prevBoards) => {
        const updatedBoards = [...prevBoards, newBoard];
        return updatedBoards;
      });
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }, []);

  const handleDeleteBoard = useCallback(
    (boardId: number) => {
      boardService.deleteBoard(boardId);
      loadBoards();
    },
    [loadBoards],
  );

  return (
    <View style={sharedStyles.container}>
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

        <AddButton accessibilityLabel="Add board">
          <BoardForm onCreate={handleCreateBoard} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
