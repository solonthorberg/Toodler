import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import styles from "./styles";

export type Board = {
  id: number;
  name: string;
  description: string;
  thumbnailPhoto?: string;
};

interface BoardCardProps {
  board: Board;
  onDelete?: (boardId: number) => void;
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
  const router = useRouter();
  const [imgOk, setImgOk] = useState(!!board.thumbnailPhoto);

  const handleDelete = () => {
    onDelete?.(board.id);
  };

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
      {imgOk && board.thumbnailPhoto ? (
        <ImageBackground
          source={{ uri: board.thumbnailPhoto }}
          style={styles.banner}
          imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <View style={[styles.banner, { backgroundColor: "#fff" }]} />
      )}

      {/* Delete button positioned on top */}
      <Pressable
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title}>{board.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {board.description}
        </Text>
      </View>
    </Pressable>
  );
}
