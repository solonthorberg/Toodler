import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTintColor: "black",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Boards",
          }}
        />

        {/* Lists screen */}
        <Stack.Screen
          name="lists/[boardId]"
          options={({ route }) => ({
            headerTitle: "Lists",
          })}
        />

        {/* Tasks screen */}
        <Stack.Screen
          name="tasks/[listId]"
          options={({ route }) => ({
            headerTitle: "Tasks",
          })}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
