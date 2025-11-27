import AddButton from "@/src/components/buttons/addButton";
import ListCard from "@/src/components/cards/listCard/listCard";
import ListForm from "@/src/components/Forms/listForm";
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { List } from "@/src/types/list";
import sharedStyles from "@/src/views/styles";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);
  const [lists, setLists] = useState<List[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const handleCreateList = useCallback(
    (payload: { boardId: number; name: string; color: string }) => {
      try {
        const newList = listService.addList(
          payload.boardId,
          payload.name,
          payload.color,
        );

        setLists((prevLists) => {
          const exists = prevLists.some((list) => list.id === newList.id);
          if (exists) {
            return prevLists;
          }
          return [...prevLists, newList];
        });
      } catch (error) {
        console.error("Error creating list:", error);
      }
    },
    [],
  );

  const handleUpdateList = useCallback(
    (payload: { name: string; color: string }) => {
      try {
        if (!selectedList || !payload.name?.trim()) {
          return;
        }

        listService.updateList(selectedList.id, {
          name: payload.name,
          color: payload.color,
        });

        loadListsForBoard();
        setUpdateModalOpen(false);
        setSelectedList(null);
      } catch (error) {
        console.error("Error updating list:", error);
      }
    },
    [selectedList, loadListsForBoard],
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

  const handleListDeleted = useCallback(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  useEffect(() => {
    loadListsForBoard();
  }, [loadListsForBoard]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    <View style={sharedStyles.container}>
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

        <AddButton accessibilityLabel="Add list">
          <ListForm onCreate={handleCreateList} boardId={id} />
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
