import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    Animated, Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const STATS = [
    { label: 'Total Users', value: '1,284', icon: 'people', colors: ['#667EEA', '#764BA2'], change: '+12%' },
    { label: 'Total Admins', value: '18', icon: 'shield-checkmark', colors: ['#F953C6', '#B91D73'], change: '+2%' },
    { label: 'Total Content', value: '342', icon: 'document-text', colors: ['#43E97B', '#38F9D7'], change: '+8%' },
    { label: 'Pending Certificates', value: '27', icon: 'ribbon', colors: ['#FA8231', '#F7B731'], change: '-3%' },
];

const RECENT_ACTIVITY = [
    { id: 1, icon: 'person-add', color: '#667EEA', text: 'New user registered', time: '2 min ago' },
    { id: 2, icon: 'checkmark-circle', color: '#43E97B', text: 'Certificate approved for Riya', time: '15 min ago' },
    { id: 3, icon: 'document', color: '#FA8231', text: 'New content uploaded', time: '1 hr ago' },
    { id: 4, icon: 'close-circle', color: '#F953C6', text: 'Admin Mohit deactivated', time: '3 hr ago' },
    { id: 5, icon: 'ribbon', color: '#764BA2', text: 'Certificate request by Ankit', time: '5 hr ago' },
];

export default function SuperAdminDashboard({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Dashboard" onClose={() => setSidebarOpen(false)} />

            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Dashboard" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        {/* Welcome Banner */}
                        <LinearGradient colors={['#667EEA', '#764BA2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.welcomeBanner}>
                            <View>
                                <Text style={styles.welcomeText}>👑 Welcome, Super Admin</Text>
                                <Text style={styles.dateText}>{dateStr}</Text>
                                <Text style={styles.timeText}>{timeStr}</Text>
                            </View>
                            <MaterialCommunityIcons name="crown" size={64} color="rgba(255,255,255,0.25)" />
                        </LinearGradient>

                        {/* Stats Cards */}
                        <Text style={styles.sectionTitle}>📊 Overview</Text>
                        <View style={styles.cardsRow}>
                            {STATS.map((s, i) => (
                                <Animated.View key={i} style={[styles.cardWrap, { opacity: fadeAnim }]}>
                                    <LinearGradient colors={s.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                                        <View style={styles.cardTop}>
                                            <Ionicons name={s.icon} size={28} color="#FFF" />
                                            <View style={[styles.changeBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                                                <Text style={styles.changeText}>{s.change}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.cardValue}>{s.value}</Text>
                                        <Text style={styles.cardLabel}>{s.label}</Text>
                                    </LinearGradient>
                                </Animated.View>
                            ))}
                        </View>

                        {/* Quick Actions */}
                        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
                        <View style={styles.quickRow}>
                            {[
                                { label: 'Manage Users', icon: 'people', screen: 'AdminUsers', color: '#667EEA' },
                                { label: 'Manage Admins', icon: 'shield', screen: 'AdminAdmins', color: '#F953C6' },
                                { label: 'Content', icon: 'document-text', screen: 'AdminContent', color: '#43E97B' },
                                { label: 'Certificates', icon: 'ribbon', screen: 'AdminCertificates', color: '#FA8231' },
                                { label: 'Reports', icon: 'bar-chart', screen: 'AdminReports', color: '#764BA2' },
                                { label: 'Settings', icon: 'settings', screen: 'AdminSettings', color: '#4ECDC4' },
                            ].map((q, i) => (
                                <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => navigation.navigate(q.screen)} activeOpacity={0.8}>
                                    <View style={[styles.quickIcon, { backgroundColor: q.color + '20' }]}>
                                        <Ionicons name={q.icon} size={22} color={q.color} />
                                    </View>
                                    <Text style={styles.quickLabel}>{q.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Recent Activity */}
                        <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>
                        <View style={styles.activityCard}>
                            {RECENT_ACTIVITY.map((a) => (
                                <View key={a.id} style={styles.activityRow}>
                                    <View style={[styles.activityIcon, { backgroundColor: a.color + '20' }]}>
                                        <Ionicons name={a.icon} size={18} color={a.color} />
                                    </View>
                                    <View style={styles.activityInfo}>
                                        <Text style={styles.activityText}>{a.text}</Text>
                                        <Text style={styles.activityTime}>{a.time}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                    </Animated.View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, flexDirection: 'row', backgroundColor: '#F0F2FF' },
    main: { flex: 1 },
    mainShifted: { marginLeft: isWeb ? 240 : 0 },
    scroll: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    welcomeBanner: {
        borderRadius: 20, padding: 24, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#667EEA', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
    },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
    dateText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
    timeText: { fontSize: 20, fontWeight: '700', color: '#FFF' },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2D3561', marginBottom: 14, marginTop: 4 },

    cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
    cardWrap: { flex: 1, minWidth: 140 },
    card: {
        borderRadius: 18, padding: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18, shadowRadius: 12, elevation: 8,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    changeBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    changeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    cardValue: { fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

    quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    quickBtn: {
        alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16,
        padding: 16, minWidth: 90, flex: 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    },
    quickIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickLabel: { fontSize: 12, fontWeight: '600', color: '#2D3561', textAlign: 'center' },

    activityCard: {
        backgroundColor: '#FFF', borderRadius: 20, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    activityIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    activityInfo: { flex: 1 },
    activityText: { fontSize: 13, fontWeight: '600', color: '#2D3561' },
    activityTime: { fontSize: 11, color: '#999', marginTop: 2 },
});
