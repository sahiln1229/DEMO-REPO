import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CertificateDownloadPage = ({ navigation }) => {
    const { theme } = useTheme();

    // Entrance animation for the trophy badge
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleDownload = () => {
        // In a real app, trigger a PDF/share flow here.
        Alert.alert(
            'Download Certificate',
            'Your certificate will be downloaded shortly!',
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── GRADIENT HEADER ── */}
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
                <Text style={styles.headerTitle}>Certificate</Text>
            </LinearGradient>

            {/* ── MAIN CONTENT ── */}
            <View style={styles.content}>
                {/* Animated trophy badge */}
                <Animated.View style={[styles.trophyContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.trophyCircle}
                    >
                        <MaterialCommunityIcons name="trophy" size={60} color="#FFF" />
                    </LinearGradient>
                </Animated.View>

                {/* Stars decoration */}
                <Animated.View style={[styles.starsRow, { opacity: fadeAnim }]}>
                    {['★', '★', '★', '★', '★'].map((s, i) => (
                        <Text key={i} style={styles.star}>
                            {s}
                        </Text>
                    ))}
                </Animated.View>

                {/* Success text */}
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <Text style={[styles.congratsText, { color: theme.text }]}>Congratulations! 🎉</Text>
                    <Text style={[styles.readyText, { color: theme.text }]}>Your certificate is ready</Text>
                    <Text style={[styles.subText, { color: theme.textSecondary }]}>
                        You have successfully completed all training chapters. Your Medical Safety certificate
                        is ready to download.
                    </Text>
                </Animated.View>

                {/* ── CERTIFICATE CARD ── */}
                <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
                    <LinearGradient
                        colors={['#FFF8F0', '#FFF0F8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.certCard}
                    >
                        <View style={styles.certCardHeader}>
                            <MaterialCommunityIcons name="certificate" size={28} color="#FF758C" />
                            <Text style={styles.certCardTitle}>Medical Safety Certificate</Text>
                        </View>
                        <View style={styles.certCardDivider} />
                        <View style={styles.certCardRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={styles.certCardText}>Waste Disposal – Completed</Text>
                        </View>
                        <View style={styles.certCardRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={styles.certCardText}>Blood Spillage – Completed</Text>
                        </View>
                        <View style={styles.certCardRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={styles.certCardText}>Chemical Spillage – Completed</Text>
                        </View>
                        <View style={styles.certCardRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={styles.certCardText}>Wearing PPE – Completed</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* ── DOWNLOAD BUTTON ── */}
                <Animated.View style={{ opacity: fadeAnim, width: '100%', marginTop: 24 }}>
                    <TouchableOpacity activeOpacity={0.85} onPress={handleDownload}>
                        <LinearGradient
                            colors={['#FF7EB3', '#FF758C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.downloadBtn}
                        >
                            <Ionicons name="download-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.downloadBtnText}>Download Certificate</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Ionicons name="home-outline" size={18} color="#FF758C" style={{ marginRight: 6 }} />
                        <Text style={styles.homeBtnText}>Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 58 : 48,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    // Trophy
    trophyContainer: {
        marginBottom: 16,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    trophyCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 16,
    },
    star: {
        fontSize: 20,
        color: '#FFD700',
    },
    // Text
    congratsText: {
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 0.4,
        textAlign: 'center',
        marginBottom: 6,
    },
    readyText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    // Certificate card
    certCard: {
        borderRadius: 18,
        padding: 18,
        shadowColor: '#FF758C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    certCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    certCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF758C',
    },
    certCardDivider: {
        height: 1,
        backgroundColor: '#FFD6E5',
        marginBottom: 12,
    },
    certCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    certCardText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    // Download button
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: '#FF758C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    downloadBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.4,
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#FF7EB3',
    },
    homeBtnText: {
        color: '#FF758C',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default CertificateDownloadPage;
