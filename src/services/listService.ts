import { List } from "@/src/types/list";
import { dataService } from "./dataService";
import { taskService } from "./taskService";

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

  updateList(id: number, updates: Partial<List>) {
    const lists = dataService.getLists();
    const listIndex = lists.findIndex((list) => list.id === id);

    if (listIndex === -1) {
      throw new Error(`List with id ${id} not found`);
    }

    const trimmedUpdates = {
      ...updates,
      ...(updates.name && { name: updates.name.trim() }),
      ...(updates.color && { color: updates.color.trim() }),
    };

    const updatedList = { ...lists[listIndex], ...trimmedUpdates };

    const updatedLists = [...lists];
    updatedLists[listIndex] = updatedList;

    dataService.setLists(updatedLists);
    console.log("List updated:", updatedList);
    return updatedList;
  },

  deleteList(listId: number) {
    const lists = dataService.getLists();
    const filteredLists = lists.filter((list) => list.id !== listId);

    taskService.deleteTaskByListId(listId);

    dataService.setLists(filteredLists);
    console.log("List deleted:", listId);

    return true;
  },

  deleteListByBoardId(BoardId: number) {
    const lists = dataService.getLists();
    const filteredLists = lists.filter((board) => board.boardId !== BoardId);
    console.log(lists);
    const deletedLists = lists.filter((board) => board.boardId === BoardId);
    console.log("BoardId:", BoardId);
    console.log(deletedLists);

    deletedLists.forEach((list) => taskService.deleteTaskByListId(list.id));

    dataService.setLists(filteredLists);
  },
};
