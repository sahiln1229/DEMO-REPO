import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { getGameRounds, GAME_META } from '../data/gameData';

import MatchPairGame from '../components/MatchPairGame';
import DragDropGame from '../components/DragDropGame';
import SequenceOrderGame from '../components/SequenceOrderGame';
import SpotMistakeGame from '../components/SpotMistakeGame';
import TrueFalseGame from '../components/TrueFalseGame';
import MultiSelectGame from '../components/MultiSelectGame';
import FillBlankGame from '../components/FillBlankGame';
import LongPressGame from '../components/LongPressGame';
import TapSequenceGame from '../components/TapSequenceGame';
import ScenarioSelectGame from '../components/ScenarioSelectGame';

// ─── GameScreen (unified) ─────────────────────────────────────────────────────
// route.params: { chapterId: number, gameNumber: 1|2|3 }
const GameScreen = ({ navigation, route }) => {
    const { chapterId, gameNumber } = route.params;
    const { theme } = useTheme();
    const { markGameComplete } = useProgress();

    const rounds = getGameRounds(gameNumber);
    const gameMeta = GAME_META[gameNumber - 1];

    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const scoreRef = useRef(0); // mirror to avoid stale closure in goNext
    const [roundDone, setRoundDone] = useState(false);
    const [lastCorrect, setLastCorrect] = useState(null);
    const [roundKey, setRoundKey] = useState(0); // re-mount on next round

    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentRound + 1) / rounds.length,
            duration: 450,
            useNativeDriver: false,
        }).start();
    }, [currentRound]);

    const handleRoundComplete = (isCorrect) => {
        if (isCorrect) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
        }
        setLastCorrect(isCorrect);
        setRoundDone(true);
    };

    const goNext = () => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            const next = currentRound + 1;
            if (next < rounds.length) {
                setCurrentRound(next);
                setRoundDone(false);
                setLastCorrect(null);
                setRoundKey((k) => k + 1);
                // Restore fade after state update is committed
                setTimeout(() => {
                    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                }, 50);
            } else {
                markGameComplete(chapterId, gameNumber);
                navigation.replace('GameResult', {
                    chapterId,
                    gameNumber,
                    score: scoreRef.current, // use ref to avoid stale closure
                    total: rounds.length,
                });
            }
        });
    };

    const round = rounds[currentRound];

    const renderRound = () => {
        const key = roundKey;
        const props = { key, round, onComplete: handleRoundComplete };
        switch (round.type) {
            case 'match_pair': return <MatchPairGame     {...props} />;
            case 'drag_drop': return <DragDropGame      {...props} />;
            case 'sequence_order': return <SequenceOrderGame {...props} />;
            case 'spot_mistake': return <SpotMistakeGame   {...props} />;
            case 'true_false': return <TrueFalseGame     {...props} />;
            case 'multi_select': return <MultiSelectGame   {...props} />;
            case 'fill_blank': return <FillBlankGame     {...props} />;
            case 'long_press': return <LongPressGame     {...props} />;
            case 'tap_sequence': return <TapSequenceGame   {...props} />;
            case 'scenario_select': return <ScenarioSelectGame {...props} />;
            default: return <SpotMistakeGame   {...props} />;
        }
    };

    const TYPE_META = {
        match_pair: { icon: '🔗', label: 'Match Pair' },
        drag_drop: { icon: '🎯', label: 'Drag & Drop' },
        sequence_order: { icon: '🔢', label: 'Sequence Order' },
        spot_mistake: { icon: '🚨', label: 'Spot the Mistake' },
        true_false: { icon: '✅', label: 'True or False' },
        multi_select: { icon: '☑️', label: 'Multi-Select' },
        fill_blank: { icon: '✍️', label: 'Fill the Blank' },
        long_press: { icon: '⏱️', label: 'Long Press' },
        tap_sequence: { icon: '👆', label: 'Tap Sequence' },
        scenario_select: { icon: '🏥', label: 'Scenario' },
    };
    const typeMeta = TYPE_META[round.type] ?? { icon: '🎮', label: 'Puzzle' };
    const typeIcon = typeMeta.icon;
    const typeLabel = typeMeta.label;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── HEADER ── */}
            <LinearGradient
                colors={gameMeta.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.gameTitle}>{gameMeta.icon} {gameMeta.title}</Text>
                    <Text style={styles.gameSub}>{typeIcon} {typeLabel}</Text>
                </View>
                <View style={styles.scoreChip}>
                    <Text style={styles.scoreText}>{score}/{rounds.length}</Text>
                </View>
            </LinearGradient>

            {/* ── PROGRESS BAR ── */}
            <View style={styles.progressBg}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                            backgroundColor: gameMeta.gradient[0],
                        },
                    ]}
                />
            </View>

            {/* ── ROUND INDICATOR ── */}
            <View style={styles.roundRow}>
                {rounds.map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.roundDot,
                            {
                                backgroundColor:
                                    idx < currentRound
                                        ? '#4CAF50'
                                        : idx === currentRound
                                            ? gameMeta.gradient[0]
                                            : '#E0E0E0',
                                width: idx === currentRound ? 22 : 10,
                            },
                        ]}
                    />
                ))}
                <Text style={[styles.roundText, { color: theme.textSecondary }]}>
                    Round {currentRound + 1} / {rounds.length}
                </Text>
            </View>

            {/* ── ROUND TITLE ── */}
            <View style={styles.titleRow}>
                <Text style={[styles.roundTitle, { color: theme.text }]}>{round.title}</Text>
                {round.instruction ? (
                    <Text style={[styles.roundInstruction, { color: theme.textSecondary }]}>
                        {round.instruction}
                    </Text>
                ) : null}
            </View>

            {/* ── GAME CONTENT ── */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.roundCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
                    {renderRound()}
                </Animated.View>

                {/* ── FEEDBACK BANNER ── */}
                {roundDone && (
                    <View
                        style={[
                            styles.feedbackBanner,
                            { backgroundColor: lastCorrect ? '#4CAF50' : '#FF5252' },
                        ]}
                    >
                        <Text style={styles.feedbackText}>
                            {lastCorrect ? '🎉 Round Complete!' : '😅 Mistakes made – keep going!'}
                        </Text>
                    </View>
                )}

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* ── NEXT BUTTON ── */}
            {roundDone && (
                <View style={styles.nextBtnWrap}>
                    <TouchableOpacity activeOpacity={0.85} onPress={goNext}>
                        <LinearGradient
                            colors={gameMeta.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.nextBtn}
                        >
                            <Text style={styles.nextBtnText}>
                                {currentRound + 1 < rounds.length ? 'Next Round →' : '🏁 Finish Game'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: Platform.OS === 'ios' ? 54 : 44,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10,
    },
    headerCenter: { flex: 1 },
    gameTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    gameSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },
    scoreChip: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    },
    scoreText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    // progress bar
    progressBg: { height: 5, backgroundColor: '#E0E0E0' },
    progressFill: { height: '100%', borderRadius: 3 },
    // round indicator
    roundRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 6,
    },
    roundDot: { height: 10, borderRadius: 5 },
    roundText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
    // round title
    titleRow: { paddingHorizontal: 16, paddingBottom: 8 },
    roundTitle: { fontSize: 18, fontWeight: 'bold', letterSpacing: 0.2 },
    roundInstruction: { fontSize: 13, marginTop: 3, lineHeight: 18 },
    // content
    content: { paddingHorizontal: 14, paddingBottom: 12 },
    roundCard: {
        borderRadius: 22, padding: 18, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    feedbackBanner: {
        borderRadius: 16, paddingVertical: 14,
        alignItems: 'center', marginHorizontal: 2,
    },
    feedbackText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
    // next button
    nextBtnWrap: {
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    },
    nextBtn: {
        borderRadius: 16, paddingVertical: 15, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
    },
    nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default GameScreen;
