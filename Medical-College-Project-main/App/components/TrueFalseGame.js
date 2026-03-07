import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── TrueFalseGame ────────────────────────────────────────────────────────────
// Shows a statement. User taps TRUE or FALSE.
// Correct → green pulse. Wrong → red shake + show explanation.
const TrueFalseGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const [answered, setAnswered] = useState(null); // null | true | false
    const [done, setDone] = useState(false);

    const trueScale = useRef(new Animated.Value(1)).current;
    const falseScale = useRef(new Animated.Value(1)).current;
    const trueShake = useRef(new Animated.Value(0)).current;
    const falseShake = useRef(new Animated.Value(0)).current;

    const pulse = (anim) => {
        Animated.sequence([
            Animated.spring(anim, { toValue: 1.1, friction: 5, useNativeDriver: false }),
            Animated.spring(anim, { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shake = (anim) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(anim, { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(anim, { toValue: 8, duration: 55, useNativeDriver: false }),
            Animated.timing(anim, { toValue: -8, duration: 55, useNativeDriver: false }),
            Animated.timing(anim, { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const handleAnswer = (choice) => {
        if (done) return;
        setAnswered(choice);
        const isCorrect = choice === round.correct;
        if (isCorrect) {
            pulse(choice ? trueScale : falseScale);
            setDone(true);
            setTimeout(() => onComplete(true), 900);
        } else {
            shake(choice ? trueScale : falseScale);
            setTimeout(() => setAnswered(null), 800);
        }
    };

    const btnBg = (isTrue) => {
        if (answered !== null && answered === isTrue) {
            return answered === round.correct ? '#E8F5E9' : '#FFEBEE';
        }
        return isTrue ? '#E8F5E9' : '#FFEBEE';
    };

    const btnBorder = (isTrue) => {
        if (answered !== null && answered === isTrue) {
            return answered === round.correct ? '#4CAF50' : '#F44336';
        }
        return isTrue ? '#4CAF50' : '#F44336';
    };

    return (
        <View style={styles.container}>
            {/* Statement card */}
            <View style={[styles.statementCard, { backgroundColor: theme.card }]}>
                <Text style={styles.statementEmoji}>🤔</Text>
                <Text style={[styles.statementText, { color: theme.text }]}>
                    {round.statement}
                </Text>
            </View>

            {/* TRUE button */}
            <Animated.View
                style={{
                    transform: [{ scale: trueScale }, { translateX: trueShake }],
                    marginBottom: 14,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.answerBtn, { backgroundColor: btnBg(true), borderColor: btnBorder(true) }]}
                    onPress={() => handleAnswer(true)}
                    disabled={done}
                >
                    <Text style={styles.answerIcon}>✅</Text>
                    <Text style={[styles.answerLabel, { color: '#2E7D32' }]}>TRUE</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* FALSE button */}
            <Animated.View
                style={{
                    transform: [{ scale: falseScale }, { translateX: falseShake }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.answerBtn, { backgroundColor: btnBg(false), borderColor: btnBorder(false) }]}
                    onPress={() => handleAnswer(false)}
                    disabled={done}
                >
                    <Text style={styles.answerIcon}>❌</Text>
                    <Text style={[styles.answerLabel, { color: '#C62828' }]}>FALSE</Text>
                </TouchableOpacity>
            </Animated.View>

            {done && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>💡 Explanation</Text>
                    <Text style={styles.explanationText}>{round.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 0 },
    statementCard: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statementEmoji: { fontSize: 36, marginBottom: 12 },
    statementText: { fontSize: 15, fontWeight: '600', textAlign: 'center', lineHeight: 24 },
    answerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        borderWidth: 2.5,
        paddingVertical: 18,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 2,
    },
    answerIcon: { fontSize: 26 },
    answerLabel: { fontSize: 20, fontWeight: '900', letterSpacing: 2 },
    explanationBox: {
        backgroundColor: '#E3F2FD',
        borderRadius: 14,
        padding: 14,
        marginTop: 18,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#1565C0', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#0D47A1', lineHeight: 20 },
});

export default TrueFalseGame;
