import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import styles from "./styles";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};

export default function AddButton({ onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.addButton, style]}>
      <Ionicons name="add" size={24} />
    </Pressable>
  );
}
