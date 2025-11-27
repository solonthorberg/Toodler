import { listService } from "@/src/services/listService";
import { taskService,  orderTasks,  applyToggleToEnd} from "@/src/services/taskService";
import { List } from "@/src/types/list";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import TaskCard from "../taskCard/taskCard";
import styles from "./styles";
import type { Task } from "@/src/types/task";

interface ListCardProps {
  list: List;
  onListDeleted?: () => void;
}

export default function ListCard({ list, onListDeleted }: ListCardProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const headerBackground = list.color;
  const bodyBackground = headerBackground ? `${headerBackground}4D` : "#0000000D";

  // load tasks for this list, ordered: undone first, then done
  const load = useCallback(() => {
    const data = taskService.getTasksByListId(list.id);
    setTasks(orderTasks(data).merged);
  }, [list.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleComplete = useCallback((taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    // move toggled task to END of its new group
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

  return (
    <Pressable style={styles.card} onPress={handleListPress}>
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
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={(id) => {
              // prevent parent card navigation when tapping the checkbox
              // (only needed if header Pressable sometimes overlaps)
              handleToggleComplete(id);
            }}
            onDelete={(id) => {
              handleDeleteTask(id);
            }}
          />
        ))}
      </View>
    </Pressable>
  );
}
