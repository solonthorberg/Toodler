import DeleteButton from "@/src/components/buttons/deleteButton";
import UpdateButton from "@/src/components/buttons/updateButton";
import { listService } from "@/src/services/listService";
import { taskService } from "@/src/services/taskService";
import { List } from "@/src/types/list";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import TaskCard from "../taskCard/taskCard";
import styles from "./styles";

interface ListCardProps {
  list: List;
  onListDeleted?: () => void;
  onUpdate?: (listId: number) => void;
}

export default function ListCard({
  list,
  onListDeleted,
  onUpdate,
}: ListCardProps) {
  const router = useRouter();

  const headerBackground = list.color;
  const bodyBackground = headerBackground + "4D";

  const tasksForList = taskService.getTasksByListId(list.id);

  const handleToggleComplete = useCallback((taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
  }, []);

  const handleDeleteTask = useCallback((taskId: number) => {
    taskService.deleteTask(taskId);
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

  const handleUpdate = () => {
    onUpdate?.(list.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardButtonContainer}>
        <UpdateButton onPress={handleUpdate} />
        <DeleteButton onPress={handleListDelete} />
      </View>

      <Pressable onPress={handleListPress} style={styles.cardContent}>
        <View style={[styles.header, { backgroundColor: headerBackground }]}>
          <Text style={styles.title}>{list.name}</Text>
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
    </View>
  );
}
