// app/lists/[boardId].tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import data from "@/data/data.json";
import ListCard, { List } from "@/src/components/listCard";

export default function ListsScreen() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);

  const listsForBoard = useMemo(
    () => (data.lists as List[]).filter((l) => l.boardId === id),
    [id]
  );

  const currentBoard = (data.boards as any[]).find((b) => b.id === id);

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 12 }}>
          {currentBoard?.name ?? "Lists"}
        </Text>

        {listsForBoard.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </ScrollView>
    </View>
  );
}
