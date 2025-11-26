import { View, Text, Pressable, StyleSheet } from "react-native";

type BottomBarProps = {
  onHomePress?: () => void;
  onAddPress?: () => void;
  onBackPress?: () => void;
};

export default function BottomBar({
  onHomePress,
  onAddPress,
  onBackPress,
}: BottomBarProps) {
  return (
    <View style={styles.container}>
      {/* Home button */}
      <Pressable style={styles.smallButton} onPress={onHomePress}>
        <Text style={styles.smallButtonText}>🏠</Text>
      </Pressable>

      {/* Big + button */}
      <Pressable style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      {/* Back button */}
      <Pressable style={styles.smallButton} onPress={onBackPress}>
        <Text style={styles.smallButtonText}>←</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#55545f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },
  smallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
  },
  smallButtonText: {
    fontStyle: "normal",
    fontWeight: "100",
    fontSize: 70,
    lineHeight: 80,
    justifyContent: "center"
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#878484",
  },
  addButtonText: {
    fontStyle: "normal",
    fontWeight: "100",
    fontSize: 130,
    lineHeight: 105,
    justifyContent: "center"
  },
});