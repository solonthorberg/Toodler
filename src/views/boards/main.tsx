import AddButton from "@/src/components/Buttons/AddButton";
import BoardForm from "@/src/components/Buttons/BoardForm";
import BoardCard from "@/src/components/boardCard";
import { boardService } from "@/src/services/boardService";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export interface Board {
  id: number;
  name: string;
  description: string;
  thumbnailPhoto: string;
}

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
      console.log("Creating board with payload:", payload);

      if (!payload.name?.trim()) {
        console.error("Board name is required");
        return;
      }

      const newBoard = boardService.addBoard(
        payload.name,
        payload.description || "",
        payload.thumbnailPhoto || "",
      );

      setBoards((prevBoards) => {
        const updatedBoards = [...prevBoards, newBoard];
        console.log(
          "Updated boards state:",
          updatedBoards.map((b) => ({ id: b.id, name: b.name })),
        );
        return updatedBoards;
      });
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 12 }}>
          Boards
        </Text>
        {sortedBoards.map((board) => (
          <BoardCard key={board.id.toString()} board={board} />
        ))}

        <AddButton accessibilityLabel="Add board">
          <BoardForm onCreate={handleCreateBoard} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
