import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 40,
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
    paddingBottom: 400,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  ghost: {
    backgroundColor: "#eee",
  },
  primary: {
    backgroundColor: "#111",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
