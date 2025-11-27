import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { DEFAULT_COLOR, PALETTE } from "../../styles/colors";
import styles from "./styles";

const NONE = "__NONE__" as const;

// Light gray default (slightly darker than white so it stands out)
// tweak if you want lighter/darker: "#F3F4F6" (lighter) or "#D1D5DB" (darker)

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
  const [color, setColor] = useState<string | typeof NONE>(""); // can be hex string or NONE
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
        // If "No color" chosen -> "", otherwise if nothing chosen -> light gray default
        color:
          color === NONE
            ? DEFAULT_COLOR
            : String(color).trim() || DEFAULT_COLOR,
      };

      onCreate(payload);

      // reset and close
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

      {/* Color picker in an input-like box */}
      <View style={[styles.input, styles.colorBox]}>
        <Text style={styles.label}>Color (optional)</Text>

        <View style={styles.swatchGrid}>
          {/* palette swatches */}
          {PALETTE.map((c) => {
            const selected = color === c; // no auto-select; starts with no selection
            return (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                accessibilityRole="button"
                accessibilityLabel={`Choose color ${c}`}
                style={[
                  styles.swatchWrap,
                  selected && styles.swatchWrapSelected,
                ]}
                disabled={loading}
              >
                <View style={[styles.swatch, { backgroundColor: c }]} />
              </Pressable>
            );
          })}

          {/* "No color" swatch */}
          <Pressable
            key="__none__"
            onPress={() => setColor(NONE)}
            accessibilityRole="button"
            accessibilityLabel="No color"
            style={[
              styles.swatchWrap,
              color === NONE && styles.swatchWrapSelected,
            ]}
            disabled={loading}
          >
            <View style={styles.noneSwatch}>
              <Text style={styles.noneX}>×</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Actions */}
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
