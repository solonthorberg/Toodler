import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  // Matches your "New List" input look
  box: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  inputBox: {
    padding: 10,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },

  // Scrolling region inside each box
  scroll: {
    maxHeight: 160,
  },

  // Shared vertical list styles for boards & lists
  listCol: { paddingBottom: 4 },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  listRowSelected: { backgroundColor: "#e5e7eb" },
  listText: { fontSize: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },

  // Actions
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 88,
  },
  ghost: { backgroundColor: "#eee" },
  primary: { backgroundColor: "#111" },
  btnText: { fontSize: 16, fontWeight: "600" },
  muted: { fontSize: 14, color: "#888", fontStyle: "italic" },
});
