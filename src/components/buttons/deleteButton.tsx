import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import styles from "./styles";

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

export default function DeleteButton({ onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.deleteButton, style]}>
      <Text style={styles.icon}>🗑️</Text>
    </Pressable>
  );
}
