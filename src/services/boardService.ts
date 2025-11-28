import { Board } from "@/src/types/board";
import { dataService } from "./dataService";
import { listService } from "./listService";

export const boardService = {
  getBoards() {
    return dataService.getBoards();
  },

  addBoard(name: string, description: string, thumbnailPhoto: string) {
    const boards = dataService.getBoards();

    const newId = dataService.getNextId("boards");

    const newBoard = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      thumbnailPhoto: thumbnailPhoto.trim(),
    };

    const updatedBoards = [...boards, newBoard];
    dataService.setBoards(updatedBoards);

    console.log("Board created:", newBoard);
    return newBoard;
  },

  updateBoard(id: number, updates: Partial<Board>) {
    const boards = dataService.getBoards();
    const boardIndex = boards.findIndex((board) => board.id === id);

    const trimmedUpdates = {
      ...updates,
      ...(updates.name && { name: updates.name.trim() }),
      ...(updates.description && { description: updates.description.trim() }),
      ...(updates.thumbnailPhoto && {
        thumbnailPhoto: updates.thumbnailPhoto.trim(),
      }),
    };

    const updatedBoard = { ...boards[boardIndex], ...trimmedUpdates };

    const updatedBoards = [...boards];
    updatedBoards[boardIndex] = updatedBoard;

    dataService.setBoards(updatedBoards);
    console.log("Board updated:", updatedBoard);
    return updatedBoard;
  },

  deleteBoard(id: number) {
    const boards = dataService.getBoards();
    const filteredBoards = boards.filter((board) => board.id !== id);

    listService.deleteListByBoardId(id);
    console.log("Board deleted:", id);
    dataService.setBoards(filteredBoards);
    return true;
  },

  getBoardById(id: number) {
    const boards = dataService.getBoards();
    return boards.find((board) => board.id === id) || null;
  },
};
