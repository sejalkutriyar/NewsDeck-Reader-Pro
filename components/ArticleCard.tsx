import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ArticleCardProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  onPress?: () => void;
}

export default function ArticleCard({ title, description = '', imageUrl, onPress }: ArticleCardProps) {
  const safeDescription = String(description || '');
  const preview = safeDescription.length > 80 ? `${safeDescription.substring(0, 80)}...` : safeDescription;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        marginBottom: 14,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 180 }} />
      ) : null}

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
        <Text style={{ marginTop: 5, color: '#555' }}>{preview}</Text>
      </View>
    </TouchableOpacity>
  );
}
