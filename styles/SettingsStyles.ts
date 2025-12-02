import { StyleSheet } from "react-native";

export const SettingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
  },
  subHeading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  link: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  version: {
    marginTop: 30,
    fontSize: 14,
    textAlign: "center",
  },
});
