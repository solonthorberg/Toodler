import { dataService } from "./dataService";

export const listService = {
  getAllData() {
    return dataService.getAllData;
  },
  getListsById(id: number) {
    return dataService.getLists().find((lists) => lists.boardId === id);
  },
};
