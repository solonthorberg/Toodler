import BottomBar from "@/src/components/navbanner";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import seed from "../../data/data.json"; // loads boards, lists, tasks

type Task = {
  id: number;
  name: string;
  description: string;
  isFinished: boolean;
  listId: number;
};

export default function Main() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // take the tasks array from data.json
    setTasks(seed.tasks as Task[]);
  }, []);

  // Show tasks from only list ID 1
  const tasksForList1 = tasks.filter((t) => t.listId === 1);

  return (
    <View style={{ flex: 1, paddingBottom: 80 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Tasks for list 1</Text>

      {/* Display task names */}
      {tasksForList1.map((task) => (
        <Text key={task.id} style={{ fontSize: 18 }}>
          {task.isFinished ? "✅" : "⭕"} {task.name}
        </Text>
      ))}

      {/* ✔ Test button to navigate to the task screen */}
      <Link href="/tasks/1" asChild>
        <Pressable
          style={{
            marginTop: 30,
            padding: 12,
            backgroundColor: "#ddd",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18 }}>Go to Task (list 1)</Text>
        </Pressable>
      </Link>

      {/* Bottom navigation bar */}
      <BottomBar
        onHomePress={() => console.log("Home")}
        onAddPress={() => console.log("Add")}
        onBackPress={() => console.log("Back")}
      />
    </View>
  );
}
