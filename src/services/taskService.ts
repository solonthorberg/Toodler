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

    const updatedTasks = [...tasks, newTask];
    dataService.setTasks(updatedTasks);

    console.log("Task created:", newTask);
    return newTask;
  },

  updateTask(id: number, updates: any) {
    const tasks = dataService.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

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

  deleteTask(taskId: number) {
    const tasks = dataService.getTasks();
    const filteredTasks = tasks.filter((task) => task.listId !== taskId);
    dataService.setTasks(filteredTasks);
    return true;
  },

  deleteTaskByListId(ListId: number) {
    const tasks = dataService.getTasks();
    const filteredTasks = tasks.filter((list) => list.listId !== ListId);
    dataService.setTasks(filteredTasks);
    return true;
  },
};
