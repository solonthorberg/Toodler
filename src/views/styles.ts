import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    margin: 10,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
