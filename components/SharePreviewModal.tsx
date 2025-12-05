import React, { useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image, Platform, Share, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme/ThemeContext';
import { ArticleStyles } from '@/styles/ArticleStyles';

interface SharePreviewModalProps {
    visible: boolean;
    onClose: () => void;
    article: any;
}

export const SharePreviewModal: React.FC<SharePreviewModalProps> = ({ visible, onClose, article }) => {
    const { theme, mode } = useTheme();
    const viewShotRef = useRef<ViewShot>(null);
    const [processing, setProcessing] = useState(false);

    if (!article) return null;

    const title = article.title || article.headline || article.name || "";
    const description = article.description || article.summary || article.content || article.desc || "";
    const imageUrl = article.image_url || article.imageUrl || article.image || article.thumbnail;

    const captureAndShare = async () => {
        if (processing) return;

        if (Platform.OS === 'web') {
            alert("Image sharing is best experienced on mobile! 📱\n\nOn web, you can take a screenshot of this card manually.");
            return;
        }

        setProcessing(true);

        try {
            if (viewShotRef.current && viewShotRef.current.capture) {
                const uri = await viewShotRef.current.capture();

                if (!(await Sharing.isAvailableAsync())) {
                    Alert.alert("Error", "Sharing is not available on this device");
                    setProcessing(false);
                    return;
                }

                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            console.error("Capture failed", error);
            Alert.alert("Error", "Failed to generate image");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <Text style={[styles.header, { color: theme.text }]}>Share Preview</Text>

                    {/* Capture Area */}
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={{ backgroundColor: theme.background }}>
                        <View style={[styles.card, { backgroundColor: mode === 'dark' ? '#333' : '#fff' }]}>
                            {imageUrl && (
                                <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
                            )}
                            <View style={styles.cardContent}>
                                <Text style={[styles.cardTitle, { color: mode === 'dark' ? '#fff' : '#000' }]} numberOfLines={3}>
                                    {title}
                                </Text>
                                <Text style={[styles.cardDesc, { color: mode === 'dark' ? '#ccc' : '#555' }]} numberOfLines={3}>
                                    {description}
                                </Text>
                                <View style={styles.footer}>
                                    <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>NewsReader App</Text>
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Pressable onPress={onClose} style={[styles.button, { backgroundColor: '#ccc' }]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={captureAndShare} style={[styles.button, { backgroundColor: '#2196F3' }]}>
                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                {processing ? "Generating..." : "Share Image 📸"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: 300,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
    },
    footer: {
        marginTop: 10,
        alignItems: 'flex-end'
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
