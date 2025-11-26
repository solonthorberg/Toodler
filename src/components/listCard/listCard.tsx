// src/components/listCard.tsx
import data from "@/data/data.json";
import { List } from "@/src/types/list";
import { Task } from "@/src/types/task";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import TaskCard from "../taskCard";
import styles from "./styles";

export default function ListCard({ list }: { list: List }) {
  const router = useRouter();

  const headerBackground = list.color;
  const bodyBackground = headerBackground + "4D"; //30% opacity

  const tasksForList = useMemo(
    () => (data.tasks as Task[]).filter((t) => t.listId === list.id),
    [list.id],
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/tasks/[listId]",
          params: { listId: String(list.id) },
        })
      }
      style={styles.card}
      accessibilityLabel={`Open list ${list.name}`}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBackground }]}>
        <Text style={styles.title}>{list.name}</Text>
        {/* trash icon */}
        <Pressable style={styles.trashButton}>
          <Text style={styles.trashText}>🗑️</Text>
        </Pressable>
      </View>

      {/* Body */}
      <View style={[styles.body, { backgroundColor: bodyBackground }]}>
        {tasksForList.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>
    </Pressable>
  );
}
