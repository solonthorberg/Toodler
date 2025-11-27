import { Task } from "@/src/types/task";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import styles from "./styles";

interface TaskFormProps {
  listId: number;
  onCreate?: (payload: { name: string; description: string }) => void;
  onUpdate?: (payload: { name: string; description: string }) => void;
  onClose?: () => void;
  initialValues?: Task;
}

export default function TaskForm({
  listId,
  onCreate,
  onUpdate,
  onClose,
  initialValues,
}: TaskFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [loading, setLoading] = useState(false);

  const isUpdateMode = !!onUpdate;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Task name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      console.log(
        `${isUpdateMode ? "Updating" : "Creating"} task with payload:`,
        payload,
      );

      if (isUpdateMode) {
        onUpdate?.(payload);
      } else {
        onCreate?.(payload);
      }

      // Only clear form on create, not update (modal will close)
      if (!isUpdateMode) {
        setName("");
        setDescription("");
      }

      onClose?.();
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} task:`,
        error,
      );
      Alert.alert(
        "Error",
        `Failed to ${isUpdateMode ? "update" : "create"} task. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to initial values on cancel for update mode
    if (isUpdateMode && initialValues) {
      setName(initialValues.name ?? "");
      setDescription(initialValues.description ?? "");
    } else {
      // Clear for create mode
      setName("");
      setDescription("");
    }
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>
        {isUpdateMode ? "Edit Task" : "New Task"}
      </Text>

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
        onSubmitEditing={handleSubmit}
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
          onPress={handleSubmit}
          disabled={loading || !name.trim()}
        >
          <Text style={[styles.btnText, { color: "white" }]}>
            {loading
              ? `${isUpdateMode ? "Updating" : "Creating"}...`
              : isUpdateMode
                ? "Update"
                : "Create"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
