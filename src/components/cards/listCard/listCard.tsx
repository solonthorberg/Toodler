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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import TaskCard from "../taskCard/taskCard";
import styles from "./styles";

interface ListCardProps {
  list: List;
  onListDeleted?: () => void;
  onUpdate?: (listId: number) => void;
  onMeasureList?: (id: number, layout: any) => void;
  onDragStart?: (task: any) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: (id: number, x: number, y: number) => void;
}

export default function ListCard({
  list,
  onListDeleted,
  onUpdate,
  onMeasureList,
  onDragStart,
  onDragMove,
  onDragEnd,
}: ListCardProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const container = useRef<View>(null);

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

  const measureList = useCallback(() => {
    if (!container.current) return;
    container.current.measure((fx, fy, width, height, px, py) => {
      onMeasureList?.(list.id, { x: px, y: py, width, height });
    });
  }, [list.id, onMeasureList]);

  return (
    <View
      ref={container}
      onLayout={measureList}
      style={[styles.card, { overflow: "visible" }]}
    >
      <View style={styles.cardButtonContainer}>
        <UpdateButton onPress={handleUpdate} />
        <DeleteButton onPress={handleListDelete} />
      </View>

      <Pressable
        onPress={handleListPress}
        style={[styles.cardContent, { overflow: "visible" }]}
      >
        <View style={[styles.header, { backgroundColor: headerBackground }]}>
          <Text style={styles.title}>{list.name}</Text>
        </View>

        <View
          style={[
            styles.body,
            { backgroundColor: bodyBackground, overflow: "visible" },
          ]}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
          ))}
        </View>
      </Pressable>
    </View>
  );
}
