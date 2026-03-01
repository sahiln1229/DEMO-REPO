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

// ─── SequenceOrderGame ────────────────────────────────────────────────────────
// Numbered SLOTS shown at top.
// BANK of shuffled items shown below.
// Tap a bank item → it fills the next empty slot.
// Tap a filled slot → item returns to bank.
// When all slots are filled → auto-check.
//   ✅ Correct → pulse-scale each correct slot, then call onComplete(true).
//   ❌ Wrong   → shake wrong slots, show correct order, allow retry.

const SequenceOrderGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const n = round.steps.length;

    const bank = useMemo(() => shuffle([...round.steps]), []);

    const [slots, setSlots] = useState(Array(n).fill(null));
    const [bankItems, setBank] = useState(bank);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const firstEmptySlot = slots.findIndex((s) => s === null);
    const allFilled = slots.every(Boolean);

    // ── Animations ─────────────────────────────────────────────────────────
    const slotScales = useRef(Array.from({ length: n }, () => new Animated.Value(1))).current;
    const slotShakes = useRef(Array.from({ length: n }, () => new Animated.Value(0))).current;
    const bankScales = useRef({});

    const getBankItemScale = (itemId) => {
        if (!bankScales.current[itemId]) {
            bankScales.current[itemId] = new Animated.Value(1);
        }
        return bankScales.current[itemId];
    };

    const pulseSlot = (idx) => {
        Animated.sequence([
            Animated.spring(slotScales[idx], { toValue: 1.08, friction: 5, useNativeDriver: true }),
            Animated.spring(slotScales[idx], { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();
    };

    const shakeSlot = (idx) => {
        Animated.sequence([
            Animated.timing(slotShakes[idx], { toValue: 8, duration: 55, useNativeDriver: true }),
            Animated.timing(slotShakes[idx], { toValue: -8, duration: 55, useNativeDriver: true }),
            Animated.timing(slotShakes[idx], { toValue: 6, duration: 55, useNativeDriver: true }),
            Animated.timing(slotShakes[idx], { toValue: -6, duration: 55, useNativeDriver: true }),
            Animated.timing(slotShakes[idx], { toValue: 0, duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const pulseBankItem = (itemId) => {
        const scale = getBankItemScale(itemId);
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.9, friction: 6, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();
    };

    // ── Interactions ────────────────────────────────────────────────────────
    const tapBankItem = (item) => {
        if (submitted) return;
        if (firstEmptySlot === -1) return;
        pulseBankItem(item.id);
        const nextSlots = [...slots];
        nextSlots[firstEmptySlot] = item;
        setSlots(nextSlots);
        setBank((prev) => prev.filter((i) => i.id !== item.id));
        if (nextSlots.every(Boolean)) {
            setTimeout(() => checkAnswer(nextSlots), 200);
        }
    };

    const tapSlot = (slotIndex) => {
        if (submitted) return;
        if (!slots[slotIndex]) return;
        setBank((prev) => [...prev, slots[slotIndex]]);
        const nextSlots = [...slots];
        nextSlots[slotIndex] = null;
        setSlots(nextSlots);
    };

    const checkAnswer = (currentSlots) => {
        const correct = currentSlots.every(
            (item, idx) => item && item.correctPosition === idx
        );
        setIsCorrect(correct);
        setSubmitted(true);

        if (correct) {
            // Pulse each correct slot sequentially
            currentSlots.forEach((_, idx) => {
                setTimeout(() => pulseSlot(idx), idx * 80);
            });
            setTimeout(() => onComplete(true), 1000 + n * 80);
        } else {
            // Shake wrong slots
            currentSlots.forEach((item, idx) => {
                if (item && item.correctPosition !== idx) {
                    setTimeout(() => shakeSlot(idx), idx * 60);
                }
            });
            // Don't auto-advance on wrong — show retry button
        }
    };

    const reset = () => {
        setSlots(Array(n).fill(null));
        setBank(shuffle([...round.steps]));
        setSubmitted(false);
        setIsCorrect(null);
        slotScales.forEach((s) => s.setValue(1));
        slotShakes.forEach((s) => s.setValue(0));
    };

    // ── Visual helpers ──────────────────────────────────────────────────────
    const slotBg = (slotIndex) => {
        if (!submitted || !slots[slotIndex]) return '#F0F0F0';
        return slots[slotIndex].correctPosition === slotIndex ? '#E8F5E9' : '#FFEBEE';
    };

    const slotBorderColor = (slotIndex) => {
        if (!submitted || !slots[slotIndex]) return '#DDD';
        return slots[slotIndex].correctPosition === slotIndex ? '#4CAF50' : '#F44336';
    };

    return (
        <View>
            {/* Hint */}
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {submitted
                        ? isCorrect
                            ? '🎉 Perfect order!'
                            : '❌ Not quite – check the correct order below'
                        : allFilled
                            ? '✅ Checking your order…'
                            : `Tap items below to fill slots (${slots.filter(Boolean).length}/${n})`}
                </Text>
            </View>

            {/* SLOTS */}
            <View style={styles.slotsContainer}>
                {slots.map((item, idx) => (
                    <Animated.View
                        key={idx}
                        style={{
                            transform: [
                                { scale: slotScales[idx] },
                                { translateX: slotShakes[idx] },
                            ],
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={item ? 0.75 : 1}
                            onPress={() => tapSlot(idx)}
                            style={[
                                styles.slot,
                                {
                                    backgroundColor: slotBg(idx),
                                    borderColor: slotBorderColor(idx),
                                },
                            ]}
                        >
                            <View style={styles.slotNum}>
                                <Text style={styles.slotNumText}>{idx + 1}</Text>
                            </View>
                            {item ? (
                                <Text
                                    style={[styles.slotItemText, { color: theme.text }]}
                                    numberOfLines={2}
                                >
                                    {item.text}
                                </Text>
                            ) : (
                                <Text style={styles.emptySlotText}>— tap below to fill —</Text>
                            )}
                            {submitted && item && (
                                <Text style={styles.slotStatusIcon}>
                                    {item.correctPosition === idx ? '✅' : '❌'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>

            {/* Divider */}
            <View style={styles.bankDivider}>
                <View style={styles.bankDividerLine} />
                <Text style={styles.bankDividerText}>ITEMS BANK</Text>
                <View style={styles.bankDividerLine} />
            </View>

            {/* BANK */}
            <View style={styles.bankRow}>
                {bankItems.map((item) => (
                    <Animated.View
                        key={item.id}
                        style={{ transform: [{ scale: getBankItemScale(item.id) }] }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => tapBankItem(item)}
                            style={[styles.bankItem, { backgroundColor: theme.card }]}
                        >
                            <Text style={[styles.bankItemText, { color: theme.text }]} numberOfLines={2}>
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
                {bankItems.length === 0 && (
                    <Text style={[styles.emptyBank, { color: theme.textSecondary }]}>
                        All placed ✅ — tap a slot above to remove
                    </Text>
                )}
            </View>

            {/* Show correct order if wrong */}
            {submitted && !isCorrect && (
                <View style={styles.correctOrderBox}>
                    <Text style={styles.correctOrderTitle}>✅ Correct order:</Text>
                    {round.steps.map((s, i) => (
                        <Text key={s.id} style={styles.correctOrderItem}>
                            {i + 1}. {s.text}
                        </Text>
                    ))}
                    <TouchableOpacity style={styles.retryBtn} onPress={reset}>
                        <Text style={styles.retryBtnText}>🔄  Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#EDE7F6',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 14,
    },
    hintText: { fontSize: 13, color: '#512DA8', fontWeight: '600', textAlign: 'center' },
    slotsContainer: { gap: 8, marginBottom: 14 },
    slot: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 2,
        padding: 10,
        minHeight: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        gap: 10,
    },
    slotNum: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#667EEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotNumText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    slotItemText: { flex: 1, fontSize: 13, fontWeight: '600' },
    emptySlotText: { flex: 1, fontSize: 12, color: '#BDBDBD', fontStyle: 'italic' },
    slotStatusIcon: { fontSize: 16 },
    bankDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    bankDividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
    bankDividerText: { fontSize: 11, color: '#888', fontWeight: '700', letterSpacing: 1 },
    bankRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    bankItem: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderWidth: 1.5,
        borderColor: '#667EEA',
        maxWidth: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    bankItemText: { fontSize: 12, fontWeight: '600' },
    emptyBank: { fontSize: 13, fontStyle: 'italic', textAlign: 'center', width: '100%' },
    correctOrderBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
    },
    correctOrderTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
    correctOrderItem: { fontSize: 13, color: '#333', marginBottom: 4, lineHeight: 20 },
    retryBtn: {
        backgroundColor: '#667EEA',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    retryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});

export default SequenceOrderGame;
