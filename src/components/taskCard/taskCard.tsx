import { Task } from "@/src/types/task";
import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

export default function TaskCard({ task, onToggleComplete, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.circle, task.isFinished && styles.circleDone]}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.isFinished && <Text style={styles.check}>✓</Text>}
        </Pressable>

        <Text style={styles.title}>{task.name}</Text>

        <Pressable style={styles.trashButton} onPress={() => onDelete(task.id)}>
          <Text style={styles.trashText}>🗑️</Text>
        </Pressable>
      </View>

      <View style={styles.separator} />
      <Text style={styles.description}>{task.description}</Text>
    </View>
  );
}
