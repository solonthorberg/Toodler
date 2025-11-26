import { dataService } from "./dataService";

export const listService = {
  getAllData() {
    return dataService.getAllData();
  },

  getListById(id: number) {
    return dataService.getLists().find((list) => list.id === id) || null;
  },

  getListsByBoardId(boardId: number) {
    return dataService.getLists().filter((list) => list.boardId === boardId);
  },

  addList(boardId: number, name: string, color?: string) {
    const lists = dataService.getLists();

    const newId = dataService.getNextId("lists");

    const newList = {
      id: newId,
      boardId,
      name: name.trim(),
      color: color?.trim() || "#3B82F6",
    };

    const updatedLists = [...lists, newList];
    dataService.setLists(updatedLists);

    console.log("List created:", newList);
    return newList;
  },

  deleteList(listId: number) {
    const lists = dataService.getLists();
    const filteredLists = lists.filter((list) => list.id !== listId);

    dataService.setLists(filteredLists);

    const tasks = dataService.getTasks();
    const filteredTasks = tasks.filter((task) => task.listId !== listId);
    dataService.setTasks(filteredTasks);

    return true;
  },
};
