# Toodler
### Kanban project management app with boards, lists, and tasks.
## Table of Contents
   - Feature List
   - Setup Instructions
   - Technologies Used
   - Development Platform
   - Project Structure / Info
   - Known Issues

## Feature list
   - Users can create/modify/delete boards. 
   - For each board users can create/modify/delete lists. 
   - For each list users can create/modify/delete and toggle marked as complete button for tasks.
   - Users can only move tasks between lists.
   - When a task is marked as complete, it automatically moves to the bottom of the list
  
## Setup Instructions
### Prerequisites:
- Node.js (v18 or higher)
- npm or yarn

### Installation:

1. Install dependencies

   ```bash
   cd Toodler
   npm install
   ```

### Running the App:

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### linting:
   ```bash
   npx expo lint
   ```

## Technologies Used
  - React Native
  - Expo / Expo Router


## Platform Support
### Primary Development Platform:
  - Primary Platform: [iOS]
  - Test Devices[iPhone 15 Pro Max]
  - OS Version[iOS 26.1]

## Project Structure / Info
```Bash
├── app/
│   ├── lists/
│   ├── tasks/
│   ├── _layout.tsx
│   ├── index.tsx
├── assets/
│   ├── images/
├── src/
│   ├── components/
│   │   ├── BoardCard/
│   │   ├── Button/
│   │   ├── Forms/
│   │   ├── listCard/
│   │   ├── taskCard/
│   ├── data/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── views/
│   │   ├── boards/
│   │   ├── lists/
│   │   ├── tasks/
```

### app/
   All routes are registered in App. Each route is has a view (Screen) in the views folder.
   *_layout.tsx* file has a navigation bar that displays which screen you are on and has a automatic back button.

### components/

#### buttons/
   All buttons are located here. For addButton you add the fragment around a form fragment.
   ```Bash
   <AddButton accessibilityLabel="Add board">
      <BoardForm onCreate={handleCreateBoard} />
   </AddButton>
   ```

#### forms/
   All forms for creating or modifying are here. If you need a form you can create one here.

#### cards/
   Here you can find all cards for boards, lists and tasks.

### services/
   *dataService.tsx* transfers data from *data.json* into new arrays in memory. DataService object has methods for accessing and updating data, that is used by the other services. Those Services have some basic CRUD operations. Deletion has a cascading effect; if a board is deleted, the lists and tasks associated are also deleted. When creating a new item, the id created is auto incremented based on highest existing id.

### styles/
   Here you can find the color palettes.

### types/
   All interfaces for board, list, and task.

### views/
   All views are located here.

---

## Known Issues
   - Drag and drop feature for tasks in the list screen is a bit finicky/sensitive
   - When task names are long they go through the edit and delete buttons
