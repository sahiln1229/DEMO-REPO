import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

// ─── Static chapter metadata (icons, colours) ────────────────────────────────
const CHAPTER_META = [
    {
        id: 1,
        title: 'Waste Disposal',
        iconName: 'trash',
        iconType: 'Ionicons',
        gradient: ['#FF512F', '#DD2476'],
    },
    {
        id: 2,
        title: 'Blood Spillage',
        iconName: 'water',
        iconType: 'Ionicons',
        gradient: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 3,
        title: 'Chemical Spillage',
        iconName: 'flask',
        iconType: 'Ionicons',
        gradient: ['#11998e', '#38ef7d'],
    },
    {
        id: 4,
        title: 'Wearing PPE',
        iconName: 'shield-alt',
        iconType: 'FontAwesome5',
        gradient: ['#4FACFE', '#00F2FE'],
    },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
const renderChapterIcon = (type, name, color) => {
    const size = 22;
    if (type === 'Ionicons') return <Ionicons name={name} size={size} color={color} />;
    if (type === 'FontAwesome5') return <FontAwesome5 name={name} size={size} color={color} />;
    if (type === 'MaterialCommunityIcons')
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
    return null;
};

// ─── Component ───────────────────────────────────────────────────────────────
const CertificatePage = ({ navigation }) => {
    const { theme } = useTheme();
    const { chapters: progressChapters, allChaptersComplete, getChapterProgress } = useProgress();

    // Merge static meta with live progress
    const chapters = CHAPTER_META.map((meta) => {
        const prog = progressChapters.find((c) => c.id === meta.id);
        const liveProgress = getChapterProgress(meta.id);
        return {
            ...meta,
            progress: liveProgress,
            completed: prog?.completed ?? false,
        };
    });

    const totalChapters = chapters.length;
    const completedChapters = chapters.filter((c) => c.completed).length;
    const allCompleted = allChaptersComplete();

    const handleApply = () => {
        if (allCompleted) {
            navigation.navigate('CertificateDownload');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── HEADER ── */}
            <LinearGradient
                colors={['#FF7EB3', '#FF758C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {/* Back button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerIconWrap}>
                    <MaterialCommunityIcons name="certificate" size={40} color="#FFF" />
                </View>
                <Text style={styles.headerTitle}>Certification Status</Text>
                <Text style={styles.headerSubtitle}>
                    Complete all 3 games in every chapter to unlock your certificate
                </Text>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ── PROGRESS SUMMARY CARD ── */}
                <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: theme.text }]}>{totalChapters}</Text>
                            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                                Total Chapters
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>{completedChapters}</Text>
                            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                                Completed
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#FF758C' }]}>
                                {totalChapters - completedChapters}
                            </Text>
                            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                                Remaining
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── CHAPTER LIST ── */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Chapter Progress</Text>

                <View style={styles.chapterList}>
                    {chapters.map((ch) => (
                        <View key={ch.id} style={[styles.chapterRow, { backgroundColor: theme.card }]}>
                            {/* Left – gradient icon circle */}
                            <LinearGradient
                                colors={ch.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.chapterIconCircle}
                            >
                                {renderChapterIcon(ch.iconType, ch.iconName, '#FFF')}
                            </LinearGradient>

                            {/* Middle – name + progress */}
                            <View style={styles.chapterInfo}>
                                <Text style={[styles.chapterName, { color: theme.text }]}>{ch.title}</Text>
                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: `${ch.progress}%`,
                                                backgroundColor: ch.completed ? '#4CAF50' : '#FF7EB3',
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
                                    {ch.progress}% complete
                                </Text>
                            </View>

                            {/* Right – status icon */}
                            <View style={styles.statusIconWrap}>
                                {ch.completed ? (
                                    <View style={[styles.statusCircle, { backgroundColor: '#E8F5E9' }]}>
                                        <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
                                    </View>
                                ) : (
                                    <View style={[styles.statusCircle, { backgroundColor: '#F5F5F5' }]}>
                                        <Ionicons name="close-circle" size={26} color="#BDBDBD" />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* ── STATUS BANNER ── */}
                {!allCompleted && (
                    <View style={styles.infoBanner}>
                        <Ionicons name="information-circle-outline" size={18} color="#FF758C" />
                        <Text style={styles.infoBannerText}>
                            Complete all {totalChapters} chapters to unlock your certificate.
                        </Text>
                    </View>
                )}

                {allCompleted && (
                    <View style={[styles.infoBanner, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
                        <Text style={[styles.infoBannerText, { color: '#4CAF50' }]}>
                            All chapters completed! You can now apply for your certificate. 🎉
                        </Text>
                    </View>
                )}

                {/* ── APPLY BUTTON ── */}
                {allCompleted ? (
                    <TouchableOpacity activeOpacity={0.85} onPress={handleApply}>
                        <LinearGradient
                            colors={['#FF7EB3', '#FF758C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.applyBtn}
                        >
                            <MaterialCommunityIcons name="certificate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.applyBtnText}>Apply for Certification</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.applyBtn, { backgroundColor: '#C9C9C9' }]}>
                        <MaterialCommunityIcons name="certificate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.applyBtnText}>Apply for Certification</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    backBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 58 : 48,
        left: 20,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 6,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 24,
    },
    summaryCard: {
        borderRadius: 18,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    summaryLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        letterSpacing: 0.3,
    },
    chapterList: {
        gap: 12,
        marginBottom: 20,
    },
    chapterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        gap: 14,
    },
    chapterIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterInfo: {
        flex: 1,
    },
    chapterName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#EFEFEF',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabel: {
        fontSize: 11,
        fontWeight: '500',
    },
    statusIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F4',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        gap: 8,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: '#FF758C',
        fontWeight: '500',
    },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: '#FF758C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    applyBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.4,
    },
});

export default CertificatePage;
