import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── SpotMistakeGame ──────────────────────────────────────────────────────────
// Shows 4 items; exactly ONE is wrong/unsafe.
// User taps it → correct → green flash + pulse + onComplete(true)
// User taps wrong one → red flash + shake on that item
const SpotMistakeGame = ({ round, onComplete }) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState(null);
    const [done, setDone] = useState(false);

    const scales = useRef(round.items.map(() => new Animated.Value(1))).current;
    const shakes = useRef(round.items.map(() => new Animated.Value(0))).current;
    const bgAnims = useRef(round.items.map(() => new Animated.Value(0))).current;

    const pulse = (idx) => {
        Animated.sequence([
            Animated.spring(scales[idx], { toValue: 1.12, friction: 5, useNativeDriver: false }),
            Animated.spring(scales[idx], { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shake = (idx) => {
        Animated.sequence([
            Animated.timing(shakes[idx], { toValue: 9, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -9, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 7, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -7, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const handleTap = (item, idx) => {
        if (done || selected) return;
        setSelected(item.id);
        if (item.isWrong) {
            pulse(idx);
            setDone(true);
            setTimeout(() => onComplete(true), 900);
        } else {
            shake(idx);
            setTimeout(() => setSelected(null), 700);
        }
    };

    const itemBg = (item, idx) => {
        if (selected === item.id && item.isWrong) return '#FFEBEE';
        if (selected === item.id && !item.isWrong) return '#FFEBEE';
        if (done && item.isWrong) return '#E8F5E9';
        return theme.card;
    };

    const itemBorder = (item) => {
        if (done && item.isWrong) return '#4CAF50';
        if (selected === item.id && !item.isWrong) return '#F44336';
        return '#E0E0E0';
    };

    return (
        <View>
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {done ? '✅ Found the mistake!' : '👆 Tap the ONE wrong or unsafe item'}
                </Text>
            </View>

            {round.items.map((item, idx) => (
                <Animated.View
                    key={item.id}
                    style={{
                        transform: [
                            { scale: scales[idx] },
                            { translateX: shakes[idx] },
                        ],
                        marginBottom: 12,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => handleTap(item, idx)}
                        disabled={done}
                        style={[
                            styles.optionCard,
                            {
                                backgroundColor: itemBg(item, idx),
                                borderColor: itemBorder(item),
                            },
                        ]}
                    >
                        <Text style={styles.optionBullet}>
                            {done && item.isWrong ? '❌' : '⬜'}
                        </Text>
                        <Text style={[styles.optionText, { color: theme.text }]}>
                            {item.text}
                        </Text>
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
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    hintText: { fontSize: 13, color: '#E65100', fontWeight: '700', textAlign: 'center' },
    optionCard: {
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
    optionBullet: { fontSize: 18 },
    optionText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
    explanationBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 14,
        padding: 14,
        marginTop: 8,
    },
    explanationTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
    explanationText: { fontSize: 13, color: '#1B5E20', lineHeight: 20 },
});

export default SpotMistakeGame;
