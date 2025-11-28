import DeleteButton from "@/src/components/buttons/deleteButton";
import UpdateButton from "@/src/components/buttons/updateButton";
import { Task } from "@/src/types/task";
import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onUpdate?: (taskId: number) => void;
  onLongPress?: (task: Task) => void;
};

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
  onLongPress,
}: Props) {
  const handleUpdate = () => {
    onUpdate?.(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <Pressable
      style={styles.card}
      onLongPress={onLongPress ? () => onLongPress(task) : undefined}
      delayLongPress={300}
    >
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.circle, task.isFinished && styles.circleDone]}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.isFinished && <Text style={styles.check}>✓</Text>}
        </Pressable>

        <Text style={styles.title}>{task.name}</Text>

        <View style={styles.buttonContainer}>
          <UpdateButton onPress={handleUpdate} style={styles.actionButton} />
          <DeleteButton onPress={handleDelete} style={styles.actionButton} />
        </View>
      </View>

      <View style={styles.separator} />
      {!!task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}
    </Pressable>
  );
}
