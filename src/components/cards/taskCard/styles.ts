import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  circleDone: {
    backgroundColor: "#e6ffe6",
  },

  check: {
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "600",
  },

  trashButton: {
    paddingLeft: 10,
  },

  trashText: {
    fontSize: 18,
  },

  separator: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 8,
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    color: "#777",
    marginTop: 4,
  },

  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 12,
    flexDirection: "row",
    gap: 12,
    zIndex: 1,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
