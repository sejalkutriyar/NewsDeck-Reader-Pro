import { StyleSheet } from "react-native";

export const FeedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontWeight: "600",
  },
  offlineIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  loader: {
    marginTop: 50,
  },
  footerLoader: {
    marginVertical: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 80,
  },
});
