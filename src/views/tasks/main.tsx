import AddButton, { AddButtonHandle } from "@/src/components/buttons/addButton";
import HeaderAddButton from "@/src/components/buttons/headerAddButton";
import TaskCard from "@/src/components/cards/taskCard/taskCard";
import TaskMoveCard from "@/src/components/cards/TaskMoveCard/TaskMoveCard";
import TaskForm from "@/src/components/forms/taskForm";

import { listService } from "@/src/services/listService";
import {
  applyToggleToEnd,
  orderTasks,
  taskService,
} from "@/src/services/taskService";
import { Task } from "@/src/types/task";

import { Stack, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import AddStyles from "@/src/components/buttons/styles";
import styles from "./styles";

// Add alpha to a 6-digit hex (e.g. "#ff0000" + 0.14 → "#ff000023")
function withAlpha(hex: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  return `${hex}${to2(Math.round(a * 255))}`;
}

export default function TasksMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Move Task modal (your addition)
  const [moveOpen, setMoveOpen] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<number | null>(null);
  const [movingTaskName, setMovingTaskName] = useState<string>("");

  const addRef = useRef<AddButtonHandle>(null);

  const { listId } = useLocalSearchParams();
  const numericListId = Number(listId);

  const currentList = listService.getListById(numericListId);

  // Derive page colors from the list color (your UI)
  const solid = currentList?.color ?? "#E5E7EB";
  const pageBg = useMemo(() => withAlpha(solid, 0.14), [solid]);

  // LOAD
  const loadTasksForList = useCallback(() => {
    try {
      const data = taskService.getTasksByListId(numericListId);
      setTasks(orderTasks(data).merged);
    } catch {
      setTasks([]);
    }
  }, [numericListId]);

  useEffect(() => {
    if (!isNaN(numericListId)) loadTasksForList();
  }, [numericListId, loadTasksForList]);

  // CREATE
  const handleCreateTask = useCallback(
    (payload: { name: string; description: string }) => {
      try {
        const newTask = taskService.addTask(
          numericListId,
          payload.name,
          payload.description,
        );
        // append to END of undone group
        setTasks((prev) => {
          if (prev.some((t) => t.id === newTask.id)) return prev;
          const { undone, done } = orderTasks(prev);
          return [...undone, { ...newTask, isFinished: false }, ...done];
        });
      } catch (e) {
        console.error("Error creating task:", e);
      }
    },
    [numericListId],
  );

  // UPDATE (from main)
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

  const handleUpdateTask = useCallback(
    (payload: { name: string; description: string }) => {
      try {
        if (!selectedTask || !payload.name?.trim()) return;

        taskService.updateTask(selectedTask.id, {
          name: payload.name,
          description: payload.description,
        });

        loadTasksForList();
        closeUpdateModal();
      } catch (e) {
        console.error("Error updating task:", e);
      }
    },
    [selectedTask, loadTasksForList, closeUpdateModal],
  );

  // TOGGLE + DELETE (shared behavior)
  const handleToggleComplete = (taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    setTasks((prev) => applyToggleToEnd(prev, taskId));
  };

  const handleDeleteTask = (taskId: number) => {
    taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // MOVE (your long-press modal)
  const handleLongPressTask = (task: Task) => {
    setMovingTaskId(task.id);
    setMovingTaskName(task.name);
    setMoveOpen(true);
  };

  const handleMoveToList = (targetListId: number) => {
    if (movingTaskId == null) return;
    taskService.moveTask(movingTaskId, targetListId);
    loadTasksForList();
    setMoveOpen(false);
    setMovingTaskId(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      {/* Header "+" opens the same bottom AddButton via ref */}
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderAddButton
              onPress={() => addRef.current?.open()}
              accessibilityLabel="Add task"
              color={tintColor ?? "#111"}
            />
          ),
        }}
      />

      {/* Colored header bar with the list name (your UI) */}
      <View style={[styles.headerBar, { backgroundColor: solid }]}>
        <Text style={styles.headerTitle}>
          {currentList?.name ?? `Tasks (List ${numericListId})`}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
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
              onLongPress={handleLongPressTask}
            />
          ))
        )}

        {/* Footer +; header + uses ref to open the same modal */}
        <AddButton ref={addRef} accessibilityLabel="Add task">
          <TaskForm onCreate={handleCreateTask} listId={numericListId} />
        </AddButton>
      </ScrollView>

      {/* Update Task modal (from main) */}
      <Modal
        visible={updateModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeUpdateModal}
      >
        <View style={AddStyles.backdrop}>
          <View style={AddStyles.sheet}>
            <View style={AddStyles.scrollContent}>
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

      {/* Move Task modal (your addition) */}
      <Modal
        visible={moveOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMoveOpen(false)}
      >
        <Pressable
          style={AddStyles.backdrop}
          onPress={() => setMoveOpen(false)}
        >
          <Pressable
            style={[AddStyles.sheet, { height: "60%" }]}
            onPress={(e) => e.stopPropagation()}
          >
            <TaskMoveCard
              currentListId={numericListId}
              taskName={movingTaskName}
              onMove={handleMoveToList}
              onClose={() => setMoveOpen(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
