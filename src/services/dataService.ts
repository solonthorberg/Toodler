import data from "../data/data.json";

export const dataService = {
  getAllData() {
    return data;
  },

  getBoards() {
    return data.boards;
  },

  getLists() {
    return data.lists;
  },

  getTasks() {
    return data.tasks;
  },
};
