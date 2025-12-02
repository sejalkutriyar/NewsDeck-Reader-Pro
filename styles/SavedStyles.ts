import { StyleSheet } from "react-native";

export const SavedStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#2C3E50",
    },
    itemContainer: {
        marginBottom: 12,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
        color: "gray",
    },
    deleteBtn: {
        marginTop: 6,
        backgroundColor: "#e63946",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
    },
});
