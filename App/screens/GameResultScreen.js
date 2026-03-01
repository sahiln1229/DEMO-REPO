import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { GAME_META } from '../data/gameData';

// ─── GameResultScreen ─────────────────────────────────────────────────────────
// route.params: { chapterId, gameNumber, score, total }
const GameResultScreen = ({ navigation, route }) => {
    const { chapterId, gameNumber, score, total } = route.params;
    const { theme } = useTheme();
    const { chapters } = useProgress();

    const gameMeta = GAME_META[gameNumber - 1];
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const chapter = chapters.find((c) => c.id === chapterId);
    const gamesCompleted = chapter?.gamesCompleted ?? [false, false, false];
    const allGamesDone = gamesCompleted.every(Boolean);

    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleNext = () => {
        if (gameNumber < 3) {
            navigation.replace('Game', {
                chapterId,
                gameNumber: gameNumber + 1,
            });
        } else {
            // All 3 games done → go to Chapter Complete message on CertificatePage or Home
            navigation.navigate('Certificate');
        }
    };

    const handleRetry = () => {
        navigation.replace('Game', { chapterId, gameNumber });
    };

    const star = (filled) => (
        <Text style={[styles.star, { color: filled ? '#FFD700' : '#DDD' }]}>★</Text>
    );

    const stars = percentage >= 90 ? 3 : percentage >= 60 ? 2 : 1;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={gameMeta.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Game {gameNumber} Result</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Trophy / icon */}
                <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={passed ? ['#FFD700', '#FFA500'] : ['#90A4AE', '#607D8B']}
                        style={styles.iconCircle}
                    >
                        <Text style={styles.iconEmoji}>{passed ? '🏆' : '😅'}</Text>
                    </LinearGradient>
                </Animated.View>

                {/* Stars */}
                <Animated.View style={[styles.starsRow, { opacity: fadeAnim }]}>
                    {star(stars >= 1)}
                    {star(stars >= 2)}
                    {star(stars >= 3)}
                </Animated.View>

                {/* Score circle */}
                <Animated.View style={[styles.scoreCircle, { opacity: fadeAnim, borderColor: gameMeta.gradient[0] }]}>
                    <Text style={[styles.scoreValue, { color: gameMeta.gradient[0] }]}>{score}/{total}</Text>
                    <Text style={[styles.scorePct, { color: theme.textSecondary }]}>{percentage}%</Text>
                </Animated.View>

                <Animated.Text style={[styles.resultTitle, { opacity: fadeAnim, color: theme.text }]}>
                    {passed ? 'Well Done! 🎉' : 'Keep Practising! 💪'}
                </Animated.Text>
                <Animated.Text style={[styles.resultSub, { opacity: fadeAnim, color: theme.textSecondary }]}>
                    {passed
                        ? `You scored ${percentage}% on ${gameMeta.title}`
                        : `You scored ${percentage}%. You need 60% to pass.`}
                </Animated.Text>

                {/* Chapter progress chips */}
                <Animated.View style={[styles.progressRow, { opacity: fadeAnim }]}>
                    {GAME_META.map((gm, idx) => {
                        const done = gamesCompleted[idx];
                        return (
                            <View
                                key={idx}
                                style={[
                                    styles.gameChip,
                                    { backgroundColor: done ? gm.gradient[0] : '#E0E0E0' },
                                ]}
                            >
                                <Text style={styles.gameChipText}>{gm.icon}</Text>
                                <Text style={[styles.gameChipLabel, { color: done ? '#fff' : '#999' }]}>
                                    Game {idx + 1}
                                </Text>
                                {done && <Ionicons name="checkmark-circle" size={14} color="#fff" />}
                            </View>
                        );
                    })}
                </Animated.View>

                {allGamesDone && (
                    <Animated.View style={[styles.certBanner, { opacity: fadeAnim }]}>
                        <MaterialCommunityIcons name="certificate" size={22} color="#FF9800" />
                        <Text style={styles.certBannerText}>
                            🎉 All games complete! You can now apply for your certificate.
                        </Text>
                    </Animated.View>
                )}

                {/* Buttons */}
                <Animated.View style={[styles.btnGroup, { opacity: fadeAnim }]}>
                    {passed && gameNumber < 3 && (
                        <TouchableOpacity activeOpacity={0.85} onPress={handleNext}>
                            <LinearGradient
                                colors={GAME_META[gameNumber].gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.primaryBtn}
                            >
                                <Text style={styles.primaryBtnText}>
                                    {gameMeta.icon} Next: Game {gameNumber + 1} →
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {passed && gameNumber === 3 && (
                        <TouchableOpacity activeOpacity={0.85} onPress={handleNext}>
                            <LinearGradient
                                colors={['#FF7EB3', '#FF758C']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.primaryBtn}
                            >
                                <Text style={styles.primaryBtnText}>🎓 View Certificate →</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {!passed && (
                        <TouchableOpacity activeOpacity={0.85} onPress={handleRetry}>
                            <LinearGradient
                                colors={gameMeta.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.primaryBtn}
                            >
                                <Text style={styles.primaryBtnText}>🔄 Retry Game</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Ionicons name="home-outline" size={18} color={gameMeta.gradient[0]} style={{ marginRight: 6 }} />
                        <Text style={[styles.secondaryBtnText, { color: gameMeta.gradient[0] }]}>Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: Platform.OS === 'ios' ? 58 : 48,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    content: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 24 },
    iconWrap: {
        marginBottom: 14,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconEmoji: { fontSize: 48 },
    starsRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
    star: { fontSize: 36 },
    scoreCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreValue: { fontSize: 24, fontWeight: 'bold' },
    scorePct: { fontSize: 14, fontWeight: '600', marginTop: 2 },
    resultTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
    resultSub: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20, paddingHorizontal: 20 },
    // game chips row
    progressRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    gameChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 4,
    },
    gameChipText: { fontSize: 14 },
    gameChipLabel: { fontSize: 12, fontWeight: '600' },
    // cert banner
    certBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        gap: 10,
        width: '100%',
    },
    certBannerText: { flex: 1, fontSize: 13, color: '#E65100', fontWeight: '600', lineHeight: 20 },
    // buttons
    btnGroup: { width: '100%', gap: 12 },
    primaryBtn: { borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 13,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
});

export default GameResultScreen;
