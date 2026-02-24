import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';


const { width } = Dimensions.get('window');

const ProgressScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const chapters = [

        {
            id: 1,
            name: 'Hand Hygiene',
            color: '#FF7EB3',
            icon: 'hand-left-outline', // Ionicons
            progress: 75,
            gamesCompleted: 2,
            totalGames: 3,
            lastAccessed: '2 days ago',
        },
        {
            id: 2,
            name: 'Personal Protective Equipment',
            color: '#4FACFE',
            icon: 'shield-checkmark-outline', // Ionicons
            progress: 50,
            gamesCompleted: 1,
            totalGames: 3,
            lastAccessed: '5 days ago',
        },
        {
            id: 3,
            name: 'Biomedical Waste Management',
            color: '#43C6AC',
            icon: 'trash-outline', // Ionicons
            progress: 100,
            gamesCompleted: 3,
            totalGames: 3,
            lastAccessed: '1 week ago',
        },
        {
            id: 4,
            name: 'Spill Management',
            color: '#F48C06',
            icon: 'water-outline', // Ionicons
            progress: 25,
            gamesCompleted: 0,
            totalGames: 3,
            lastAccessed: 'Not started',
        },
    ];

    const getChapterKey = (id) => {
        switch (id) {
            case 1: return 'handHygiene';
            case 2: return 'ppe';
            case 3: return 'biomedicalWaste';
            case 4: return 'spillManagement';
            default: return '';
        }
    };

    // Calculate overall progress
    const overallProgress = Math.round(
        chapters.reduce((sum, chapter) => sum + chapter.progress, 0) / chapters.length
    );

    const totalGamesCompleted = chapters.reduce((sum, chapter) => sum + chapter.gamesCompleted, 0);
    const totalGames = chapters.reduce((sum, chapter) => sum + chapter.totalGames, 0);
    const completedChapters = chapters.filter(chapter => chapter.progress === 100).length;


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            {/* HEADER SECTION */}
            <LinearGradient
                colors={theme.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >

                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('myProgress')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* OVERALL PROGRESS CARD */}
                <View style={[styles.overallCard, { backgroundColor: theme.card }]}>
                    <View style={styles.overallHeader}>
                        <Text style={[styles.overallTitle, { color: theme.text }]}>{t('overallProgress')}</Text>
                        <View style={styles.trendBadge}>
                            <MaterialCommunityIcons name="trending-up" size={14} color="#4CAF50" />
                            <Text style={styles.trendText}>+12%</Text>
                        </View>
                    </View>


                    {/* Center Progress Circle */}
                    <View style={styles.progressCircleContainer}>
                        <LinearGradient
                            colors={['#667EEA', '#764BA2']}
                            style={styles.progressCircle}
                        >
                            <Text style={styles.progressText}>{overallProgress}%</Text>
                            <Text style={styles.progressSubtext}>Complete</Text>
                        </LinearGradient>
                    </View>

                    {/* Bottom Stats Section */}
                    <View style={styles.statsContainer}>
                        {/* Chapters Stats */}
                        <View style={styles.statItem}>
                            <LinearGradient
                                colors={['#FF7EB3', '#FF758C']}
                                style={styles.statIconGradient}
                            >
                                <FontAwesome5 name="book" size={16} color="#FFF" />
                            </LinearGradient>
                            <View style={styles.statTextContainer}>
                                <Text style={[styles.statValue, { color: theme.text }]}>{completedChapters}/{chapters.length}</Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('chapters')}</Text>
                            </View>
                        </View>

                        {/* Vertical Divider */}
                        <View style={[styles.verticalDivider, { backgroundColor: theme.background }]} />

                        {/* Games Stats */}
                        <View style={styles.statItem}>
                            <LinearGradient
                                colors={['#43C6AC', '#38ef7d']}
                                style={styles.statIconGradient}
                            >
                                <Ionicons name="game-controller" size={18} color="#FFF" />
                            </LinearGradient>
                            <View style={styles.statTextContainer}>
                                <Text style={[styles.statValue, { color: theme.text }]}>{totalGamesCompleted}/{totalGames}</Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('games')}</Text>
                            </View>
                        </View>

                        {/* Vertical Divider */}
                        <View style={[styles.verticalDivider, { backgroundColor: theme.background }]} />

                        {/* Time Stats */}
                        <View style={styles.statItem}>
                            <LinearGradient
                                colors={['#4FACFE', '#00F2FE']}
                                style={styles.statIconGradient}
                            >
                                <MaterialCommunityIcons name="clock-outline" size={18} color="#FFF" />
                            </LinearGradient>
                            <View style={styles.statTextContainer}>
                                <Text style={[styles.statValue, { color: theme.text }]}>2.5h</Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Time</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ACHIEVEMENTS SECTION */}
                <View style={styles.achievementsSection}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionTitleContainer}>
                            <MaterialCommunityIcons name="trophy" size={22} color={theme.primary} />
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
                        </View>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
                        <View style={[styles.achievementCard, { backgroundColor: theme.card }]}>
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                style={styles.achievementIcon}
                            >
                                <MaterialCommunityIcons name="star" size={24} color="#FFF" />
                            </LinearGradient>
                            <Text style={[styles.achievementTitle, { color: theme.text }]}>First Steps</Text>
                            <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>Complete 1 chapter</Text>
                        </View>

                        <View style={[styles.achievementCard, { backgroundColor: theme.card }]}>
                            <LinearGradient
                                colors={['#FF7EB3', '#FF758C']}
                                style={styles.achievementIcon}
                            >
                                <MaterialCommunityIcons name="fire" size={24} color="#FFF" />
                            </LinearGradient>
                            <Text style={[styles.achievementTitle, { color: theme.text }]}>On Fire</Text>
                            <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>3 days streak</Text>
                        </View>

                        <View style={[styles.achievementCard, { backgroundColor: theme.card, opacity: 0.5 }]}>
                            <View style={[styles.achievementIconLocked, { backgroundColor: '#E0E0E0' }]}>
                                <MaterialCommunityIcons name="lock" size={24} color="#999" />
                            </View>
                            <Text style={[styles.achievementTitle, { color: theme.textSecondary }]}>Master</Text>
                            <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>Complete all</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* CHAPTER PROGRESS SECTION */}
                <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionTitleContainer}>
                        <MaterialCommunityIcons name="book-open-variant" size={22} color={theme.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('chapterProgress')}</Text>
                    </View>
                </View>


                {/* Chapter Cards */}
                {chapters.map((chapter) => (
                    <TouchableOpacity 
                        key={chapter.id} 
                        style={[styles.chapterCard, { backgroundColor: theme.card }]}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[chapter.color, chapter.color + 'CC']}
                            style={styles.chapterIconCircle}
                        >
                            <Ionicons name={chapter.icon} size={26} color="#FFF" />
                        </LinearGradient>

                        <View style={styles.chapterInfo}>
                            <View style={styles.chapterTitleRow}>
                                <Text style={[styles.chapterName, { color: theme.text }]} numberOfLines={1}>
                                    {t(getChapterKey(chapter.id)) || chapter.name}
                                </Text>
                                {chapter.progress === 100 && (
                                    <View style={styles.completedBadge}>
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    </View>
                                )}
                            </View>

                            <View style={styles.chapterMetaRow}>
                                <View style={styles.chapterMeta}>
                                    <MaterialCommunityIcons name="gamepad-variant" size={14} color={theme.textSecondary} />
                                    <Text style={[styles.chapterMetaText, { color: theme.textSecondary }]}>
                                        {chapter.gamesCompleted}/{chapter.totalGames} games
                                    </Text>
                                </View>
                                <Text style={[styles.lastAccessed, { color: theme.textSecondary }]}>
                                    {chapter.lastAccessed}
                                </Text>
                            </View>

                            <View style={styles.progressBarWrapper}>
                                <View style={styles.progressBarContainer}>
                                    <LinearGradient
                                        colors={[chapter.color, chapter.color + 'DD']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.progressBarFill, { width: `${chapter.progress}%` }]}
                                    />
                                </View>
                                <Text style={[styles.progressPercentage, { color: chapter.color }]}>{chapter.progress}%</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6FA',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        marginBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        letterSpacing: 0.5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    overallCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 25,
        marginTop: -20,
    },
    overallHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        width: '100%',
    },
    overallTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D2D2D',
        letterSpacing: 0.3,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    trendText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    progressCircleContainer: {
        alignSelf: 'center',
        marginBottom: 28,
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    progressCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 44,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
    progressSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    statIconGradient: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    statTextContainer: {
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D2D2D',
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
        fontWeight: '500',
    },
    verticalDivider: {
        width: 1,
        height: '70%',
        backgroundColor: '#EEEEEE',
        marginHorizontal: 8,
    },
    achievementsSection: {
        marginBottom: 25,
    },
    sectionHeaderRow: {
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 0.3,
    },
    achievementsScroll: {
        marginBottom: 10,
    },
    achievementCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    achievementIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    achievementIconLocked: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    achievementTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    achievementDesc: {
        fontSize: 10,
        color: '#888',
        textAlign: 'center',
    },
    chapterCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    chapterIconCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    chapterInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chapterTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    chapterName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2D2D2D',
        flex: 1,
        letterSpacing: 0.2,
    },
    completedBadge: {
        marginLeft: 8,
    },
    chapterMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    chapterMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    chapterMetaText: {
        fontSize: 11,
        color: '#888',
        fontWeight: '500',
    },
    lastAccessed: {
        fontSize: 10,
        color: '#999',
        fontStyle: 'italic',
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 13,
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'right',
    },
});

export default ProgressScreen;
