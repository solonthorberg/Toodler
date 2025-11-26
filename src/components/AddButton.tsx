import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Scope = "board" | "list" | "task";

export default function AddButton({
  scope,
  parentId,
  onCreate, // optional hook to your state/store
}: {
  scope: Scope;
  parentId?: string;
  onCreate?: (payload: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel={`Add ${scope}`}
        style={{ paddingHorizontal: 8 }}
      >
        <Ionicons name="add" size={24} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>
              {scope === "board"
                ? "New Board"
                : scope === "list"
                  ? "New List"
                  : "New Task"}
            </Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {(scope === "board" || scope === "task") && (
              <TextInput
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
            )}

            {/* You can add extra fields here (e.g., color for list, thumbnail for board) */}

            <View style={styles.row}>
              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.btn, styles.ghost]}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.primary]}
                onPress={() => {
                  onCreate?.({
                    scope,
                    parentId,
                    name,
                    description,
                    createdAt: Date.now(),
                  });
                  setOpen(false);
                  setName("");
                  setDescription("");
                }}
              >
                <Text style={{ color: "white" }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ghost: { backgroundColor: "#eee" },
  primary: { backgroundColor: "#111" },
});
