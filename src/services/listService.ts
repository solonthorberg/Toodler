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

  deleteList(listId: number) {
    const lists = dataService.getLists();
    const filteredLists = lists.filter((list) => list.id !== listId);

    taskService.deleteTaskByListId(listId);

    dataService.setLists(filteredLists);

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
