import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── ScenarioSelectGame ───────────────────────────────────────────────────────
// Shows a real-world clinical scenario card.
// Below are 4 option cards (emoji + label).
// User taps one option – correct → green pulse, wrong → red shake.
const ScenarioSelectGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState(null);
    const [done, setDone] = useState(false);
    const [wrongTap, setWrongTap] = useState(null);

    const scales = useRef(round.options.map(() => new Animated.Value(1))).current;
    const shakes = useRef(round.options.map(() => new Animated.Value(0))).current;

    const pulseCard = (idx) => {
        Animated.sequence([
            Animated.spring(scales[idx], { toValue: 1.08, friction: 5, useNativeDriver: false }),
            Animated.spring(scales[idx], { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shakeCard = (idx) => {
        Animated.sequence([
            Animated.timing(shakes[idx], { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 8, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -8, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const handleSelect = (option, idx) => {
        if (done || selected) return;
        setSelected(option.id);
        if (option.correct) {
            pulseCard(idx);
            setDone(true);
            setTimeout(() => onComplete(wrongTap === null), 900);
        } else {
            shakeCard(idx);
            setWrongTap(option.id);
            setTimeout(() => {
                setSelected(null);
                setWrongTap(null);
            }, 800);
        }
    };

    const cardBg = (option) => {
        if (selected === option.id && option.correct) return '#E8F5E9';
        if (selected === option.id && !option.correct) return '#FFEBEE';
        if (done && option.correct) return '#E8F5E9';
        return theme.card;
    };

    const cardBorder = (option) => {
        if (selected === option.id && option.correct) return '#4CAF50';
        if (selected === option.id && !option.correct) return '#F44336';
        if (done && option.correct) return '#4CAF50';
        return '#E0E0E0';
    };

    return (
        <View>
            {/* Scenario banner */}
            <View style={[styles.scenarioCard, { backgroundColor: '#667EEA' }]}>
                <Text style={styles.scenarioIcon}>🏥</Text>
                <Text style={styles.scenarioText}>{round.scenario}</Text>
            </View>

            <Text style={[styles.selectLabel, { color: theme.textSecondary }]}>
                Tap the correct answer:
            </Text>

            <View style={styles.optionsGrid}>
                {round.options.map((option, idx) => (
                    <Animated.View
                        key={option.id}
                        style={{
                            transform: [
                                { scale: scales[idx] },
                                { translateX: shakes[idx] },
                            ],
                            width: '48%',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.82}
                            onPress={() => handleSelect(option, idx)}
                            disabled={done}
                            style={[
                                styles.optionCard,
                                { backgroundColor: cardBg(option), borderColor: cardBorder(option) },
                            ]}
                        >
                            <Text style={styles.optionEmoji}>{option.emoji}</Text>
                            <Text style={[styles.optionLabel, { color: theme.text }]} numberOfLines={3}>
                                {option.label}
                            </Text>
                            {done && option.correct && (
                                <Text style={styles.correctTick}>✅</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>

            {done && round.explanation && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>💡 Explanation</Text>
                    <Text style={styles.explanationText}>{round.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scenarioCard: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    scenarioIcon: { fontSize: 28 },
    scenarioText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 22 },
    selectLabel: { fontSize: 13, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 4,
    },
    optionCard: {
        borderRadius: 18,
        borderWidth: 2,
        padding: 14,
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,
        elevation: 2,
    },
    optionEmoji: { fontSize: 28, marginBottom: 6 },
    optionLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
    correctTick: { marginTop: 6, fontSize: 18 },
    explanationBox: {
        backgroundColor: '#E3F2FD',
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#1565C0', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#0D47A1', lineHeight: 20 },
});

export default ScenarioSelectGame;
