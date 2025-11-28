import AddButton from "@/src/components/buttons/addButton";
import HeaderAddButton from "@/src/components/buttons/headerAddButton";
import ListCard from "@/src/components/cards/listCard/listCard";
import ListForm from "@/src/components/forms/listForm";
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { List } from "@/src/types/list";
import sharedStyles from "@/src/views/styles";

import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);

  const [lists, setLists] = useState<List[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

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
        setAddModalOpen(false);
      } catch (error) {
        console.error("Error creating list:", error);
      }
    },
    [],
  );

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
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderAddButton onPress={() => setAddModalOpen(true)} />
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
              <ListForm
                onCreate={handleCreateList}
                boardId={id}
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
