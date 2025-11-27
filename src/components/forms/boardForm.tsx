import { Board } from "@/src/types/board";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import styles from "./styles";

interface BoardFormProps {
  onCreate?: (payload: {
    name: string;
    description: string;
    thumbnailPhoto: string;
  }) => void;
  onUpdate?: (payload: {
    name: string;
    description: string;
    thumbnailPhoto: string;
  }) => void;
  onClose?: () => void;
  initialValues?: Board;
}

export default function BoardForm({
  onCreate,
  onUpdate,
  onClose,
  initialValues,
}: BoardFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [thumbnailPhoto, setThumbnailPhoto] = useState(
    initialValues?.thumbnailPhoto ?? "",
  );
  const [loading, setLoading] = useState(false);

  const isUpdateMode = !!onUpdate;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Board name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        thumbnailPhoto: thumbnailPhoto.trim(),
      };

      if (isUpdateMode) {
        onUpdate?.(payload);
      } else {
        onCreate?.(payload);
      }

      if (!isUpdateMode) {
        setName("");
        setDescription("");
        setThumbnailPhoto("");
      }

      onClose?.();
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} board:`,
        error,
      );
      Alert.alert(
        "Error",
        `Failed to ${isUpdateMode ? "update" : "create"} board. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isUpdateMode && initialValues) {
      setName(initialValues.name ?? "");
      setDescription(initialValues.description ?? "");
      setThumbnailPhoto(initialValues.thumbnailPhoto ?? "");
    } else {
      setName("");
      setDescription("");
      setThumbnailPhoto("");
    }
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>
        {isUpdateMode ? "Edit Board" : "New Board"}
      </Text>

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
