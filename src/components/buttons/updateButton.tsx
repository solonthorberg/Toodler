import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import styles from "./styles";

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

export default function updateButton({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
      style={[styles.updateButton, style]}
    >
      <Text style={styles.icon}>✏️</Text>
    </Pressable>
  );
}
