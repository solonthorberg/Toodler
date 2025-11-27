import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },

  body: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardButtonContainer: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    gap: 8,
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
  },
});
