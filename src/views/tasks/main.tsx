import AddButton from "@/src/components/buttons/AddButton";
import TaskCard from "@/src/components/cards/taskCard/taskCard";
import TaskForm from "@/src/components/forms/taskForm";
import { listService } from "@/src/services/listService";
import { taskService, orderTasks, applyToggleToEnd } from "@/src/services/taskService";
import { Task } from "@/src/types/task";
import sharedStyles from "@/src/views/styles";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TasksMain() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { listId } = useLocalSearchParams();
  const numericListId = Number(listId);

  const currentList = listService.getListById(numericListId);

  const loadTasksForList = useCallback(() => {
    try {
      const data = taskService.getTasksByListId(numericListId);
      setTasks(orderTasks(data).merged); // <-- use service helper
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    }
  }, [numericListId]);

  const handleCreateTask = useCallback(
    (payload: { name: string; description: string }) => {
      try {
        const newTask = taskService.addTask(
          numericListId,
          payload.name,
          payload.description
        );

        // append to END of undone group
        setTasks((prev) => {
          const exists = prev.some((t) => t.id === newTask.id);
          if (exists) return prev;
          const { undone, done } = orderTasks(prev);
          return [...undone, { ...newTask, isFinished: false }, ...done];
        });
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
    [numericListId]
  );

  useEffect(() => {
    if (numericListId && !isNaN(numericListId)) {
      loadTasksForList();
    } else {
      console.error("Invalid listId:", listId);
    }
  }, [listId, loadTasksForList, numericListId]);

  const handleToggleComplete = (taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    // move toggled task to END of its new group
    setTasks((prev) => applyToggleToEnd(prev, taskId)); // <-- use service helper
  };

  const handleDeleteTask = (taskId: number) => {
    taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <View style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.subtitle}>
          {currentList?.name ?? `Tasks (List ${numericListId})`}
        </Text>

        {tasks.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyText}>
              No tasks yet. Create your first task!!
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}

        <AddButton accessibilityLabel="Add task">
          <TaskForm onCreate={handleCreateTask} listId={numericListId} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
