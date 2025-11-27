import HeaderAddButton from "@/src/components/buttons/HeaderAddButton";
import AddButton, { AddButtonHandle } from "@/src/components/buttons/AddButton";
import TaskCard from "@/src/components/cards/taskCard/taskCard";
import TaskForm from "@/src/components/Forms/TaskForm";
import TaskMoveCard from "@/src/components/cards/TaskMoveCard/TaskMoveCard";

import { listService } from "@/src/services/listService";
import { taskService, orderTasks, applyToggleToEnd } from "@/src/services/taskService";
import { Task } from "@/src/types/task";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import styles from "./styles";                // <-- use TASK-SPECIFIC styles
import AddStyles from "@/src/components/buttons/styles"; // reuse sheet/backdrop

// helper to add alpha to a 6-digit hex color (e.g. "#ff0000" + 0.15 -> "#ff000026")
function withAlpha(hex: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const A = Math.round(a * 255);
  return `${hex}${to2(A)}`;
}

export default function TasksMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moveOpen, setMoveOpen] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<number | null>(null);
  const [movingTaskName, setMovingTaskName] = useState<string>("");
  const addRef = useRef<AddButtonHandle>(null);

  const { listId } = useLocalSearchParams();
  const numericListId = Number(listId);

  const currentList = listService.getListById(numericListId);

  // derive colors for the page
  const solid = currentList?.color ?? "#E5E7EB";        // solid brand strip / fallback
  const pageBg = useMemo(() => withAlpha(solid, 0.14), [solid]);  // full-page tint

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

  const handleCreateTask = useCallback(
    (payload: { name: string; description: string }) => {
      const newTask = taskService.addTask(
        numericListId,
        payload.name,
        payload.description
      );
      setTasks((prev) => {
        if (prev.some((t) => t.id === newTask.id)) return prev;
        const { undone, done } = orderTasks(prev);
        return [...undone, { ...newTask, isFinished: false }, ...done];
      });
    },
    [numericListId]
  );

  const handleToggleComplete = (taskId: number) => {
    taskService.toggleTaskCompletion(taskId);
    setTasks((prev) => applyToggleToEnd(prev, taskId));
  };

  const handleDeleteTask = (taskId: number) => {
    taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

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
      {/* Put the + up in the nav header */}
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

      {/* Solid colored header that spans the width */}
      <View style={[styles.headerBar, { backgroundColor: solid }]}>
        <Text style={styles.headerTitle}>
          {currentList?.name ?? `Tasks (List ${numericListId})`}
        </Text>
      </View>

      {/* Content area sits on the tinted page background */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet. Create your first task!!</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onLongPress={handleLongPressTask}
            />
          ))
        )}

        {/* Bottom “+” sheet owner */}
        <AddButton accessibilityLabel="Add task" ref={addRef}>
          <TaskForm onCreate={handleCreateTask} listId={numericListId} />
        </AddButton>
      </ScrollView>

      {/* Move modal */}
      <Modal
        visible={moveOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMoveOpen(false)}
      >
        <Pressable style={AddStyles.backdrop} onPress={() => setMoveOpen(false)}>
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
