import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import styles from "./styles";

interface ListFormProps {
  boardId: number;
  onCreate: (payload: { boardId: number; name: string; color: string }) => void;
  onClose?: () => void;
}

export default function ListForm({
  boardId,
  onCreate,
  onClose,
}: ListFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "List name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        boardId,
        name: name.trim(),
        color: color.trim() || "#3B82F6",
      };

      console.log("Creating list with payload:", payload);
      onCreate(payload);

      setName("");
      setColor("");

      onClose?.();
    } catch (error) {
      console.error("Error creating list:", error);
      Alert.alert("Error", "Failed to create list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setColor("");
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>New List</Text>

      <TextInput
        placeholder="List name *"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        style={styles.input}
        editable={!loading}
        maxLength={100}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Color (optional)"
        placeholderTextColor="#888"
        value={color}
        onChangeText={setColor}
        style={styles.input}
        editable={!loading}
        autoCapitalize="none"
        autoCorrect={false}
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
