import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { useRouter } from "expo-router";
import DeleteButton from "@/src/components/deletButton";

export type Board = {
  id: number;
  name: string;
  description: string;
  thumbnailPhoto?: string;
};

export default function BoardCard({
  board,
  onDelete, // <-- add this if needed
}: {
  board: Board;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [imgOk, setImgOk] = useState(!!board.thumbnailPhoto);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/lists/[boardId]",
          params: { boardId: String(board.id) },
        })
      }
      style={styles.card}
    >
      {/* banner image OR white fallback */}
      {imgOk && board.thumbnailPhoto ? (
        <ImageBackground
          source={{ uri: board.thumbnailPhoto }}
          style={styles.banner}
          imageStyle={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <View style={[styles.banner, { backgroundColor: "#fff" }]} />
      )}

      {/* ✅ DELETE BUTTON — placed ABOVE the image */}
      <DeleteButton
        onPress={onDelete}
        style={{ position: "absolute", top: 10, right: 10 }}
      />

      {/* body text */}
      <View style={styles.body}>
        <Text style={styles.title}>{board.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {board.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  banner: {
    height: 96,
    width: "100%",
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#666",
  },
});
