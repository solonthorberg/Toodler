import { Task } from "@/src/types/task";
import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onLongPress?: (task: Task) => void; // NEW
};

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onLongPress,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onLongPress={() => onLongPress?.(task)}
      delayLongPress={250}          // tweak if you want faster/slower
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
      // onPress={() => { /* normal tap could open details later */ }}
    >
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.circle, task.isFinished && styles.circleDone]}
          onPress={() => onToggleComplete(task.id)}
          hitSlop={8}
        >
          {task.isFinished && <Text style={styles.check}>✓</Text>}
        </Pressable>

        <Text style={styles.title}>{task.name}</Text>

        <Pressable
          style={styles.trashButton}
          onPress={() => onDelete(task.id)}
          hitSlop={8}
        >
          <Text style={styles.trashText}>🗑️</Text>
        </Pressable>
      </View>

      <View style={styles.separator} />
      <Text style={styles.description}>{task.description}</Text>
    </Pressable>
  );
}
