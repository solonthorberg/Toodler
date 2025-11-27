import { Board } from "@/src/types/board";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import DeleteButton from "../../buttons/deleteButton";
import UpdateButton from "../../buttons/updateButton";
import styles from "./styles";

interface BoardCardProps {
  board: Board;
  onDelete?: (boardId: number) => void;
  onUpdate?: (boardId: number) => void;
}

export default function BoardCard({
  board,
  onDelete,
  onUpdate,
}: BoardCardProps) {
  const router = useRouter();
  const [imgOk, setImgOk] = useState(!!board.thumbnailPhoto);

  const handleDelete = () => {
    onDelete?.(board.id);
  };

  const handleUpdate = () => {
    onUpdate?.(board.id);
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

      <UpdateButton
        onPress={handleUpdate}
        style={styles.updateButtonPosition}
      />
      <DeleteButton
        onPress={handleDelete}
        style={styles.deleteButtonPosition}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{board.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {board.description}
        </Text>
      </View>
    </Pressable>
  );
}
