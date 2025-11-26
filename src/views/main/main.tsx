import data from "@/data/data.json";
import BoardCard from "@/src/components/boardCard";
import NavBanner from "@/src/components/navbanner";
import { Board } from "@/src/types/board";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);

  // Load boards from data.json on component mount
  useEffect(() => {
    setBoards((data.boards as Board[]) ?? []);
  }, []);

  const sortedBoards = useMemo(
    () => [...boards].sort((a, b) => a.name.localeCompare(b.name)),
    [boards],
  );

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 12 }}>
          Boards
        </Text>

        {sortedBoards.map((b) => (
          <BoardCard key={b.id} board={b} />
        ))}

        {/* Add Board box */}
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
