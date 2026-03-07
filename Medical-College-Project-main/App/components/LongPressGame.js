import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const HOLD_MS = 700; // ms to qualify as a long press

// ─── LongPressGame ────────────────────────────────────────────────────────────
// Shows 4 items. User must LONG-PRESS the correct one.
// Short tap: nothing. Long press wrong: shake. Long press correct: pulse + done.
// A fill bar grows while holding to visualise the hold.
const LongPressGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const [done, setDone] = useState(false);
    const [revealed, setRevealed] = useState(null); // id of item long-pressed

    const fillAnims = useRef(round.items.map(() => new Animated.Value(0))).current;
    const itemScales = useRef(round.items.map(() => new Animated.Value(1))).current;
    const itemShakes = useRef(round.items.map(() => new Animated.Value(0))).current;
    const holdTimers = useRef(round.items.map(() => null)).current;

    const startHold = (item, idx) => {
        if (done) return;
        // Animate fill bar
        Animated.timing(fillAnims[idx], {
            toValue: 1, duration: HOLD_MS,
            useNativeDriver: false,
        }).start();

        holdTimers[idx] = setTimeout(() => {
            handleLongPress(item, idx);
        }, HOLD_MS);
    };

    const cancelHold = (idx) => {
        if (holdTimers[idx]) {
            clearTimeout(holdTimers[idx]);
            holdTimers[idx] = null;
        }
        Animated.timing(fillAnims[idx], {
            toValue: 0, duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleLongPress = (item, idx) => {
        setRevealed(item.id);
        if (item.correct) {
            Animated.sequence([
                Animated.spring(itemScales[idx], { toValue: 1.12, friction: 5, useNativeDriver: false }),
                Animated.spring(itemScales[idx], { toValue: 1, friction: 6, useNativeDriver: false }),
            ]).start();
            setDone(true);
            setTimeout(() => onComplete(true), 900);
        } else {
            Animated.sequence([
                Animated.timing(itemShakes[idx], { toValue: 10, duration: 55, useNativeDriver: false }),
                Animated.timing(itemShakes[idx], { toValue: -10, duration: 55, useNativeDriver: false }),
                Animated.timing(itemShakes[idx], { toValue: 8, duration: 55, useNativeDriver: false }),
                Animated.timing(itemShakes[idx], { toValue: -8, duration: 55, useNativeDriver: false }),
                Animated.timing(itemShakes[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
            ]).start();
            // Reset fill and anim
            Animated.timing(fillAnims[idx], { toValue: 0, duration: 150, useNativeDriver: false }).start();
            setTimeout(() => setRevealed(null), 700);
        }
    };

    const itemBg = (item) => {
        if (revealed === item.id && item.correct) return '#E8F5E9';
        if (revealed === item.id && !item.correct) return '#FFEBEE';
        return theme.card;
    };
    const itemBorder = (item) => {
        if (revealed === item.id && item.correct) return '#4CAF50';
        if (revealed === item.id && !item.correct) return '#F44336';
        return '#E0E0E0';
    };

    return (
        <View>
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {done ? '✅ Correct answer found!' : '⏱️ HOLD DOWN the correct item for 1 second'}
                </Text>
            </View>

            {round.items.map((item, idx) => (
                <Animated.View
                    key={item.id}
                    style={{
                        transform: [
                            { scale: itemScales[idx] },
                            { translateX: itemShakes[idx] },
                        ],
                        marginBottom: 12,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPressIn={() => startHold(item, idx)}
                        onPressOut={() => cancelHold(idx)}
                        disabled={done}
                        style={[
                            styles.itemCard,
                            {
                                backgroundColor: itemBg(item),
                                borderColor: itemBorder(item),
                            },
                        ]}
                    >
                        <Text style={styles.itemEmoji}>{item.emoji}</Text>
                        <View style={styles.itemContent}>
                            <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
                            {/* Hold progress bar */}
                            <View style={styles.fillBarBg}>
                                <Animated.View
                                    style={[
                                        styles.fillBarFill,
                                        {
                                            width: fillAnims[idx].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        {revealed === item.id && (
                            <Text style={styles.resultIcon}>{item.correct ? '✅' : '❌'}</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {done && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>💡 Why?</Text>
                    <Text style={styles.explanationText}>{round.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#FCE4EC',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    hintText: { fontSize: 13, color: '#880E4F', fontWeight: '700', textAlign: 'center' },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        padding: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,
        elevation: 2,
    },
    itemEmoji: { fontSize: 28 },
    itemContent: { flex: 1 },
    itemLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
    fillBarBg: {
        height: 5,
        backgroundColor: '#F3E5F5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    fillBarFill: {
        height: '100%',
        backgroundColor: '#AB47BC',
        borderRadius: 3,
    },
    resultIcon: { fontSize: 22 },
    explanationBox: {
        backgroundColor: '#F3E5F5',
        borderRadius: 14,
        padding: 14,
        marginTop: 8,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#6A1B9A', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#4A148C', lineHeight: 20 },
});

export default LongPressGame;
