import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { GAME_META } from '../data/gameData';

// ─── ChapterGamesScreen ───────────────────────────────────────────────────────
// route.params: { chapterId: number, chapterTitle: string, gradient: string[] }
const ChapterGamesScreen = ({ navigation, route }) => {
    const { chapterId, chapterTitle, gradient } = route.params;
    const { theme } = useTheme();
    const { chapters } = useProgress();

    const chapter = chapters.find((c) => c.id === chapterId);
    const gamesCompleted = chapter?.gamesCompleted ?? [false, false, false];
    const completedCount = gamesCompleted.filter(Boolean).length;

    const handleStartGame = (gameNumber) => {
        navigation.navigate('Game', { chapterId, gameNumber });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── HEADER ── */}
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{chapterTitle}</Text>
                    <Text style={styles.headerSub}>Complete all 3 games to finish this chapter</Text>
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── CHAPTER PROGRESS CARD ── */}
                <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
                    <View style={styles.progressRow}>
                        <MaterialCommunityIcons name="gamepad-variant" size={22} color={gradient[0]} />
                        <Text style={[styles.progressLabel, { color: theme.text }]}>
                            {completedCount} / 3 Games Completed
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${(completedCount / 3) * 100}%`, backgroundColor: gradient[0] },
                            ]}
                        />
                    </View>
                    {completedCount === 3 && (
                        <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.completedBadgeText}>Chapter Complete!</Text>
                        </View>
                    )}
                </View>

                {/* ── GAME CARDS ── */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a Game</Text>

                {GAME_META.map((gm, idx) => {
                    const gameNumber = gm.gameNumber;
                    const done = gamesCompleted[idx];
                    const locked = idx > 0 && !gamesCompleted[idx - 1]; // each game unlocked after previous

                    return (
                        <TouchableOpacity
                            key={gameNumber}
                            activeOpacity={locked ? 1 : 0.85}
                            style={[styles.gameCard, { backgroundColor: theme.card, opacity: locked ? 0.55 : 1 }]}
                            onPress={() => !locked && handleStartGame(gameNumber)}
                        >
                            <LinearGradient
                                colors={done ? ['#4CAF50', '#087f23'] : locked ? ['#BDBDBD', '#9E9E9E'] : gm.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gameCardIcon}
                            >
                                <Text style={styles.gameCardEmoji}>{done ? '✅' : locked ? '🔒' : gm.icon}</Text>
                            </LinearGradient>

                            <View style={styles.gameCardInfo}>
                                <Text style={[styles.gameCardTitle, { color: theme.text }]}>
                                    Game {gameNumber}: {gm.title}
                                </Text>
                                <Text style={[styles.gameCardSub, { color: theme.textSecondary }]}>
                                    {gm.subtitle}
                                </Text>
                                <Text style={[styles.gameCardMeta, { color: theme.textSecondary }]}>
                                    10 Questions • MCQ, Drag & Order
                                </Text>
                            </View>

                            {!locked && (
                                <Ionicons
                                    name={done ? 'checkmark-circle' : 'arrow-forward-circle'}
                                    size={28}
                                    color={done ? '#4CAF50' : gm.gradient[0]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* ── TIP ── */}
                <View style={[styles.tipCard, { backgroundColor: '#FFF8E1' }]}>
                    <Ionicons name="bulb-outline" size={18} color="#F57F17" />
                    <Text style={styles.tipText}>
                        Complete games in order. You need ≥60% to pass each game and unlock the next!
                    </Text>
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: Platform.OS === 'ios' ? 58 : 48,
        paddingBottom: 24,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 12, marginTop: 2,
    },
    headerCenter: { flex: 1 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
    // progress card
    progressCard: {
        borderRadius: 16, padding: 16, marginBottom: 22,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    progressLabel: { fontSize: 15, fontWeight: '700' },
    progressBarBg: { height: 8, backgroundColor: '#EFEFEF', borderRadius: 6, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 6 },
    completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    completedBadgeText: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },
    // section title
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },
    // game card
    gameCard: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: 18, padding: 16, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, gap: 14,
    },
    gameCardIcon: {
        width: 56, height: 56, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    gameCardEmoji: { fontSize: 26 },
    gameCardInfo: { flex: 1 },
    gameCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
    gameCardSub: { fontSize: 12, marginBottom: 2 },
    gameCardMeta: { fontSize: 11, fontWeight: '500' },
    // tip
    tipCard: {
        flexDirection: 'row', alignItems: 'flex-start',
        borderRadius: 14, padding: 14, gap: 10, marginTop: 4,
    },
    tipText: { flex: 1, fontSize: 13, color: '#E65100', lineHeight: 20, fontWeight: '500' },
});

export default ChapterGamesScreen;
