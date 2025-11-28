import DeleteButton from "@/src/components/buttons/deleteButton";
import UpdateButton from "@/src/components/buttons/updateButton";
import { Task } from "@/src/types/task";
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  Text,
  View,
} from "react-native";
import styles from "./styles";

type Props = {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onUpdate?: (taskId: number) => void;
  onLongPress?: (task: Task) => void;
  onDragStart?: (task: Task) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: (id: number, x: number, y: number) => void;
};

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
  onLongPress,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) {
  const handleUpdate = () => {
    onUpdate?.(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const [dragging, setDragging] = useState<boolean>(false);
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  let dragTimeout: ReturnType<typeof setTimeout> | null = null;

  const enableDrag = !!(onDragStart && onDragEnd);

  const setScale = (toValue: number, duration: number): void => {
    Animated.timing(scale, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const startDrag = () => {
    if (!enableDrag) return;
    setDragging(true);
    if (onDragStart) {
      onDragStart?.(task);
    }
    position.setOffset({
      x: (position.x as any)._value,
      y: (position.y as any)._value,
    });
    position.setValue({ x: 0, y: 0 });
    setScale(1.1, 150);
  };

  const endDrag = (gestureState: PanResponderGestureState) => {
    if (!enableDrag) return;
    if (onDragEnd) {
      onDragEnd?.(task.id, gestureState.moveX, gestureState.moveY);
    }
    setDragging(false);
    setScale(1, 150);
    position.flattenOffset();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableDrag,
      onPanResponderGrant: () => {
        dragTimeout = setTimeout(() => {
          startDrag();
        }, 150);
      },

      onPanResponderMove: (_, gestureState) => {
        if (!enableDrag) return;
        const { dx, dy } = gestureState;
        position.setValue({ x: dx, y: dy });
        if (onDragMove) {
          onDragMove?.(gestureState.moveX, gestureState.moveY);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (dragTimeout) clearTimeout(dragTimeout);
        endDrag(gestureState);
      },
    }),
  ).current;

  const animatedStyles = [
    styles.card,
    {
      zIndex: dragging ? 100 : 0,
      transform: [...position.getTranslateTransform(), { scale }],
    },
  ];

  return (
    <Pressable
      onLongPress={() => {
        if (enableDrag) {
          onDragStart?.(task);
        } else if (onLongPress) {
          onLongPress(task);
        }
      }}
      delayLongPress={300}
    >
      <Animated.View
        style={[animatedStyles, { overflow: "visible" }]}
        {...(enableDrag ? panResponder.panHandlers : {})}
      >
        <View style={styles.headerRow}>
          <Pressable
            style={[styles.circle, task.isFinished && styles.circleDone]}
            onPress={() => onToggleComplete(task.id)}
            accessibilityLabel={
              task.isFinished ? "Mark as not done" : "Mark as done"
            }
          >
            {task.isFinished && <Text style={styles.check}>✓</Text>}
          </Pressable>

          <Text style={styles.title}>{task.name}</Text>
        </View>

        {onUpdate && (
          <View style={styles.buttonContainer}>
            <UpdateButton onPress={handleUpdate} style={styles.actionButton} />
            <DeleteButton onPress={handleDelete} style={styles.actionButton} />
          </View>
        )}

        <View style={styles.separator} />
        {!!task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
