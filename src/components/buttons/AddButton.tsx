import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import styles from "./styles";

interface AddButtonProps {
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export default function AddButton({
  children,
  accessibilityLabel = "Add item",
}: AddButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel={accessibilityLabel}
        style={styles.addButton}
      >
        <Ionicons name="add" size={24} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {React.cloneElement(
                children as React.ReactElement,
                {
                  onClose: handleClose,
                } as any,
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
