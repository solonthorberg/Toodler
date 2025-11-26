// src/components/listCard.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export type List = {
  id: number;
  name: string;
  description?: string;
  boardId: number;
};

export default function ListCard({ list }: { list: List }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/tasks/[listId]", params: { listId: String(list.id) } })
      }
      style={styles.card}
      accessibilityLabel={`Open list ${list.name}`}
    >
      <View style={styles.body}>
        <Text style={styles.title}>{list.name}</Text>
        {list.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {list.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },
  body: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  desc: { fontSize: 14, color: "#666" },
});
