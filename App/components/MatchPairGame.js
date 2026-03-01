import React, { useState, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Fisher-Yates shuffle
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── MatchPairGame ─────────────────────────────────────────────────────────────
// Left column = terms (fixed order), Right column = shuffled definitions.
// Tap LEFT → highlights blue (selected).
// Tap RIGHT → checks match.
//   ✅ Correct  → pulse-scale both cards green, disable them.
//   ❌ Wrong    → shake both cards red, auto-reset after 700ms.
// All pairs matched → onComplete(wrongCount === 0).

const MatchPairGame = ({ round, onComplete }) => {
    const { theme } = useTheme();

    const leftItems = round.pairs.map((p) => ({ id: p.id, text: p.left }));
    const rightItems = useMemo(
        () => shuffle(round.pairs.map((p) => ({ id: p.id, text: p.right }))),
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const [selectedLeft, setSelectedLeft] = useState(null);
    const [matched, setMatched] = useState(new Set()); // pair ids
    const [wrongPair, setWrongPair] = useState(null); // { leftId, rightId }
    const [wrongCount, setWrongCount] = useState(0);

    // ── Animations (per pair id) ──────────────────────────────────────────────
    const pairScales = useRef({});
    const pairShakes = useRef({});

    const getPairScale = (id) => {
        if (!pairScales.current[id]) {
            pairScales.current[id] = new Animated.Value(1);
        }
        return pairScales.current[id];
    };

    const getPairShake = (id) => {
        if (!pairShakes.current[id]) {
            pairShakes.current[id] = new Animated.Value(0);
        }
        return pairShakes.current[id];
    };

    const pulseCard = (id) => {
        const scale = getPairScale(id);
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.1, friction: 5, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();
    };

    const shakeCard = (id) => {
        const shake = getPairShake(id);
        Animated.sequence([
            Animated.timing(shake, { toValue: 9, duration: 55, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -9, duration: 55, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 7, duration: 55, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -7, duration: 55, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const isMatched = (id) => matched.has(id);

    // ── Tap handlers ─────────────────────────────────────────────────────────
    const handleLeftTap = (id) => {
        if (isMatched(id)) return;
        setSelectedLeft((prev) => (prev === id ? null : id));
    };

    const handleRightTap = (id) => {
        if (!selectedLeft) return;
        if (isMatched(id)) return;

        if (selectedLeft === id) {
            // ✅ Correct match
            pulseCard(id);
            const next = new Set([...matched, id]);
            setMatched(next);
            setSelectedLeft(null);

            if (next.size === round.pairs.length) {
                setTimeout(() => onComplete(wrongCount === 0), 500);
            }
        } else {
            // ❌ Wrong match
            const leftId = selectedLeft;
            setWrongPair({ leftId, rightId: id });
            setWrongCount((c) => c + 1);
            shakeCard(leftId);
            shakeCard(id);

            setTimeout(() => {
                setWrongPair(null);
                setSelectedLeft(null);
            }, 750);
        }
    };

    // ── Visual helpers ────────────────────────────────────────────────────────
    const leftBg = (id) => {
        if (isMatched(id)) return '#E8F5E9';
        if (wrongPair?.leftId === id) return '#FFEBEE';
        if (selectedLeft === id) return '#E8EAF6';
        return theme.card;
    };
    const leftBorder = (id) => {
        if (isMatched(id)) return '#4CAF50';
        if (wrongPair?.leftId === id) return '#F44336';
        if (selectedLeft === id) return '#667EEA';
        return '#DDDDDD';
    };
    const rightBg = (id) => {
        if (isMatched(id)) return '#E8F5E9';
        if (wrongPair?.rightId === id) return '#FFEBEE';
        return theme.card;
    };
    const rightBorder = (id) => {
        if (isMatched(id)) return '#4CAF50';
        if (wrongPair?.rightId === id) return '#F44336';
        return '#DDDDDD';
    };

    return (
        <View>
            {/* Hint banner */}
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {selectedLeft
                        ? '👉 Now tap the matching item on the RIGHT'
                        : '👈 Tap an item on the LEFT to begin'}
                </Text>
            </View>

            {/* Progress dots */}
            <View style={styles.dotsRow}>
                {round.pairs.map((p) => (
                    <View
                        key={p.id}
                        style={[
                            styles.dot,
                            { backgroundColor: matched.has(p.id) ? '#4CAF50' : '#E0E0E0' },
                        ]}
                    />
                ))}
            </View>

            {/* Two columns */}
            <View style={styles.columns}>
                {/* LEFT */}
                <View style={styles.col}>
                    {leftItems.map((item) => (
                        <Animated.View
                            key={item.id}
                            style={{
                                transform: [
                                    { scale: getPairScale(item.id) },
                                    { translateX: getPairShake(item.id) },
                                ],
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => handleLeftTap(item.id)}
                                disabled={isMatched(item.id)}
                                style={[
                                    styles.pairCard,
                                    {
                                        backgroundColor: leftBg(item.id),
                                        borderColor: leftBorder(item.id),
                                        borderWidth: selectedLeft === item.id ? 2.5 : 2,
                                    },
                                ]}
                            >
                                {isMatched(item.id) && <Text style={styles.checkMark}>✅ </Text>}
                                <Text
                                    style={[styles.pairCardText, { color: theme.text }]}
                                    numberOfLines={3}
                                >
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Centre divider */}
                <View style={styles.divider}>
                    {round.pairs.map((_, i) => (
                        <View key={i} style={styles.dividerDot} />
                    ))}
                </View>

                {/* RIGHT */}
                <View style={styles.col}>
                    {rightItems.map((item) => (
                        <Animated.View
                            key={item.id}
                            style={{
                                transform: [
                                    { scale: getPairScale(item.id) },
                                    { translateX: getPairShake(item.id) },
                                ],
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => handleRightTap(item.id)}
                                disabled={isMatched(item.id)}
                                style={[
                                    styles.pairCard,
                                    {
                                        backgroundColor: rightBg(item.id),
                                        borderColor: rightBorder(item.id),
                                    },
                                ]}
                            >
                                {isMatched(item.id) && <Text style={styles.checkMark}>✅ </Text>}
                                <Text
                                    style={[styles.pairCardText, { color: theme.text }]}
                                    numberOfLines={3}
                                >
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </View>

            {/* Score line */}
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                {matched.size} / {round.pairs.length} matched
                {wrongCount > 0 ? `  ·  ${wrongCount} mistake${wrongCount > 1 ? 's' : ''}` : ''}
            </Text>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#EDE7F6',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 14,
        alignItems: 'center',
    },
    hintText: { fontSize: 13, color: '#512DA8', fontWeight: '600', textAlign: 'center' },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    columns: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
    col: { flex: 1, gap: 10 },
    divider: {
        width: 14,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 4,
        gap: 34,
    },
    dividerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#BDBDBD',
    },
    pairCard: {
        borderRadius: 14,
        borderWidth: 2,
        padding: 10,
        minHeight: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
    },
    checkMark: { fontSize: 14, marginRight: 2 },
    pairCardText: { fontSize: 12, fontWeight: '600', textAlign: 'center', flex: 1 },
    progressText: { textAlign: 'center', marginTop: 14, fontSize: 13, fontWeight: '600' },
});

export default MatchPairGame;
