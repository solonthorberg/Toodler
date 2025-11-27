import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // full screen, background is set dynamically from list color
  container: {
    flex: 1,
  },

  // solid color strip for the list name
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

  // scroll content spacing (creates the gap under the title)
  content: {
    paddingTop: 16,     // <-- space between title bar and first task
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // empty state (copied from shared but local so we can style independently)
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


