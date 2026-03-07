import React, { useRef, useState, useMemo } from 'react';
import {
    View,
    Text,
    Animated,
    PanResponder,
    StyleSheet,
    UIManager,
    findNodeHandle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const CARD_W = 88;
const CARD_H = 88;

// ─── DragDropGame ──────────────────────────────────────────────────────────────
// ALL animations use useNativeDriver: false (required because pan values are
// JS-driven and cannot be mixed with native-driver animations on the same node).

const DragDropGame = ({ round, onComplete }) => {
    const { theme } = useTheme();

    const initialItems = useMemo(() => shuffle([...round.items]), [round]);

    // ── State (mirrored in refs so PanResponder closures always read fresh values)
    const [itemStates, _setItemStates] = useState(() =>
        initialItems.map((item) => ({ ...item, placed: false, wrong: false }))
    );
    const itemStatesRef = useRef(itemStates);
    const setItemStates = (updater) => {
        _setItemStates((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            itemStatesRef.current = next;
            return next;
        });
    };

    const wrongDropsTotalRef = useRef(0);
    const doneRef = useRef(false);
    const [done, setDone] = useState(false);
    const [hoverZone, setHoverZone] = useState(-1);
    const [activeIndex, setActiveIndex] = useState(-1);

    // ── Animated values — ALL use useNativeDriver: false ─────────────────────
    // Pan (x/y) — must be JS driven for layout-based dragging
    const pans = useRef(initialItems.map(() => new Animated.ValueXY({ x: 0, y: 0 }))).current;
    // Scale for pulse effect — JS driven (same transform array as pan)
    const scales = useRef(initialItems.map(() => new Animated.Value(1))).current;
    // Shake offset — JS driven (same transform array as pan)
    const shakeAnims = useRef(initialItems.map(() => new Animated.Value(0))).current;

    // ── Zone layout via UIManager ─────────────────────────────────────────────
    const zoneRefs = useRef(round.zones.map(() => React.createRef()));
    const zonePageLayouts = useRef(round.zones.map(() => null));

    const measureZone = (zoneIndex) => {
        const ref = zoneRefs.current[zoneIndex];
        const node = ref?.current;
        if (!node) return;
        const handle = findNodeHandle(node);
        if (handle == null) return;
        UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
            zonePageLayouts.current[zoneIndex] = { pageX, pageY, width, height };
        });
    };

    const onZoneLayout = (zoneIndex) => () => {
        setTimeout(() => measureZone(zoneIndex), 150);
    };

    const hitZone = (absX, absY) => {
        let hit = -1;
        zonePageLayouts.current.forEach((z, i) => {
            if (!z) return;
            if (
                absX >= z.pageX && absX <= z.pageX + z.width &&
                absY >= z.pageY && absY <= z.pageY + z.height
            ) hit = i;
        });
        return hit;
    };

    // ── Animations (ALL useNativeDriver: false) ───────────────────────────────
    const triggerPulse = (idx) => {
        Animated.sequence([
            Animated.spring(scales[idx], {
                toValue: 1.2, friction: 5, tension: 80,
                useNativeDriver: false,  // ← must match pan driver
            }),
            Animated.spring(scales[idx], {
                toValue: 1, friction: 6, tension: 80,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const triggerShake = (idx) => {
        Animated.sequence([
            Animated.timing(shakeAnims[idx], { toValue: 10, duration: 55, useNativeDriver: false }),
            Animated.timing(shakeAnims[idx], { toValue: -10, duration: 55, useNativeDriver: false }),
            Animated.timing(shakeAnims[idx], { toValue: 8, duration: 55, useNativeDriver: false }),
            Animated.timing(shakeAnims[idx], { toValue: -8, duration: 55, useNativeDriver: false }),
            Animated.timing(shakeAnims[idx], { toValue: 0, duration: 55, useNativeDriver: false }),
        ]).start();
    };

    // ── Completion ────────────────────────────────────────────────────────────
    const checkAllPlaced = (currentStates, currentWrongDrops) => {
        if (doneRef.current) return;
        if (currentStates.every((s) => s.placed)) {
            doneRef.current = true;
            setDone(true);
            setTimeout(() => onComplete(currentWrongDrops === 0), 700);
        }
    };

    // ── PanResponders (created once — read state from refs) ───────────────────
    const panResponders = useRef(
        initialItems.map((item, itemIndex) => {
            let currentHover = -1;

            return PanResponder.create({
                onStartShouldSetPanResponder: () =>
                    !itemStatesRef.current[itemIndex]?.placed,
                onMoveShouldSetPanResponder: () =>
                    !itemStatesRef.current[itemIndex]?.placed,

                onPanResponderGrant: () => {
                    setActiveIndex(itemIndex);
                    pans[itemIndex].setOffset({
                        x: pans[itemIndex].x._value,
                        y: pans[itemIndex].y._value,
                    });
                    pans[itemIndex].setValue({ x: 0, y: 0 });
                },

                onPanResponderMove: (e, gesture) => {
                    // useNativeDriver: false is implicit in Animated.event when
                    // the mapped value was created as a JS animated value
                    Animated.event(
                        [null, { dx: pans[itemIndex].x, dy: pans[itemIndex].y }],
                        { useNativeDriver: false }
                    )(e, gesture);

                    const hz = hitZone(gesture.moveX, gesture.moveY);
                    if (hz !== currentHover) {
                        currentHover = hz;
                        setHoverZone(hz);
                    }
                },

                onPanResponderRelease: (_, gesture) => {
                    pans[itemIndex].flattenOffset();
                    setActiveIndex(-1);
                    setHoverZone(-1);
                    currentHover = -1;

                    const hit = hitZone(gesture.moveX, gesture.moveY);

                    if (hit !== -1 && hit === item.correctZone) {
                        // ✅ Correct — keep at drop position + pulse
                        Animated.spring(pans[itemIndex], {
                            toValue: { x: gesture.dx, y: gesture.dy },
                            friction: 7,
                            tension: 80,
                            useNativeDriver: false,  // ← JS driver
                        }).start(() => triggerPulse(itemIndex));

                        setItemStates((prev) => {
                            const next = prev.map((s, i) =>
                                i === itemIndex ? { ...s, placed: true, wrong: false } : s
                            );
                            checkAllPlaced(next, wrongDropsTotalRef.current);
                            return next;
                        });
                    } else {
                        // ❌ Wrong — spring back + shake
                        if (hit !== -1) {
                            wrongDropsTotalRef.current += 1;
                        }
                        setItemStates((prev) =>
                            prev.map((s, i) =>
                                i === itemIndex ? { ...s, wrong: true } : s
                            )
                        );
                        Animated.spring(pans[itemIndex], {
                            toValue: { x: 0, y: 0 },
                            friction: 5,
                            tension: 80,
                            useNativeDriver: false,  // ← JS driver
                        }).start();
                        triggerShake(itemIndex);
                        setTimeout(() => {
                            setItemStates((prev) =>
                                prev.map((s, i) =>
                                    i === itemIndex ? { ...s, wrong: false } : s
                                )
                            );
                        }, 500);
                    }
                },

                onPanResponderTerminate: () => {
                    pans[itemIndex].flattenOffset();
                    setActiveIndex(-1);
                    setHoverZone(-1);
                    Animated.spring(pans[itemIndex], {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,  // ← JS driver
                    }).start();
                },
            });
        })
    ).current;

    // ── Visual helpers ────────────────────────────────────────────────────────
    const cardBorder = (idx) => {
        if (itemStates[idx].placed) return '#4CAF50';
        if (itemStates[idx].wrong) return '#F44336';
        return '#DDDDDD';
    };
    const cardBg = (idx) => {
        if (itemStates[idx].placed) return '#E8F5E9';
        if (itemStates[idx].wrong) return '#FFEBEE';
        return theme.card;
    };

    return (
        <View>
            {/* Hint */}
            <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                    {done
                        ? '🎉 All placed correctly!'
                        : `👆 Hold & drag each card to its correct zone · ${itemStates.filter((s) => s.placed).length}/${initialItems.length} placed`}
                </Text>
            </View>

            {/* Draggable cards */}
            <View style={styles.itemsBank}>
                {initialItems.map((item, i) => (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.dragCard,
                            {
                                // All transforms share the same (JS-driven) animated values
                                transform: [
                                    { translateX: Animated.add(pans[i].x, shakeAnims[i]) },
                                    { translateY: pans[i].y },
                                    { scale: scales[i] },
                                ],
                                opacity: itemStates[i].placed ? 0.3 : 1,
                                borderColor: cardBorder(i),
                                backgroundColor: cardBg(i),
                                zIndex: activeIndex === i ? 999 : 10,
                                elevation: activeIndex === i ? 16 : 8,
                            },
                        ]}
                        {...panResponders[i].panHandlers}
                    >
                        <Text style={styles.cardEmoji}>{item.emoji}</Text>
                        <Text style={[styles.cardLabel, { color: theme.text }]} numberOfLines={2}>
                            {item.label}
                        </Text>
                    </Animated.View>
                ))}
            </View>

            <View style={styles.arrowRow}>
                <Text style={[styles.arrowText, { color: theme.textSecondary }]}>
                    ⬇  Drop into the correct zone below
                </Text>
            </View>

            {/* Drop zones */}
            <View style={[styles.zonesGrid, { flexWrap: 'wrap' }]}>
                {round.zones.map((zone, zoneIndex) => {
                    const placedCount = itemStates.filter(
                        (s) => s.placed && s.correctZone === zoneIndex
                    ).length;
                    const expectedCount = round.items.filter(
                        (it) => it.correctZone === zoneIndex
                    ).length;
                    const zoneFull = placedCount === expectedCount && expectedCount > 0;
                    const isHovered = hoverZone === zoneIndex && !zoneFull;

                    return (
                        <View
                            key={zone.id}
                            ref={zoneRefs.current[zoneIndex]}
                            onLayout={onZoneLayout(zoneIndex)}
                            style={[
                                styles.zone,
                                {
                                    backgroundColor: zoneFull
                                        ? zone.color + 'CC'
                                        : isHovered
                                            ? zone.color + '55'
                                            : zone.color + '22',
                                    borderColor: zone.color,
                                    borderWidth: isHovered ? 3.5 : zoneFull ? 3 : 2,
                                    width: round.zones.length <= 2 ? '48%' : '47%',
                                    shadowColor: isHovered ? zone.color : '#000',
                                    shadowOpacity: isHovered ? 0.55 : 0.06,
                                    shadowRadius: isHovered ? 14 : 4,
                                    elevation: isHovered ? 10 : 2,
                                },
                            ]}
                        >
                            <Text style={[styles.zoneLabel, { color: zoneFull ? zone.textColor : zone.color }]}>
                                {zone.label}
                            </Text>
                            {zoneFull ? (
                                <Text style={styles.zoneTick}>✅</Text>
                            ) : (
                                <Text style={[styles.zoneCount, { color: zone.color }]}>
                                    {placedCount}/{expectedCount}
                                </Text>
                            )}
                            {itemStates
                                .filter((s) => s.placed && s.correctZone === zoneIndex)
                                .map((s) => (
                                    <View key={s.id} style={styles.placedChip}>
                                        <Text style={styles.placedChipText}>{s.emoji} {s.label}</Text>
                                    </View>
                                ))}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hintBanner: {
        backgroundColor: '#EDE7F6',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 14,
    },
    hintText: { fontSize: 13, color: '#512DA8', fontWeight: '600', textAlign: 'center' },
    itemsBank: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        minHeight: CARD_H + 16,
        marginBottom: 10,
    },
    dragCard: {
        width: CARD_W,
        height: CARD_H,
        borderRadius: 18,
        borderWidth: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    cardEmoji: { fontSize: 28, marginBottom: 4 },
    cardLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
    arrowRow: { alignItems: 'center', marginBottom: 12 },
    arrowText: { fontSize: 13, fontWeight: '600' },
    zonesGrid: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
    zone: {
        minHeight: 104,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10,
        shadowOffset: { width: 0, height: 3 },
    },
    zoneLabel: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
    zoneTick: { fontSize: 20, marginTop: 6 },
    zoneCount: { fontSize: 12, fontWeight: '700', marginTop: 4 },
    placedChip: {
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 4,
    },
    placedChipText: { fontSize: 10, fontWeight: '700', color: '#333' },
});

export default DragDropGame;
