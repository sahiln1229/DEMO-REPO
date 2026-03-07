import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── MultiSelectGame ──────────────────────────────────────────────────────────
// Shows multiple items. User taps to toggle selections.
// Press SUBMIT → correct if ALL correct items checked and NONE wrong ones.
const MultiSelectGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState(new Set());
    const [submitted, setSubmitted] = useState(false);
    const [resultCorrect, setResultCorrect] = useState(null);

    const itemScales = useRef(round.items.map(() => new Animated.Value(1))).current;
    const submitScale = useRef(new Animated.Value(1)).current;
    const submitShake = useRef(new Animated.Value(0)).current;

    const pulseSingle = (idx) => {
        Animated.sequence([
            Animated.spring(itemScales[idx], { toValue: 1.08, friction: 5, useNativeDriver: false }),
            Animated.spring(itemScales[idx], { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shakeSubmit = () => {
        Animated.sequence([
            Animated.timing(submitShake, { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(submitShake, { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(submitShake, { toValue: 8, duration: 55, useNativeDriver: false }),
            Animated.timing(submitShake, { toValue: -8, duration: 55, useNativeDriver: false }),
            Animated.timing(submitShake, { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const toggleItem = (id, idx) => {
        if (submitted) return;
        pulseSingle(idx);
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSubmit = () => {
        if (submitted || selected.size === 0) return;
        const correct = round.items.every((item) =>
            item.correct ? selected.has(item.id) : !selected.has(item.id)
        );
        setSubmitted(true);
        setResultCorrect(correct);
        if (correct) {
            Animated.spring(submitScale, { toValue: 1.08, friction: 5, useNativeDriver: false }).start();
            setTimeout(() => onComplete(true), 1000);
        } else {
            shakeSubmit();
        }
    };

    const itemBg = (item) => {
        if (!submitted) return selected.has(item.id) ? '#E8EAF6' : theme.card;
        if (item.correct && selected.has(item.id)) return '#E8F5E9';
        if (!item.correct && selected.has(item.id)) return '#FFEBEE';
        if (item.correct && !selected.has(item.id)) return '#FFF9C4'; // missed
        return theme.card;
    };

    const itemBorder = (item) => {
        if (!submitted) return selected.has(item.id) ? '#667EEA' : '#E0E0E0';
        if (item.correct && selected.has(item.id)) return '#4CAF50';
        if (!item.correct && selected.has(item.id)) return '#F44336';
        if (item.correct && !selected.has(item.id)) return '#FFC107';
        return '#E0E0E0';
    };

    const statusIcon = (item) => {
        if (!submitted) return selected.has(item.id) ? '☑️' : '⬜';
        if (item.correct && selected.has(item.id)) return '✅';
        if (!item.correct && selected.has(item.id)) return '❌';
        if (item.correct && !selected.has(item.id)) return '⚠️';
        return '⬜';
    };

    return (
        <View>
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {submitted
                        ? resultCorrect ? '🎉 All correct!' : '❌ Not quite – check highlighted items'
                        : `☑️ Tap ALL correct items then press Submit (${selected.size} selected)`}
                </Text>
            </View>

            {round.items.map((item, idx) => (
                <Animated.View
                    key={item.id}
                    style={{ transform: [{ scale: itemScales[idx] }], marginBottom: 10 }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleItem(item.id, idx)}
                        disabled={submitted}
                        style={[
                            styles.itemCard,
                            { backgroundColor: itemBg(item), borderColor: itemBorder(item) },
                        ]}
                    >
                        <Text style={styles.statusIcon}>{statusIcon(item)}</Text>
                        <Text style={[styles.itemText, { color: theme.text }]}>{item.text}</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {!submitted && (
                <Animated.View
                    style={{
                        transform: [
                            { scale: submitScale },
                            { translateX: submitShake },
                        ],
                        marginTop: 6,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={[
                            styles.submitBtn,
                            { opacity: selected.size === 0 ? 0.5 : 1 },
                        ]}
                        onPress={handleSubmit}
                        disabled={selected.size === 0}
                    >
                        <Text style={styles.submitBtnText}>Submit Answers ✔</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {submitted && !resultCorrect && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>💡 Explanation</Text>
                    <Text style={styles.explanationText}>{round.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#E8EAF6',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 14,
    },
    hintText: { fontSize: 13, color: '#3949AB', fontWeight: '700', textAlign: 'center' },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        padding: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },
    statusIcon: { fontSize: 20 },
    itemText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 20 },
    submitBtn: {
        backgroundColor: '#667EEA',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    explanationBox: {
        backgroundColor: '#FFF3E0',
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#BF360C', lineHeight: 20 },
});

export default MultiSelectGame;
