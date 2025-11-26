import initialData from "../data/data.json";

let appData = {
  boards: [...initialData.boards],
  lists: [...initialData.lists],
  tasks: [...initialData.tasks],
};

export const dataService = {
  getAllData() {
    return appData;
  },

  getBoards() {
    return appData.boards;
  },

  getLists() {
    return appData.lists;
  },

  getTasks() {
    return appData.tasks;
  },

  setBoards(boards: any[]) {
    appData.boards = [...boards];
    console.log("Data updated, boards count:", appData.boards.length);
  },

  setLists(lists: any[]) {
    appData.lists = [...lists];
  },

  setTasks(tasks: any[]) {
    appData.tasks = [...tasks];
  },

  getNextId(entityType: "boards" | "lists" | "tasks"): number {
    const entities = appData[entityType];
    if (entities.length === 0) return 1;
    return Math.max(...entities.map((entity) => entity.id)) + 1;
  },

  resetData() {
    appData = {
      boards: [...initialData.boards],
      lists: [...initialData.lists],
      tasks: [...initialData.tasks],
    };
  },
};
