import AddButton from "@/src/components/buttons/addButton";
import HeaderAddButton from "@/src/components/buttons/headerAddButton2";
import BoardCard from "@/src/components/cards/boardCard/boardCard";
import BoardForm from "@/src/components/forms/boardForm";
import { boardService } from "@/src/services/boardService";
import { Board } from "@/src/types/board";
import sharedStyles from "@/src/views/styles";

import { Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const loadBoards = useCallback(() => {
    try {
      const data = boardService.getBoards() as Board[];
      setBoards(data);
    } catch (error) {
      console.error("Error loading boards:", error);
    }
  }, []);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const sortedBoards = useMemo(
    () => [...boards].sort((a, b) => a.name.localeCompare(b.name)),
    [boards],
  );

  const handleCreateBoard = useCallback((payload: any) => {
    try {
      if (!payload.name?.trim()) return;

      const newBoard = boardService.addBoard(
        payload.name,
        payload.description || "",
        payload.thumbnailPhoto || "",
      );

      setBoards((prev) => [...prev, newBoard]);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }, []);

  const handleDeleteBoard = useCallback(
    (boardId: number) => {
      boardService.deleteBoard(boardId);
      loadBoards();
    },
    [loadBoards],
  );

  const openUpdateModal = useCallback(
    (boardId: number) => {
      const board = boards.find((b) => b.id === boardId);
      if (board) {
        setSelectedBoard(board);
        setUpdateModalOpen(true);
      }
    },
    [boards],
  );

  const closeUpdateModal = useCallback(() => {
    setUpdateModalOpen(false);
    setSelectedBoard(null);
  }, []);

  const handleUpdateBoard = useCallback(
    (payload: any) => {
      try {
        if (!selectedBoard || !payload.name?.trim()) return;

        boardService.updateBoard(selectedBoard.id, {
          name: payload.name,
          description: payload.description || "",
          thumbnailPhoto: payload.thumbnailPhoto || "",
        });

        loadBoards();
        closeUpdateModal();
      } catch (error) {
        console.error("Error updating board:", error);
      }
    },
    [selectedBoard, loadBoards, closeUpdateModal],
  );

  return (
    <View style={sharedStyles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderAddButton onPress={() => setAddModalOpen(true)} />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.title}>Boards</Text>

        {boards.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyText}>
              No boards yet. Create your first board!!
            </Text>
          </View>
        ) : (
          sortedBoards.map((board) => (
            <BoardCard
              key={board.id.toString()}
              board={{ ...board, description: board.description ?? "" }}
              onDelete={handleDeleteBoard}
              onUpdate={openUpdateModal}
            />
          ))
        )}

        <AddButton onPress={() => setAddModalOpen(true)} />
      </ScrollView>

      <Modal
        visible={addModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={sharedStyles.backdrop}>
          <View style={sharedStyles.sheet}>
            <View style={sharedStyles.scrollContent}>
              <BoardForm
                onCreate={handleCreateBoard}
                onClose={() => setAddModalOpen(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={updateModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeUpdateModal}
      >
        <View style={sharedStyles.backdrop}>
          <View style={sharedStyles.sheet}>
            <View style={sharedStyles.scrollContent}>
              <BoardForm
                onUpdate={handleUpdateBoard}
                initialValues={selectedBoard || undefined}
                onClose={closeUpdateModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
