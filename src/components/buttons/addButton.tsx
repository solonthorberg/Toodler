// src/components/buttons/AddButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode,
  isValidElement,
  cloneElement,
} from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import styles from "./styles";

export type AddButtonHandle = {
  open: () => void;
  close: () => void;
};

type AddButtonProps = {
  children: ReactNode; // backward-compatible: any node
  accessibilityLabel?: string;
};

const AddButton = forwardRef<AddButtonHandle, AddButtonProps>(
  ({ children, accessibilityLabel = "Add item" }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const handleClose = () => setOpen(false);

    // Only inject onClose if child is a valid element
    const content = isValidElement(children)
      ? cloneElement(children, { onClose: handleClose } as any)
      : children;

    return (
      <>
        {/* Floating + button (kept for backward compatibility) */}
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
            <Pressable
              style={styles.sheet}
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
              >
                {content}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  },
);

export default AddButton;
