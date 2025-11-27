// src/services/taskService.ts
import { dataService } from "./dataService";
import type { Task } from "@/src/types/task";

/** Split tasks into undone/done and return all three forms */
export const orderTasks = (list: Task[]) => {
  const undone = list.filter((t) => !t.isFinished);
  const done = list.filter((t) => t.isFinished);
  return { undone, done, merged: [...undone, ...done] };
};

/** After toggling one task, re-merge so it lands at the END of its new group
 *  EXCEPT: if it was the only remaining undone task and becomes done,
 *  put it at the FRONT of the done list (so it stays in place).
 */
export const applyToggleToEnd = (list: Task[], taskId: number) => {
  // Count undone BEFORE flipping to detect the "last undone" case
  const prevUndoneCount = list.filter((t) => !t.isFinished).length;

  // Flip the toggled task
  const flipped = list.map((t) =>
    t.id === taskId ? { ...t, isFinished: !t.isFinished } : t
  );

  // Partition AFTER flipping
  let { undone, done } = orderTasks(flipped);
  const toggled = flipped.find((t) => t.id === taskId);
  if (!toggled) return [...undone, ...done];

  if (toggled.isFinished) {
    // It just became done
    const wasLastUndone = prevUndoneCount === 1;
    if (wasLastUndone) {
      // Put at FRONT of done so it stays in place (top)
      done = [toggled, ...done.filter((t) => t.id !== taskId)];
    } else {
      // Normal rule: append to END of done
      done = [...done.filter((t) => t.id !== taskId), toggled];
    }
  } else {
    // It just became undone -> append to END of undone (normal rule)
    undone = [...undone.filter((t) => t.id !== taskId), toggled];
  }

  return [...undone, ...done];
};


export const taskService = {
  getTasksByListId(listId: number) {
    return dataService.getTasks().filter((task) => task.listId === listId);
  },

  getTaskById(id: number) {
    return dataService.getTasks().find((task) => task.id === id) || null;
  },

  addTask(listId: number, name: string, description?: string) {
    const tasks = dataService.getTasks();
    const newId = dataService.getNextId("tasks");

    const newTask: Task = {
      id: newId,
      listId,
      name: name.trim(),
      description: description?.trim() || "",
      isFinished: false,
    };

    const updatedTasks = [...tasks, newTask];
    dataService.setTasks(updatedTasks);

    console.log("Task created:", newTask);
    return newTask;
  },

  updateTask(id: number, updates: Partial<Task>) {
    const tasks = dataService.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;

    dataService.setTasks(tasks);
    return updatedTask;
  },

  toggleTaskCompletion(id: number) {
    const task = this.getTaskById(id);
    if (!task) return null;
    return this.updateTask(id, { isFinished: !task.isFinished });
  },

  deleteTask(taskId: number) {
    const tasks = dataService.getTasks();
    // FIX: remove by task.id, not by listId
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    dataService.setTasks(filteredTasks);
    return true;
  },

  deleteTaskByListId(listId: number) {
    const tasks = dataService.getTasks();
    // FIX: remove all tasks for a given listId
    const filteredTasks = tasks.filter((t) => t.listId !== listId);
    dataService.setTasks(filteredTasks);
    return true;
  },
};
