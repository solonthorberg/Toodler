import AddButton from "@/src/components/buttons/addButton";
import TaskCard from "@/src/components/cards/taskCard/taskCard";
import TaskForm from "@/src/components/forms/taskForm";
import { listService } from "@/src/services/listService";
import {
  applyToggleToEnd,
  orderTasks,
  taskService,
} from "@/src/services/taskService";
import { Task } from "@/src/types/task";
import sharedStyles from "@/src/views/styles";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function TasksMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { listId } = useLocalSearchParams();
  const numericListId = Number(listId);

  const currentList = listService.getListById(numericListId);

  const loadTasksForList = useCallback(() => {
    try {
      const data = taskService.getTasksByListId(numericListId);
      setTasks(orderTasks(data).merged);
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
          payload.description,
        );

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
    [numericListId],
  );

  const handleUpdateTask = useCallback(
    (payload: { name: string; description: string }) => {
      try {
        if (!selectedTask || !payload.name?.trim()) {
          return;
        }

        taskService.updateTask(selectedTask.id, {
          name: payload.name,
          description: payload.description,
        });

        loadTasksForList();
        setUpdateModalOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    [selectedTask, loadTasksForList],
  );

  const openUpdateModal = useCallback(
    (taskId: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setSelectedTask(task);
        setUpdateModalOpen(true);
      }
    },
    [tasks],
  );

  const closeUpdateModal = useCallback(() => {
    setUpdateModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleToggleComplete = (taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    setTasks((prev) => applyToggleToEnd(prev, taskId));
  };

  const handleDeleteTask = (taskId: number) => {
    taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  useEffect(() => {
    if (numericListId && !isNaN(numericListId)) {
      loadTasksForList();
    } else {
      console.error("Invalid listId:", listId);
    }
  }, [listId, loadTasksForList, numericListId]);

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
              onUpdate={openUpdateModal}
            />
          ))
        )}

        <AddButton accessibilityLabel="Add task">
          <TaskForm onCreate={handleCreateTask} listId={numericListId} />
        </AddButton>
      </ScrollView>

      <Modal
        visible={updateModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={closeUpdateModal}
      >
        <View style={sharedStyles.backdrop}>
          <View style={sharedStyles.sheet}>
            <View style={sharedStyles.scrollContent}>
              <TaskForm
                onUpdate={handleUpdateTask}
                initialValues={selectedTask || undefined}
                onClose={closeUpdateModal}
                listId={numericListId}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
