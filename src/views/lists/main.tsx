import HeaderAddButton from "@/src/components/buttons/HeaderAddButton";
import AddButton, { AddButtonHandle } from "@/src/components/buttons/addButton"; // ← match main's path/casing
import ListCard from "@/src/components/cards/listCard/listCard";
import ListForm from "@/src/components/forms/listForm";                           // ← match main's path/casing
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { List } from "@/src/types/list";
import sharedStyles from "@/src/views/styles";

import { useFocusEffect, useLocalSearchParams, Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);

  const [lists, setLists] = useState<List[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // === update modal state (from main) ===
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  // header "+" controls this AddButton via ref
  const addRef = useRef<AddButtonHandle>(null);

  const currentBoard = boardService.getBoardById(id);

  const loadListsForBoard = useCallback(() => {
    try {
      const data = listService.getListsByBoardId(id);
      setLists(data);
    } catch (error) {
      console.error("Error loading lists:", error);
      setLists([]);
    }
  }, [id]);

  useEffect(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const handleCreateList = useCallback(
    (payload: { boardId: number; name: string; color: string }) => {
      try {
        const newList = listService.addList(
          payload.boardId,
          payload.name,
          payload.color,
        );

        setLists((prev) => {
          const exists = prev.some((l) => l.id === newList.id);
          return exists ? prev : [...prev, newList];
        });
      } catch (error) {
        console.error("Error creating list:", error);
      }
    },
    [],
  );

  // === update handlers (from main) ===
  const openUpdateModal = useCallback(
    (listId: number) => {
      const list = lists.find((l) => l.id === listId);
      if (list) {
        setSelectedList(list);
        setUpdateModalOpen(true);
      }
    },
    [lists],
  );

  const closeUpdateModal = useCallback(() => {
    setUpdateModalOpen(false);
    setSelectedList(null);
  }, []);

  const handleUpdateList = useCallback(
    (payload: { name: string; color: string }) => {
      try {
        if (!selectedList || !payload.name?.trim()) return;

        listService.updateList(selectedList.id, {
          name: payload.name,
          color: payload.color,
        });

        loadListsForBoard();
        closeUpdateModal();
      } catch (error) {
        console.error("Error updating list:", error);
      }
    },
    [selectedList, loadListsForBoard, closeUpdateModal],
  );

  const handleListDeleted = useCallback(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  return (
    <View style={sharedStyles.container}>
      {/* Header + opens the same AddButton modal via ref */}
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderAddButton
              onPress={() => addRef.current?.open()}
              accessibilityLabel="Add list"
              color={tintColor ?? "#111"}
            />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.subtitle}>
          {currentBoard?.name ?? "Lists"}
        </Text>

        {lists.length === 0 ? (
          <View style={sharedStyles.emptyState}>
            <Text style={sharedStyles.emptyText}>
              Looks empty... Create your first list!!
            </Text>
          </View>
        ) : (
          lists.map((list) => (
            <ListCard
              key={`${list.id}-${refreshKey}`}
              list={list}
              onListDeleted={handleListDeleted}
              onUpdate={openUpdateModal} 
            />
          ))
        )}

        {/* Footer AddButton; header + triggers ref.open() */}
        <AddButton ref={addRef} accessibilityLabel="Add list">
          <ListForm onCreate={handleCreateList} boardId={id} />
        </AddButton>
      </ScrollView>

      {/* Update modal (parity with main) */}
      <Modal
        visible={updateModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeUpdateModal}
      >
        <View style={sharedStyles.backdrop}>
          <View style={sharedStyles.sheet}>
            <View style={sharedStyles.scrollContent}>
              <ListForm
                onUpdate={handleUpdateList}
                initialValues={selectedList || undefined}
                onClose={closeUpdateModal}
                boardId={id}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
