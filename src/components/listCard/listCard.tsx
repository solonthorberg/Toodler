import { listService } from "@/src/services/listService";
import { taskService } from "@/src/services/taskService";
import { List } from "@/src/types/list";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import TaskCard from "../taskCard/taskCard";
import styles from "./styles";

interface ListCardProps {
  list: List;
  onListDeleted?: () => void;
}

export default function ListCard({ list, onListDeleted }: ListCardProps) {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const headerBackground = list.color;
  const bodyBackground = headerBackground + "4D";

  const tasksForList = taskService.getTasksByListId(list.id);

  const handleToggleComplete = useCallback((taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleDeleteTask = useCallback((taskId: number) => {
    taskService.deleteTask(taskId);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleListPress = () => {
    router.push({
      pathname: "/tasks/[listId]",
      params: { listId: String(list.id) },
    });
  };

  const handleListDelete = () => {
    listService.deleteList(list.id);
    onListDeleted?.();
  };

  return (
    <Pressable style={styles.card} onPress={handleListPress} key={refreshKey}>
      <View style={[styles.header, { backgroundColor: headerBackground }]}>
        <Text style={styles.title}>{list.name}</Text>

        <Pressable
          style={styles.trashButton}
          onPress={(e) => {
            e.stopPropagation();
            handleListDelete();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.trashText}>🗑️</Text>
        </Pressable>
      </View>

      <View style={[styles.body, { backgroundColor: bodyBackground }]}>
        {tasksForList.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </View>
    </Pressable>
  );
}
