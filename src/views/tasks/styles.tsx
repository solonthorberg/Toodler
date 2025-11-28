import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  headerBar: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000000ff",
  },

  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
