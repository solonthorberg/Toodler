import React, { useMemo, useState } from "react";
import { Pressable, Text, View, ScrollView } from "react-native";
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import type { List } from "@/src/types/list";
import styles from "./styles";

type Props = {
  currentListId: number;
  taskName?: string;                     
  onMove: (targetListId: number) => void;
  onClose: () => void;
};

export default function TaskMoveCard({ currentListId, taskName, onMove, onClose }: Props) {
  const currentList = listService.getListById(currentListId);
  const currentBoardId = currentList?.boardId ?? null;

  const otherBoards = useMemo(() => {
    const all = boardService.getBoards();
    return currentBoardId == null ? all : all.filter((b) => b.id !== currentBoardId);
  }, [currentBoardId]);

  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(
    otherBoards.length > 0 ? otherBoards[0].id : null
  );
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const listsForBoard: List[] = useMemo(() => {
    return selectedBoardId != null ? listService.getListsByBoardId(selectedBoardId) : [];
  }, [selectedBoardId]);

  const canMove = selectedListId != null && selectedListId !== currentListId;

  const displayName =
    (taskName?.trim().length ? taskName!.trim() : "Task").slice(0, 60);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Move: {displayName}</Text>   

      {/* === BOARDS box (same look as lists) === */}
      <View style={[styles.inputBox, styles.box]}>
        <Text style={styles.label}>Choose board</Text>

        {otherBoards.length === 0 ? (
          <Text style={styles.muted}>No other boards available.</Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.listCol}
            showsVerticalScrollIndicator={false}
          >
            {otherBoards.map((b) => {
              const selected = selectedBoardId === b.id;
              return (
                <Pressable
                  key={b.id}
                  onPress={() => {
                    setSelectedBoardId(b.id);
                    setSelectedListId(null);
                  }}
                  style={[styles.listRow, selected && styles.listRowSelected]}  
                >
                  <View style={[styles.dot, { backgroundColor: "#bbb" }]} />
                  <Text style={styles.listText}>{b.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* === LISTS box === */}
      <View style={[styles.inputBox, styles.box]}>
        <Text style={styles.label}>Choose list</Text>

        {selectedBoardId == null ? (
          <Text style={styles.muted}>Select a board first.</Text>
        ) : listsForBoard.length === 0 ? (
          <Text style={styles.muted}>No lists in this board.</Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.listCol}  
            showsVerticalScrollIndicator={false}
          >
            {listsForBoard.map((l) => {
              const selected = selectedListId === l.id;
              return (
                <Pressable
                  key={l.id}
                  onPress={() => setSelectedListId(l.id)}
                  style={[styles.listRow, selected && styles.listRowSelected]}
                >
                  <View style={[styles.dot, { backgroundColor: l.color ?? "#ddd" }]} />
                  <Text style={styles.listText}>{l.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={onClose} style={[styles.btn, styles.ghost]}>
          <Text style={styles.btnText}>Cancel</Text>
        </Pressable>
        <Pressable
          disabled={!canMove}
          onPress={() => selectedListId && onMove(selectedListId)}
          style={[styles.btn, styles.primary, !canMove && { opacity: 0.4 }]}
        >
          <Text style={[styles.btnText, { color: "#fff" }]}>Move</Text>
        </Pressable>
      </View>
    </View>
  );
}
