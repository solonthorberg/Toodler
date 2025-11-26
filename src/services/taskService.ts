import { dataService } from "./dataService";

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

    const newTask = {
      id: newId,
      listId,
      name: name.trim(),
      description: description?.trim() || "",
      isFinished: false,
    };

    console.log("Creating new task:", newTask);

    const updatedTasks = [...tasks, newTask];
    dataService.setTasks(updatedTasks);

    console.log("Task created successfully:", newTask);
    return newTask;
  },

  updateTask(id: number, updates: any) {
    const tasks = dataService.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      console.error("Task not found:", id);
      return null;
    }

    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;

    dataService.setTasks(tasks);
    return updatedTask;
  },

  toggleTaskCompletion(id: number) {
    const task = this.getTaskById(id);
    if (!task) {
      return null;
    }

    return this.updateTask(id, { isFinished: !task.isFinished });
  },
};
