import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{ 
          headerTintColor: 'black',
          headerTitleStyle: { 
            fontWeight: 'bold' } }}
      >
        {/* Boards screen */}
        <Stack.Screen 
          name="index" 
          options={{ headerTitle: "Board" }} 
          />

        {/* Lists screen */}
        <Stack.Screen 
          name="lists/[boardId]" 
          options={{ headerTitle: "Lists" }} 
          />

        {/* Tasks screen */}
        <Stack.Screen 
          name="tasks/[listId]" 
          options={{ headerTitle: "Task" }} 
          />
      </Stack>
    </GestureHandlerRootView>
  );
}
