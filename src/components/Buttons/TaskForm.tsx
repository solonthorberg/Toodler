import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface TaskFormProps {
  listId: number;
  onCreate: (payload: {
    scope: "task";
    listId: number;
    name: string;
    description: string;
    createdAt: number;
  }) => void;
  onClose?: () => void;
}

export default function TaskForm({ listId, onCreate, onClose }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Task name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        scope: "task" as const,
        listId,
        name: name.trim(),
        description: description.trim(),
        createdAt: Date.now(),
      };

      console.log("Creating task with payload:", payload);
      onCreate(payload);

      setName("");
      setDescription("");

      onClose?.();
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>New Task</Text>

      <TextInput
        placeholder="Task name *"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        style={styles.input}
        editable={!loading}
        maxLength={200}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        editable={!loading}
        maxLength={1000}
        multiline
        numberOfLines={3}
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />

      <View style={styles.row}>
        <Pressable
          onPress={handleCancel}
          style={[styles.btn, styles.ghost]}
          disabled={loading}
        >
          <Text style={[styles.btnText, { opacity: loading ? 0.5 : 1 }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.btn,
            styles.primary,
            { opacity: loading || !name.trim() ? 0.5 : 1 },
          ]}
          onPress={handleCreate}
          disabled={loading || !name.trim()}
        >
          <Text style={[styles.btnText, { color: "white" }]}>
            {loading ? "Creating..." : "Create"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 44,
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  ghost: {
    backgroundColor: "#eee",
  },
  primary: {
    backgroundColor: "#111",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
