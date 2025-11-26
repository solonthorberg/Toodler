import { dataService } from "./dataService";

export const taskService = {
  getTasksById(id: number) {
    return dataService.getTasks().find((tasks) => tasks.listId === id);
  },
};
