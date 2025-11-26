import { dataService } from "./dataService";

export const boardService = {
  getBoards() {
    return dataService.getBoards();
  },

  addBoard(name: string, description: string, thumbnailPhoto: string) {
    const boards = dataService.getBoards();

    // Generate unique ID using the dataService helper
    const newId = dataService.getNextId("boards");

    const newBoard = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      thumbnailPhoto: thumbnailPhoto.trim(),
    };

    console.log("Creating new board:", newBoard);

    const updatedBoards = [...boards, newBoard];
    dataService.setBoards(updatedBoards);

    console.log("Board created successfully:", newBoard);
    return newBoard;
  },

  updateBoard(id: number, updates: any) {
    const boards = dataService.getBoards();
    const boardIndex = boards.findIndex((board) => board.id === id);

    if (boardIndex === -1) {
      console.error("Board not found:", id);
      return null;
    }

    const updatedBoard = { ...boards[boardIndex], ...updates };
    boards[boardIndex] = updatedBoard;

    dataService.setBoards(boards);
    return updatedBoard;
  },

  deleteBoard(id: number) {
    const boards = dataService.getBoards();
    const filteredBoards = boards.filter((board) => board.id !== id);

    if (filteredBoards.length === boards.length) {
      console.error("Board not found for deletion:", id);
      return false;
    }

    dataService.setBoards(filteredBoards);
    return true;
  },

  getBoardById(id: number) {
    const boards = dataService.getBoards();
    return boards.find((board) => board.id === id) || null;
  },
};
