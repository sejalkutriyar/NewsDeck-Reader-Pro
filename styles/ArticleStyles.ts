import { StyleSheet } from "react-native";

export const ArticleStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        padding: 16,
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 12,
        backgroundColor: "#ccc",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        marginVertical: 12,
        color: "#1A1A1A",
    },
    description: {
        fontSize: 16,
        color: "#333",
        lineHeight: 24,
    },
    spacer: {
        height: 60,
    },
    floatingContainer: {
        position: "absolute",
        bottom: 25,
        right: 20,
        gap: 12,
    },
    floatingButton: {
        width: 55,
        height: 55,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    speakButton: {
        backgroundColor: "#007BFF",
    },
    saveButton: {
        backgroundColor: "crimson",
    },
    shareButton: {
        backgroundColor: "#222",
    },
    backButton: {
        backgroundColor: "#444",
    },
    buttonText: {
        fontSize: 22,
        color: "#fff",
    },
    backButtonText: {
        fontSize: 20,
        color: "#fff",
    },
});
