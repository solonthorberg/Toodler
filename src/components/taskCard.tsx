// TaskCard component represents a single task item with its details and actions

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Task = {
  id: number;
  name: string;
  description: string;
  isFinished: boolean;
  listId: number;
};

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  return (
    <View style={styles.card}>
      {/* Top row: circle + title + trash */}
      <View style={styles.headerRow}>
        {/* circle */}
        <View style={[styles.circle, task.isFinished && styles.circleDone]}>
          {task.isFinished && <Text style={styles.check}>✓</Text>}
        </View>

        {/* task title */}
        <Text style={styles.title}>{task.name}</Text>

        {/* trash icon */}
        <Pressable style={styles.trashButton}>
          <Text style={styles.trashText}>🗑️</Text>
        </Pressable>
      </View>

      {/* line */}
      <View style={styles.separator} />

      {/* description */}
      <Text style={styles.description}>{task.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  circleDone: {
    backgroundColor: "#e6ffe6",
  },

  check: {
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "600",
  },

  trashButton: {
    paddingLeft: 10,
  },

  trashText: {
    fontSize: 18,
  },

  separator: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 8,
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    color: "#777",
    marginTop: 4,
  },
});
