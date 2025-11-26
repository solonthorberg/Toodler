import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(boards)" />
      <Stack.Screen name="(lists)" />
      <Stack.Screen name="(tasks)" />
    </Stack>
  );
}
