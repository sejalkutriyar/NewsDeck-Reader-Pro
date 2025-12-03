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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    clearAllBtn: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
});
