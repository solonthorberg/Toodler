import AddButton, { AddButtonHandle } from "@/src/components/buttons/addButton"; // ← match main's path/casing
import HeaderAddButton from "@/src/components/buttons/headerAddButton";
import ListCard from "@/src/components/cards/listCard/listCard";
import ListForm from "@/src/components/forms/listForm"; // ← match main's path/casing
import { boardService } from "@/src/services/boardService";
import { listService } from "@/src/services/listService";
import { taskService } from "@/src/services/taskService";
import { List } from "@/src/types/list";
import sharedStyles from "@/src/views/styles";

import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function ListsMain() {
  const { boardId } = useLocalSearchParams();
  const id = Number(boardId);

  const [lists, setLists] = useState<List[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [_draggingTask, setDraggingTask] = useState<any | null>(null);
  const [_dragX, setDragX] = useState(0);
  const [_dragY, setDragY] = useState(0);
  const [listBoxes, setListBoxes] = useState<Record<number, any>>({});
  const [originalList, setOriginalList] = useState<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

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

  const handleMeasureList = (listId: number, layout: any) => {
    setListBoxes((prev) => ({ ...prev, [listId]: layout }));
  };

  const getTargetList = (x: number, y: number): number | null => {
    for (const listId in listBoxes) {
      const box = listBoxes[listId];
      if (
        x >= box.x &&
        x <= box.x + box.width &&
        y >= box.y &&
        y <= box.y + box.height
      ) {
        return Number(listId);
      }
    }
    return null;
  };

  const handleDragStart = (task: any) => {
    setDraggingTask(task);
    setOriginalList(task.listId);
    setScrollEnabled(false);
  };

  const handleDragMove = (x: number, y: number) => {
    setDragX(x);
    setDragY(y);
  };

  const handleDragEnd = (taskId: number, x: number, y: number) => {
    const targetList = getTargetList(x, y);
    if (targetList && targetList !== originalList) {
      taskService.updateTask(taskId, { listId: targetList });
    }
    setDraggingTask(null);
    setScrollEnabled(true);
    loadListsForBoard();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <View style={[sharedStyles.container, { overflow: "visible" }]}>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 300 }}
        scrollEnabled={scrollEnabled}
      >
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
              onMeasureList={handleMeasureList}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          ))
        )}

        {/* Footer AddButton; header + triggers ref.open() */}
        <AddButton ref={addRef} accessibilityLabel="Add list">
          <ListForm onCreate={handleCreateList} boardId={id} />
        </AddButton>
      </ScrollView>
    </View>
  );
}
