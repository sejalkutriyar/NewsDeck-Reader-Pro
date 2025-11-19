import { View, Text, Image, TouchableOpacity } from "react-native";

export default function ArticleCard({ title, description, imageUrl, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        marginBottom: 14,
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 180 }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{title}</Text>
        <Text style={{ marginTop: 5, color: "#555" }}>
          {description.substring(0, 80)}...
        </Text>
      </View>
    </TouchableOpacity>
  );
}
