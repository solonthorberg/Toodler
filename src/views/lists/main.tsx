import AddButton from "@/src/components/Buttons/AddButton";
import ListForm from "@/src/components/Buttons/ListForm";
import ListCard from "@/src/components/listCard/listCard";
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { List } from "@/src/types/list";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBoard = boardService.getBoardById(id);

  const loadListsForBoard = useCallback(() => {
    try {
      setLoading(true);
      const data = listService.getListsByBoardId(id) as List[];
      setLists(data);
      console.log("Lists loaded for board", id, ":", data);
    } catch (error) {
      console.error("Error loading lists:", error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleCreateList = useCallback(
    (payload: {
      scope: "list";
      boardId: number;
      name: string;
      color: string;
      createdAt: number;
    }) => {
      try {
        console.log("Creating list with payload:", payload);

        const newList = listService.addList(
          payload.boardId,
          payload.name,
          payload.color,
        );

        console.log("List created successfully:", newList);

        setLists((prevLists) => {
          const exists = prevLists.some((list) => list.id === newList.id);
          if (exists) {
            console.warn("List already exists in state:", newList.id);
            return prevLists;
          }

          const updatedLists = [...prevLists, newList];
          console.log(
            "Updated lists state:",
            updatedLists.map((l) => ({ id: l.id, name: l.name })),
          );
          return updatedLists;
        });
      } catch (error) {
        console.error("Error creating list:", error);
      }
    },
    [],
  );

  useEffect(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading lists...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 12 }}>
          {currentBoard?.name ?? "Lists"}
        </Text>

        {lists.length === 0 ? (
          <View
            style={{
              padding: 32,
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              Looks empty... Create your first list!!
            </Text>
          </View>
        ) : (
          lists.map((list) => <ListCard key={list.id} list={list} />)
        )}

        <AddButton accessibilityLabel="Add list">
          <ListForm onCreate={handleCreateList} boardId={id} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
