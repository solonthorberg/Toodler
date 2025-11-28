import type { Task } from "@/src/types/task";
import { dataService } from "./dataService";

export const orderTasks = (list: Task[]) => {
  const undone = list.filter((t) => !t.isFinished);
  const done = list.filter((t) => t.isFinished);
  return { undone, done, merged: [...undone, ...done] };
};

export const applyToggleToEnd = (list: Task[], taskId: number) => {
  const prevUndoneCount = list.filter((t) => !t.isFinished).length;

  const flipped = list.map((t) =>
    t.id === taskId ? { ...t, isFinished: !t.isFinished } : t,
  );

  let { undone, done } = orderTasks(flipped);
  const toggled = flipped.find((t) => t.id === taskId);
  if (!toggled) return [...undone, ...done];

  if (toggled.isFinished) {
    const wasLastUndone = prevUndoneCount === 1;
    if (wasLastUndone) {
      done = [toggled, ...done.filter((t) => t.id !== taskId)];
    } else {
      done = [...done.filter((t) => t.id !== taskId), toggled];
    }
  } else {
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

    dataService.setTasks([...tasks, newTask]);
    return newTask;
  },

  updateTask(id: number, updates: Partial<Task>) {
    const tasks = dataService.getTasks();
    const ix = tasks.findIndex((t) => t.id === id);
    if (ix === -1) return null;

    const updated = { ...tasks[ix], ...updates };
    tasks[ix] = updated;
    dataService.setTasks(tasks);
    return updated;
  },

  toggleTaskCompletion(id: number) {
    const task = this.getTaskById(id);
    if (!task) return null;
    return this.updateTask(id, { isFinished: !task.isFinished });
  },

  deleteTask(taskId: number) {
    const tasks = dataService.getTasks();
    dataService.setTasks(tasks.filter((t) => t.id !== taskId));
    return true;
  },

  deleteTaskByListId(listId: number) {
    const tasks = dataService.getTasks();
    dataService.setTasks(tasks.filter((t) => t.listId !== listId));
    return true;
  },

  moveTask(taskId: number, targetListId: number): Task | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;
    if (task.listId === targetListId) return task;
    return this.updateTask(taskId, { listId: targetListId });
  },
};
