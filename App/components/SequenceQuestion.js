import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── Sequence Question Component ──────────────────────────────────────────────
// Props:
//   question : { question, items, correctOrder, explanation }
//   onAnswer : (isCorrect: boolean) => void
//
// The user taps items in the order they believe is correct.
// Each tapped item is highlighted and added to a "selected" list.
// After all items are selected, the answer is evaluated.

const SequenceQuestion = ({ question, onAnswer }) => {
    const { theme } = useTheme();
    const [tapped, setTapped] = useState([]); // indices as they were tapped
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleTap = (index) => {
        if (submitted) return;
        if (tapped.includes(index)) return; // cannot re-tap

        const next = [...tapped, index];
        setTapped(next);

        if (next.length === question.items.length) {
            // Evaluate
            const correct = question.correctOrder.every((val, i) => val === next[i]);
            setIsCorrect(correct);
            setSubmitted(true);
            setTimeout(() => onAnswer(correct), 1000);
        }
    };

    const getItemStyle = (index) => {
        const tapPosition = tapped.indexOf(index);
        if (!submitted) {
            if (tapPosition === -1) return { backgroundColor: theme.card, borderColor: '#DDD' };
            return { backgroundColor: '#667EEA', borderColor: '#667EEA' };
        }
        // After submit
        const expected = question.correctOrder[tapPosition];
        if (tapPosition === -1) return { backgroundColor: theme.card, borderColor: '#DDD' };
        if (expected === index) return { backgroundColor: '#4CAF50', borderColor: '#4CAF50' };
        return { backgroundColor: '#F44336', borderColor: '#F44336' };
    };

    const getTextColor = (index) => {
        const tapPosition = tapped.indexOf(index);
        if (tapPosition !== -1) return '#fff';
        return theme.text;
    };

    const reset = () => {
        setTapped([]);
        setSubmitted(false);
        setIsCorrect(null);
    };

    return (
        <View>
            <Text style={[styles.questionText, { color: theme.text }]}>{question.question}</Text>

            {/* Selected so far indicator */}
            {tapped.length > 0 && !submitted && (
                <View style={styles.progress}>
                    <Text style={styles.progressText}>
                        Step {tapped.length} of {question.items.length} selected
                    </Text>
                </View>
            )}

            {/* Items */}
            {question.items.map((item, index) => {
                const tapPos = tapped.indexOf(index);
                const itemStyle = getItemStyle(index);
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        style={[styles.item, itemStyle]}
                        onPress={() => handleTap(index)}
                    >
                        <View style={styles.itemLeft}>
                            {tapPos !== -1 ? (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{tapPos + 1}</Text>
                                </View>
                            ) : (
                                <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
                                    <Text style={[styles.badgeText, { color: theme.textSecondary }]}>?</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.itemText, { color: getTextColor(index) }]}>{item}</Text>
                    </TouchableOpacity>
                );
            })}

            {submitted && (
                <View style={[styles.explanationBox, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Text style={[styles.explanationText, { color: isCorrect ? '#2E7D32' : '#C62828' }]}>
                        {isCorrect ? '🎉 Perfect order!' : '❌ Not quite right.'}
                    </Text>
                    <Text style={styles.explanationHint}>💡 {question.explanation}</Text>
                    {!isCorrect && (
                        <TouchableOpacity style={styles.retryBtn} onPress={reset}>
                            <Text style={styles.retryText}>Try again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    questionText: { fontSize: 17, fontWeight: '700', marginBottom: 16, lineHeight: 26 },
    progress: { marginBottom: 10 },
    progressText: { fontSize: 13, color: '#667EEA', fontWeight: '600' },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 2,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    itemLeft: { marginRight: 12 },
    badge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    itemText: { flex: 1, fontSize: 15, fontWeight: '500' },
    explanationBox: {
        borderRadius: 12,
        padding: 14,
        marginTop: 6,
    },
    explanationText: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    explanationHint: { fontSize: 13, color: '#555', lineHeight: 20 },
    retryBtn: {
        marginTop: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#667EEA',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    retryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});

export default SequenceQuestion;
