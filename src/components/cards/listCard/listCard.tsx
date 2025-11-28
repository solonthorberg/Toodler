import DeleteButton from "@/src/components/buttons/deleteButton";
import UpdateButton from "@/src/components/buttons/updateButton";
import { listService } from "@/src/services/listService";
import {
  applyToggleToEnd,
  orderTasks,
  taskService,
} from "@/src/services/taskService";
import { blackDefault } from "@/src/styles/colors";
import { List } from "@/src/types/list";
import { Task } from "@/src/types/task";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
  const [tasks, setTasks] = useState<Task[]>([]);

  const headerBackground = list.color;
  const bodyBackground = headerBackground
    ? `${headerBackground}4D`
    : blackDefault;

  const load = useCallback(() => {
    const data = taskService.getTasksByListId(list.id);
    setTasks(orderTasks(data).merged);
  }, [list.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleComplete = useCallback((taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    setTasks((prev) => applyToggleToEnd(prev, taskId));
  }, []);

  const handleDeleteTask = useCallback((taskId: number) => {
    taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
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
          {tasks.map((task) => (
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
