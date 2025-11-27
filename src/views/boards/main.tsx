import AddButton from "@/src/components/buttons/AddButton";
import BoardCard from "@/src/components/cards/boardCard/boardCard";
import BoardForm from "@/src/components/forms/boardForm";
import { boardService } from "@/src/services/boardService";
import { Board } from "@/src/types/board";
import sharedStyles from "@/src/views/styles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function BoardsMain() {
  const [boards, setBoards] = useState<Board[]>([]);
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
      if (!payload.name?.trim()) {
        return;
      }

      const newBoard = boardService.addBoard(
        payload.name,
        payload.description || "",
        payload.thumbnailPhoto || "",
      );

      setBoards((prevBoards) => {
        const updatedBoards = [...prevBoards, newBoard];
        return updatedBoards;
      });
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

  const handleUpdateBoard = useCallback(
    (payload: any) => {
      try {
        if (!selectedBoard || !payload.name?.trim()) {
          return;
        }

        boardService.updateBoard(selectedBoard.id, {
          name: payload.name,
          description: payload.description || "",
          thumbnailPhoto: payload.thumbnailPhoto || "",
        });

        loadBoards();
        setUpdateModalOpen(false);
        setSelectedBoard(null);
      } catch (error) {
        console.error("Error updating board:", error);
      }
    },
    [selectedBoard, loadBoards],
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

  return (
    <View style={sharedStyles.container}>
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

        <AddButton accessibilityLabel="Add board">
          <BoardForm onCreate={handleCreateBoard} />
        </AddButton>
      </ScrollView>

      <Modal
        visible={updateModalOpen}
        transparent={true}
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
