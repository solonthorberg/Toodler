import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ← vector icon

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
  color?: string;     // header tint color
  size?: number;      // icon size
};

export default function HeaderAddButton({
  onPress,
  accessibilityLabel = "Add",
  style,
  color = "#111",
  size = 24,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={[styles.btn, style]}
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name="add" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
