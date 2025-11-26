import AddButton from "@/src/components/Buttons/AddButton";
import TaskForm from "@/src/components/Buttons/TaskForm";
import TaskCard from "@/src/components/taskCard";
import { listService } from "@/src/services/listService";
import { taskService } from "@/src/services/taskService";
import { Task } from "@/src/types/task";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TasksMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const { listId } = useLocalSearchParams();
  const numericListId = Number(listId);

  console.log(
    "Route params - listId:",
    listId,
    "numericListId:",
    numericListId,
  );

  const currentList = listService.getListById(numericListId);
  console.log("Current list found:", currentList);

  const loadTasksForList = useCallback(() => {
    try {
      setLoading(true);
      console.log("Loading tasks for listId:", numericListId);

      const data = taskService.getTasksByListId(numericListId);
      console.log("Raw tasks from service:", data);

      setTasks(data);
      console.log("Tasks loaded for list", numericListId, ":", data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [numericListId]);

  const handleCreateTask = useCallback(
    (payload: {
      scope: "task";
      listId: number;
      name: string;
      description: string;
    }) => {
      try {
        console.log("Creating task with payload:", payload);

        const newTask = taskService.addTask(
          numericListId,
          payload.name,
          payload.description,
        );

        console.log("Task created successfully:", newTask);

        setTasks((prevTasks) => {
          const exists = prevTasks.some((task) => task.id === newTask.id);
          if (exists) {
            console.warn("Task already exists in state:", newTask.id);
            return prevTasks;
          }

          const updatedTasks = [...prevTasks, newTask];
          console.log(
            "Updated tasks state:",
            updatedTasks.map((t) => ({ id: t.id, name: t.name })),
          );
          return updatedTasks;
        });
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
    [numericListId],
  );

  useEffect(() => {
    if (numericListId && !isNaN(numericListId)) {
      loadTasksForList();
    } else {
      console.error("Invalid listId:", listId);
    }
  }, [listId, loadTasksForList, numericListId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 12 }}>
          {currentList?.name ?? `Tasks (List ${numericListId})`}
        </Text>

        {tasks.length === 0 ? (
          <View
            style={{
              padding: 32,
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              No tasks yet. Create your first task!
            </Text>
          </View>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}

        <AddButton accessibilityLabel="Add task">
          <TaskForm onCreate={handleCreateTask} listId={numericListId} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
