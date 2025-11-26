import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface BoardFormProps {
  onCreate: (payload: {
    scope: "board";
    name: string;
    description: string;
    thumbnailPhoto: string;
    createdAt: number;
  }) => void;
  onClose?: () => void;
}

export default function BoardForm({ onCreate, onClose }: BoardFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPhoto, setThumbnailPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Board name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        scope: "board" as const,
        name: name.trim(),
        description: description.trim(),
        thumbnailPhoto: thumbnailPhoto.trim(),
        createdAt: Date.now(),
      };

      console.log("Creating board with payload:", payload);
      onCreate(payload);

      setName("");
      setDescription("");
      setThumbnailPhoto("");

      onClose?.();
    } catch (error) {
      console.error("Error creating board:", error);
      Alert.alert("Error", "Failed to create board. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setThumbnailPhoto("");
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>New Board</Text>

      <TextInput
        placeholder="Board name *"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        style={styles.input}
        editable={!loading}
        maxLength={100}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        editable={!loading}
        maxLength={500}
        multiline
        numberOfLines={3}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Thumbnail URL (optional)"
        placeholderTextColor="#888"
        value={thumbnailPhoto}
        onChangeText={setThumbnailPhoto}
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
