import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useTTS } from '@/utils/TTSContext';
import { useTheme } from '@/theme/ThemeContext';

export const MiniPlayer = () => {
    const { currentArticle, isPlaying, pause, resume, playNext, stop, queue } = useTTS();
    const { theme, mode } = useTheme();

    if (!currentArticle) return null;

    const title = currentArticle.title || currentArticle.headline || "Playing Article";

    return (
        <View style={[styles.container, { backgroundColor: mode === 'dark' ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)', borderColor: theme.border }]}>
            <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
                    {title}
                </Text>
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                    {queue.length > 0 ? `Next: ${queue[0].title?.slice(0, 20)}...` : 'End of queue'}
                </Text>
            </View>

            <View style={styles.controls}>
                <Pressable onPress={isPlaying ? pause : resume} style={styles.button}>
                    <Text style={{ fontSize: 24 }}>{isPlaying ? '⏸️' : '▶️'}</Text>
                </Pressable>

                <Pressable onPress={playNext} style={styles.button}>
                    <Text style={{ fontSize: 24 }}>⏭️</Text>
                </Pressable>

                <Pressable onPress={stop} style={styles.button}>
                    <Text style={{ fontSize: 20 }}>❌</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 85, // Above the tab bar (approx 50-60px) + some margin
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    button: {
        padding: 5,
    },
});
