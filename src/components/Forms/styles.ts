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
  colorBox: {
    // reuse input’s border/radius/background via [styles.input, styles.colorBox]
    paddingVertical: 8,   // make room for the swatches
    paddingHorizontal: 8, // swatches breathing room
    minHeight: undefined, // let height grow with content (overrides input's minHeight)
  },
  // The text above the color swatches
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  // The grid container for color swatches, the layout inside that box
  swatchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  // Each swatch’s wrapper (for border when selected)
  swatchWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginBottom: 12,
  },
  // Highlighted/selected swatch border
  swatchWrapSelected: {
    borderWidth: 2,
    borderColor: "#111",
  },
  // The color swatch itself
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    boxShadow: "0 0 2px rgba(0,0,0,0.3)",
  },
  noneSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
  },
  noneX: {
    fontSize: 16,
    lineHeight: 16,
    color: "#555",
    fontWeight: "600",
  },
});
