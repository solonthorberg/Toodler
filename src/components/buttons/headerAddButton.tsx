import { blackDefault } from "@/src/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import styles from "./styles";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};

export default function HeaderAddButton({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={[styles.headerButton, style]}
    >
      <Ionicons name="add" size={24} color={blackDefault} />
    </Pressable>
  );
}
