import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import data from "@/data/data.json";
import NavBanner from "@/src/components/navbanner";
import BoardCard, { Board } from "@/src/components/boardCard";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);

  // Load boards from data.json
  useEffect(() => {
    setBoards((data.boards as Board[]) ?? []);
  }, []);

  // Sort boards alphabetically
  const sortedBoards = useMemo(
    () => [...boards].sort((a, b) => a.name.localeCompare(b.name)),
    [boards]
  );

  // ---- DELETE A BOARD ----
  function confirmDelete(board: Board) {
    Alert.alert(
      "Delete Board",
      `Are you sure you want to delete "${board.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBoard(board.id),
        },
      ]
    );
  }

  function deleteBoard(boardId: number) {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 12 }}>
          Boards
        </Text>

        {/* LIST OF BOARDS */}
        {sortedBoards.map((b) => (
          <BoardCard
            key={b.id}
            board={b}
            onDelete={() => confirmDelete(b)}
          />
        ))}

        {/* Add Board Button */}
        <Pressable
          onPress={() => console.log("Add new board")}
          style={{
            marginTop: 12,
            marginBottom: 20,
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#555" }}>
            + Add Board
          </Text>
        </Pressable>
      </ScrollView>

      <NavBanner
        onBackPress={undefined}
        onAddPress={() => console.log("Add new board")}
      />
    </View>
  );
}
