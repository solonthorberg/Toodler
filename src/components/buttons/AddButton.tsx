import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ReactElement,
} from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import styles from "./styles";

export type AddButtonHandle = {
  open: () => void;
  close: () => void;
};

// 👇 child must be a single React element that can accept onClose
type ChildWithOnClose = { onClose?: () => void };

interface AddButtonProps {
  children: ReactElement<ChildWithOnClose>;
  accessibilityLabel?: string;
}

const AddButton = forwardRef<AddButtonHandle, AddButtonProps>(
  ({ children, accessibilityLabel = "Add item" }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const handleClose = () => setOpen(false);

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
                {React.cloneElement(children, { onClose: handleClose })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }
);

export default AddButton;
