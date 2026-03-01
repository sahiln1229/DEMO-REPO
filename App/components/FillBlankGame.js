import React, { useState, useRef, useMemo } from 'react';
import {
    View, Text, Animated, PanResponder, StyleSheet,
    UIManager, findNodeHandle, TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── FillBlankGame ────────────────────────────────────────────────────────────
// A sentence with ONE blank "___". Draggable word-chips appear below.
// User drags the correct chip into the blank slot.
// Correct → green pulse. Wrong → chip springs back + shake.
const FillBlankGame = ({ round, onComplete }) => {
    const { theme } = useTheme();

    const choices = useMemo(() => shuffle([...round.choices]), [round]);

    const [filledWith, setFilledWith] = useState(null); // the placed text or null
    const [wrong, setWrong] = useState(false);
    const [done, setDone] = useState(false);

    // Anim values per chip
    const pans = useRef(choices.map(() => new Animated.ValueXY())).current;
    const chipScales = useRef(choices.map(() => new Animated.Value(1))).current;
    const chipShakes = useRef(choices.map(() => new Animated.Value(0))).current;
    const slotScale = useRef(new Animated.Value(1)).current;
    const slotShake = useRef(new Animated.Value(0)).current;

    // Slot ref for absolute measurement
    const slotRef = useRef(null);
    const slotLayout = useRef(null);

    const measureSlot = () => {
        const handle = findNodeHandle(slotRef.current);
        if (!handle) return;
        UIManager.measure(handle, (_x, _y, w, h, px, py) => {
            slotLayout.current = { pageX: px, pageY: py, width: w, height: h };
        });
    };

    const pulseSlot = () => {
        Animated.sequence([
            Animated.spring(slotScale, { toValue: 1.1, friction: 5, useNativeDriver: false }),
            Animated.spring(slotScale, { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shakeChip = (idx) => {
        Animated.sequence([
            Animated.timing(chipShakes[idx], { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(chipShakes[idx], { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(chipShakes[idx], { toValue: 7, duration: 55, useNativeDriver: false }),
            Animated.timing(chipShakes[idx], { toValue: -7, duration: 55, useNativeDriver: false }),
            Animated.timing(chipShakes[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const hitSlot = (moveX, moveY) => {
        const s = slotLayout.current;
        if (!s) return false;
        return moveX >= s.pageX && moveX <= s.pageX + s.width &&
            moveY >= s.pageY && moveY <= s.pageY + s.height;
    };

    // Also allow simple tap to fill (easier UX)
    const handleChipTap = (choice) => {
        if (done || filledWith) return;
        if (choice === round.correctChoice) {
            setFilledWith(choice);
            setDone(true);
            pulseSlot();
            setTimeout(() => onComplete(true), 900);
        } else {
            shakeSlot();
            setTimeout(() => setWrong(false), 700);
        }
    };

    const shakeSlot = () => {
        Animated.sequence([
            Animated.timing(slotShake, { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(slotShake, { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(slotShake, { toValue: 8, duration: 55, useNativeDriver: false }),
            Animated.timing(slotShake, { toValue: -8, duration: 55, useNativeDriver: false }),
            Animated.timing(slotShake, { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    // Pan responders per chip
    const panResponders = useRef(
        choices.map((choice, chipIdx) =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => !done && !filledWith,
                onMoveShouldSetPanResponder: () => !done && !filledWith,

                onPanResponderGrant: () => {
                    pans[chipIdx].setOffset({
                        x: pans[chipIdx].x._value,
                        y: pans[chipIdx].y._value,
                    });
                    pans[chipIdx].setValue({ x: 0, y: 0 });
                },

                onPanResponderMove: Animated.event(
                    [null, { dx: pans[chipIdx].x, dy: pans[chipIdx].y }],
                    { useNativeDriver: false }
                ),

                onPanResponderRelease: (_, gesture) => {
                    pans[chipIdx].flattenOffset();
                    if (hitSlot(gesture.moveX, gesture.moveY)) {
                        if (choice === round.correctChoice) {
                            setFilledWith(choice);
                            setDone(true);
                            pulseSlot();
                            setTimeout(() => onComplete(true), 900);
                        } else {
                            shakeChip(chipIdx);
                            Animated.spring(pans[chipIdx], {
                                toValue: { x: 0, y: 0 },
                                friction: 5,
                                useNativeDriver: false,
                            }).start();
                        }
                    } else {
                        Animated.spring(pans[chipIdx], {
                            toValue: { x: 0, y: 0 },
                            friction: 5,
                            useNativeDriver: false,
                        }).start();
                    }
                },
            })
        )
    ).current;

    // Split sentence at "___"
    const parts = round.sentence.split('___');

    return (
        <View>
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {done ? '✅ Correct!' : '👆 Tap or drag the correct word into the blank'}
                </Text>
            </View>

            {/* Sentence with blank */}
            <View style={[styles.sentenceCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.sentencePart, { color: theme.text }]}>{parts[0]}</Text>

                <Animated.View
                    ref={slotRef}
                    onLayout={() => setTimeout(measureSlot, 100)}
                    style={[
                        styles.blankSlot,
                        {
                            backgroundColor: done ? '#E8F5E9' : '#F3F0FF',
                            borderColor: done ? '#4CAF50' : '#667EEA',
                            transform: [{ scale: slotScale }, { translateX: slotShake }],
                        },
                    ]}
                >
                    <Text style={[styles.blankText, { color: done ? '#2E7D32' : '#667EEA' }]}>
                        {filledWith ?? '  ?  '}
                    </Text>
                </Animated.View>

                {parts[1] ? (
                    <Text style={[styles.sentencePart, { color: theme.text }]}>{parts[1]}</Text>
                ) : null}
            </View>

            {/* Word chips */}
            <View style={styles.chipsRow}>
                {choices.map((choice, i) => (
                    <Animated.View
                        key={choice}
                        style={{
                            transform: [
                                { translateX: Animated.add(pans[i].x, chipShakes[i]) },
                                { translateY: pans[i].y },
                                { scale: chipScales[i] },
                            ],
                        }}
                        {...panResponders[i].panHandlers}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleChipTap(choice)}
                            disabled={done}
                            style={[
                                styles.chip,
                                { backgroundColor: theme.card },
                            ]}
                        >
                            <Text style={[styles.chipText, { color: theme.text }]}>{choice}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>

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
        backgroundColor: '#F3E5F5',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    hintText: { fontSize: 13, color: '#6A1B9A', fontWeight: '700', textAlign: 'center' },
    sentenceCard: {
        borderRadius: 18,
        padding: 18,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sentencePart: { fontSize: 16, fontWeight: '600', lineHeight: 26 },
    blankSlot: {
        borderRadius: 10,
        borderWidth: 2.5,
        paddingHorizontal: 14,
        paddingVertical: 6,
        minWidth: 100,
        alignItems: 'center',
    },
    blankText: { fontSize: 15, fontWeight: '800' },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 8,
    },
    chip: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: '#667EEA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    chipText: { fontSize: 13, fontWeight: '700' },
    explanationBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#1B5E20', lineHeight: 20 },
});

export default FillBlankGame;
