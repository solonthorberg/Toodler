import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddButton from "../src/components/AddButton"; // adjust path if you use aliases

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTintColor: "black",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Boards screen */}
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Boards/Main",
            headerRight: () => <AddButton scope="board" />,
          }}
        />

        {/* Lists screen */}
        <Stack.Screen
          name="lists/[boardId]"
          options={({ route }) => ({
            headerTitle: "Lists",
            headerRight: () => (
              <AddButton
                scope="list"
                parentId={(route.params as any)?.boardId}
              />
            ),
          })}
        />

        {/* Tasks screen */}
        <Stack.Screen
          name="tasks/[listId]"
          options={({ route }) => ({
            headerTitle: "Tasks",
            headerRight: () => (
              <AddButton
                scope="task"
                parentId={(route.params as any)?.listId}
              />
            ),
          })}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
