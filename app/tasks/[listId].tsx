import data from "@/data/data.json";
import NavBanner from "@/src/components/navbanner";
import TaskCard from "@/src/components/taskCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type Task = {
  id: number;
  name: string;
  description: string;
  isFinished: boolean;
  listId: number;
};

export default function TasksScreen() {
  const { listId } = useLocalSearchParams();
  const router = useRouter();
  const numericListId = Number(listId);

  const tasksForList = useMemo(
    () => (data.tasks as Task[]).filter((t) => t.listId === numericListId),
    [numericListId]
  );

  const currentList = (data.lists as any[]).find(
    (l) => l.id === numericListId
  );

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {tasksForList.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {/* --- Add Task Box --- */}
        <Pressable
          onPress={() => console.log("Add new task")}
          style={{
            marginTop: 12,
            marginBottom: 20,
            backgroundColor: "#ffffff",
            borderRadius: 18,
            paddingVertical: 18,
            paddingHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#555" }}>
            + Add Task
          </Text>
        </Pressable>
      </ScrollView>

      {/* Bottom navigation bar */}
      <NavBanner
        onBackPress={() => router.back()}
        onAddPress={() => console.log("Add new task")}
      />
    </View>
  );
}
