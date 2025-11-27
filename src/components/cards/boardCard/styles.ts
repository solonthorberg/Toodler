import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  banner: { height: 96, width: "100%" },
  body: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  desc: { fontSize: 14, color: "#666" },

  updateButtonPosition: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  deleteButtonPosition: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },

  deleteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  deleteText: {
    fontSize: 14,
  },
});
