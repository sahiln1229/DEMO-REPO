import React, { useState, useRef, useMemo } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── TapSequenceGame ──────────────────────────────────────────────────────────
// Items are shown shuffled. User must tap them in the correct numeric order.
// Each wrong tap → shake the tapped item. Each correct tap → turn green + badge.
// All tapped correctly → onComplete(wrongTaps === 0).
const TapSequenceGame = ({ round, onComplete }) => {
    const { theme } = useTheme();

    const shuffled = useMemo(() => shuffle([...round.items]), [round]);
    const total = shuffled.length;

    const [nextRequired, setNextRequired] = useState(1); // expected next correctOrder
    const [tappedOrders, setTappedOrders] = useState([]); // correctOrder values tapped so far
    const [wrongTaps, setWrongTaps] = useState(0);
    const [done, setDone] = useState(false);

    const scales = useRef(shuffled.map(() => new Animated.Value(1))).current;
    const shakes = useRef(shuffled.map(() => new Animated.Value(0))).current;

    const pulseItem = (idx) => {
        Animated.sequence([
            Animated.spring(scales[idx], { toValue: 1.1, friction: 5, useNativeDriver: false }),
            Animated.spring(scales[idx], { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
    };

    const shakeItem = (idx) => {
        Animated.sequence([
            Animated.timing(shakes[idx], { toValue: 9, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -9, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 7, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: -7, duration: 55, useNativeDriver: false }),
            Animated.timing(shakes[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    const handleTap = (item, idx) => {
        if (done || tappedOrders.includes(item.correctOrder)) return;

        if (item.correctOrder === nextRequired) {
            // ✅ Correct tap
            pulseItem(idx);
            const newTapped = [...tappedOrders, item.correctOrder];
            setTappedOrders(newTapped);
            setNextRequired(nextRequired + 1);

            if (newTapped.length === total) {
                setDone(true);
                setTimeout(() => onComplete(wrongTaps === 0), 700);
            }
        } else {
            // ❌ Wrong tap
            shakeItem(idx);
            setWrongTaps((w) => w + 1);
        }
    };

    const isTapped = (item) => tappedOrders.includes(item.correctOrder);

    const cardBg = (item) =>
        isTapped(item) ? '#E8F5E9' : theme.card;

    const cardBorder = (item) =>
        isTapped(item) ? '#4CAF50' : '#E0E0E0';

    return (
        <View>
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {done
                        ? '🎉 Perfect sequence!'
                        : `Tap item #${nextRequired} next  (${tappedOrders.length}/${total} done${wrongTaps > 0 ? ` · ${wrongTaps} mistake${wrongTaps > 1 ? 's' : ''}` : ''})`}
                </Text>
            </View>

            <View style={styles.grid}>
                {shuffled.map((item, idx) => (
                    <Animated.View
                        key={item.id}
                        style={{
                            transform: [
                                { scale: scales[idx] },
                                { translateX: shakes[idx] },
                            ],
                            width: '47%',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleTap(item, idx)}
                            disabled={done || isTapped(item)}
                            style={[
                                styles.itemCard,
                                { backgroundColor: cardBg(item), borderColor: cardBorder(item) },
                            ]}
                        >
                            {isTapped(item) && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.correctOrder}</Text>
                                </View>
                            )}
                            <Text style={styles.itemEmoji}>{item.emoji}</Text>
                            <Text style={[styles.itemLabel, { color: theme.text }]} numberOfLines={2}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#E0F7FA',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    hintText: { fontSize: 13, color: '#006064', fontWeight: '700', textAlign: 'center' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    itemCard: {
        borderRadius: 18,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        minHeight: 100,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,
        elevation: 3,
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    itemEmoji: { fontSize: 30, marginBottom: 6 },
    itemLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
});

export default TapSequenceGame;
