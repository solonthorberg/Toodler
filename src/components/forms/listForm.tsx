import { List } from "@/src/types/list";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { palette, whiteDefault } from "../../styles/colors";
import styles from "./styles";

const NONE = "__NONE__" as const;

interface ListFormProps {
  boardId: number;
  onCreate?: (payload: {
    boardId: number;
    name: string;
    color: string;
  }) => void;
  onUpdate?: (payload: { name: string; color: string }) => void;
  onClose?: () => void;
  initialValues?: List;
}

export default function ListForm({
  boardId,
  onCreate,
  onUpdate,
  onClose,
  initialValues,
}: ListFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [color, setColor] = useState<string | typeof NONE>(
    initialValues?.color ?? "",
  );
  const [loading, setLoading] = useState(false);

  const isUpdateMode = !!onUpdate;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "List name is required");
      return;
    }

    try {
      setLoading(true);

      const colorValue =
        color === NONE ? whiteDefault : String(color).trim() || whiteDefault;

      if (isUpdateMode) {
        const payload = {
          name: name.trim(),
          color: colorValue,
        };
        onUpdate?.(payload);
      } else {
        const payload = {
          boardId,
          name: name.trim(),
          color: colorValue,
        };
        onCreate?.(payload);
      }
      if (!isUpdateMode) {
        setName("");
        setColor("");
      }

      onClose?.();
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} list:`,
        error,
      );
      Alert.alert(
        "Error",
        `Failed to ${isUpdateMode ? "update" : "create"} list. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isUpdateMode && initialValues) {
      setName(initialValues.name ?? "");
      setColor(initialValues.color ?? "");
    } else {
      setName("");
      setColor("");
    }
    onClose?.();
  };

  return (
    <>
      <Text style={styles.title}>
        {isUpdateMode ? "Edit List" : "New List"}
      </Text>

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

      <View style={[styles.input, styles.colorBox]}>
        <Text style={styles.label}>Color (optional)</Text>

        <View style={styles.swatchGrid}>
          {palette.map((c) => {
            const selected = color === c;
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
