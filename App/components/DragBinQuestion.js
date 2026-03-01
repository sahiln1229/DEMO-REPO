import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    PanResponder,
    Animated,
    StyleSheet,
    Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── DragBin Question Component ───────────────────────────────────────────────
// Props:
//   question : { question, items:[{id,label,emoji,correctBin}], bins:[{id,label,color}], explanation }
//   onAnswer : (isCorrect: boolean) => void
//
// Renders draggable cards (PanResponder) above colour-coded target bins.
// Uses onLayout on each bin to get its screen position for collision detection.

const ITEM_W = 80;
const ITEM_H = 72;

const DragBinQuestion = ({ question, onAnswer }) => {
    const { theme } = useTheme();

    // Per-item state: pan values, placed flag, correctness
    const [itemStates, setItemStates] = useState(
        question.items.map((item) => ({
            ...item,
            placed: false,
            correct: null,
        }))
    );
    const [done, setDone] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // Animated values for each item
    const pans = useRef(question.items.map(() => new Animated.ValueXY({ x: 0, y: 0 }))).current;

    // Bin layout refs: { x, y, width, height } in page coordinates
    const binLayouts = useRef(question.bins.map(() => null));
    const containerRef = useRef(null);
    const containerLayout = useRef(null);

    const handleBinLayout = useCallback(
        (binIndex) => (event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            // We need page position, so measure relative to page
            binLayouts.current[binIndex] = { x, y, width, height };
        },
        []
    );

    const handleContainerLayout = useCallback((event) => {
        containerLayout.current = event.nativeEvent.layout;
    }, []);

    const checkCollision = (gestureX, gestureY, itemIndex) => {
        // gestureX/Y are offsets from the item's initial position within the container
        // We rely on approximate row positions for bin detection
        let hit = -1;
        binLayouts.current.forEach((layout, binIndex) => {
            if (!layout) return;
            // The item centre relative to container
            const cx = gestureX;
            const cy = gestureY;
            const { x, y, width, height } = layout;
            if (cx >= x && cx <= x + width && cy >= y && cy <= y + height) {
                hit = binIndex;
            }
        });
        return hit;
    };

    const createPanResponder = (itemIndex) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => !itemStates[itemIndex].placed,
            onMoveShouldSetPanResponder: () => !itemStates[itemIndex].placed,
            onPanResponderMove: Animated.event(
                [null, { dx: pans[itemIndex].x, dy: pans[itemIndex].y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                // Get absolute position of the dragged item
                const absX = gesture.moveX;
                const absY = gesture.moveY;

                // Find which bin was hit using absolute layout
                let hitBin = -1;
                binLayouts.current.forEach((layout, binIndex) => {
                    if (!layout) return;
                    // layout is relative to container; convert to page coords
                    const contTop = containerLayout.current?.y ?? 0;
                    const contLeft = containerLayout.current?.x ?? 0;

                    const binPageX = contLeft + layout.x;
                    const binPageY = contTop + layout.y;
                    const binPageRight = binPageX + layout.width;
                    const binPageBottom = binPageY + layout.height;

                    if (
                        absX >= binPageX &&
                        absX <= binPageRight &&
                        absY >= binPageY &&
                        absY <= binPageBottom
                    ) {
                        hitBin = binIndex;
                    }
                });

                const item = itemStates[itemIndex];
                if (hitBin !== -1) {
                    const isCorrect = hitBin === item.correctBin;
                    // Snap to bin or spring back
                    if (isCorrect) {
                        // Keep near the drop position
                        setItemStates((prev) => {
                            const next = [...prev];
                            next[itemIndex] = { ...next[itemIndex], placed: true, correct: true };
                            return next;
                        });
                        // Small bounce animation
                        Animated.spring(pans[itemIndex], {
                            toValue: { x: gesture.dx, y: gesture.dy },
                            friction: 5,
                            useNativeDriver: false,
                        }).start(() => checkAllPlaced());
                    } else {
                        // Wrong bin → spring back
                        setItemStates((prev) => {
                            const next = [...prev];
                            next[itemIndex] = { ...next[itemIndex], correct: false };
                            return next;
                        });
                        Animated.spring(pans[itemIndex], {
                            toValue: { x: 0, y: 0 },
                            friction: 5,
                            useNativeDriver: false,
                        }).start(() => {
                            setItemStates((prev) => {
                                const next = [...prev];
                                next[itemIndex] = { ...next[itemIndex], correct: null };
                                return next;
                            });
                        });
                    }
                } else {
                    // Dropped outside → spring back
                    Animated.spring(pans[itemIndex], {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,
                    }).start();
                }
            },
        });

    const panResponders = useRef(question.items.map((_, i) => createPanResponder(i))).current;

    const checkAllPlaced = () => {
        setItemStates((prev) => {
            const allPlaced = prev.every((s) => s.placed);
            if (allPlaced && !done) {
                const allCorrect = prev.every((s) => s.correct === true);
                setDone(true);
                setShowExplanation(true);
                setTimeout(() => onAnswer(allCorrect), 1200);
            }
            return prev;
        });
    };

    return (
        <View onLayout={handleContainerLayout} ref={containerRef}>
            <Text style={[styles.questionText, { color: theme.text }]}>{question.question}</Text>

            {/* ── Draggable items row ── */}
            <View style={styles.itemsRow}>
                {question.items.map((item, i) => {
                    const border = itemStates[i].correct === true
                        ? '#4CAF50'
                        : itemStates[i].correct === false
                            ? '#F44336'
                            : '#DDD';
                    return (
                        <Animated.View
                            key={item.id}
                            style={[
                                styles.dragItem,
                                {
                                    transform: pans[i].getTranslateTransform(),
                                    opacity: itemStates[i].placed ? 0.35 : 1,
                                    borderColor: border,
                                    borderWidth: 2,
                                    backgroundColor: theme.card,
                                    zIndex: 10,
                                },
                            ]}
                            {...panResponders[i].panHandlers}
                        >
                            <Text style={styles.itemEmoji}>{item.emoji}</Text>
                            <Text
                                style={[styles.itemLabel, { color: theme.text }]}
                                numberOfLines={2}
                            >
                                {item.label.replace(/^[^ ]+ /, '')}
                            </Text>
                        </Animated.View>
                    );
                })}
            </View>

            <Text style={[styles.arrowHint, { color: theme.textSecondary }]}>
                ⬇ Drag each item to the correct bin below
            </Text>

            {/* ── Bins row ── */}
            <View style={styles.binsRow}>
                {question.bins.map((bin, binIndex) => (
                    <View
                        key={bin.id}
                        style={[styles.bin, { backgroundColor: bin.color }]}
                        onLayout={handleBinLayout(binIndex)}
                    >
                        <Text style={[styles.binLabel, { color: bin.textColor }]}>{bin.label}</Text>
                    </View>
                ))}
            </View>

            {showExplanation && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>💡 {question.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    questionText: { fontSize: 17, fontWeight: '700', marginBottom: 16, lineHeight: 26 },
    itemsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 10,
        minHeight: ITEM_H + 14,
    },
    dragItem: {
        width: ITEM_W,
        height: ITEM_H,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        padding: 4,
    },
    itemEmoji: { fontSize: 26, marginBottom: 4 },
    itemLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
    arrowHint: { textAlign: 'center', fontSize: 13, fontWeight: '500', marginBottom: 12 },
    binsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    bin: {
        width: 80,
        minHeight: 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    binLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
    explanationBox: {
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
    },
    explanationText: { fontSize: 13, color: '#6D4C41', lineHeight: 20, fontWeight: '500' },
});

export default DragBinQuestion;
