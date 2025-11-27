import HeaderAddButton from "@/src/components/buttons/HeaderAddButton";
import AddButton, { AddButtonHandle } from "@/src/components/buttons/AddButton";
import ListCard from "@/src/components/cards/listCard/listCard";
import ListForm from "@/src/components/Forms/ListForm";
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { List } from "@/src/types/list";
import sharedStyles from "@/src/views/styles";
import { useFocusEffect, useLocalSearchParams, Stack } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);

  const [lists, setLists] = useState<List[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // ref to control the existing AddButton modal
  const addRef = useRef<AddButtonHandle>(null);

  const currentBoard = boardService.getBoardById(id);

  const loadListsForBoard = useCallback(() => {
    try {
      const data = listService.getListsByBoardId(id);
      setLists(data);
    } catch (error) {
      console.error("Error loading lists:", error);
      setLists([]);
    }
  }, [id]);

  const handleCreateList = useCallback(
    (payload: { boardId: number; name: string; color: string }) => {
      try {
        const newList = listService.addList(
          payload.boardId,
          payload.name,
          payload.color
        );

        setLists((prevLists) => {
          const exists = prevLists.some((list) => list.id === newList.id);
          if (exists) return prevLists;
          return [...prevLists, newList];
        });
      } catch (error) {
        console.error("Error creating list:", error);
      }
    },
    []
  );

  useEffect(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const handleListDeleted = useCallback(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  return (
    <View style={sharedStyles.container}>
      {/* Put the + in the NAV HEADER (top-right) */}
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderAddButton
              onPress={() => addRef.current?.open()}
              accessibilityLabel="Add list"
              color={tintColor ?? "#111"}
            />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.subtitle}>
          {currentBoard?.name ?? "Lists"}
        </Text>

        {lists.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyText}>
              Looks empty... Create your first list!!
            </Text>
          </View>
        ) : (
          lists.map((list) => (
            <ListCard
              key={`${list.id}-${refreshKey}`}
              list={list}
              onListDeleted={handleListDeleted}
            />
          ))
        )}

        {/* The header + triggers this same modal via addRef */}
        <AddButton ref={addRef} accessibilityLabel="Add list">
          <ListForm onCreate={handleCreateList} boardId={id} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
