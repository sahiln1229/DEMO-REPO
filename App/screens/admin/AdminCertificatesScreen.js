import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

const CERTS = [
    { id: 1, name: 'Anita Sharma', course: 'Human Anatomy', date: '28 Feb 2026', score: '92%', status: 'Pending' },
    { id: 2, name: 'Rohit Verma', course: 'Pharmacology', date: '26 Feb 2026', score: '88%', status: 'Pending' },
    { id: 3, name: 'Priya Singh', course: 'Cardiology', date: '20 Feb 2026', score: '95%', status: 'Approved' },
    { id: 4, name: 'Karan Mehta', course: 'Pathology', date: '15 Feb 2026', score: '78%', status: 'Rejected' },
    { id: 5, name: 'Deepika Gupta', course: 'Neuroscience', date: '10 Feb 2026', score: '85%', status: 'Pending' },
    { id: 6, name: 'Sameer Khan', course: 'Surgical Techniques', date: '05 Feb 2026', score: '90%', status: 'Approved' },
];

const STATUS_INFO = {
    Pending: { bg: '#FA823120', text: '#FA8231', icon: 'time-outline' },
    Approved: { bg: '#43E97B20', text: '#2ECC71', icon: 'checkmark-circle' },
    Rejected: { bg: '#FF6B6B20', text: '#FF6B6B', icon: 'close-circle-outline' },
};

export default function AdminCertificatesScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const [certs, setCerts] = useState(CERTS);
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? certs : certs.filter(c => c.status === filter);

    const updateStatus = (id, status) => {
        setCerts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    };

    const pending = certs.filter(c => c.status === 'Pending').length;
    const approved = certs.filter(c => c.status === 'Approved').length;

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Certificates" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Certificate Approvals" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        {[
                            { label: 'Pending', value: pending, colors: ['#FA8231', '#F7B731'] },
                            { label: 'Approved', value: approved, colors: ['#43E97B', '#38F9D7'] },
                            { label: 'Total', value: certs.length, colors: ['#667EEA', '#764BA2'] },
                        ].map((s, i) => (
                            <LinearGradient key={i} colors={s.colors} style={styles.statCard}>
                                <Text style={styles.statValue}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </LinearGradient>
                        ))}
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.tabsRow}>
                        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.tab, filter === f && styles.tabActive]} activeOpacity={0.8}>
                                <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Certificate Cards */}
                    {filtered.map((cert) => {
                        const si = STATUS_INFO[cert.status];
                        return (
                            <View key={cert.id} style={styles.certCard}>
                                <View style={styles.certHeader}>
                                    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.certAvatar}>
                                        <Text style={styles.certAvatarText}>{cert.name.charAt(0)}</Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.certName}>{cert.name}</Text>
                                        <Text style={styles.certCourse}>📚 {cert.course}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: si.bg }]}>
                                        <Ionicons name={si.icon} size={13} color={si.text} style={{ marginRight: 4 }} />
                                        <Text style={[styles.statusText, { color: si.text }]}>{cert.status}</Text>
                                    </View>
                                </View>

                                <View style={styles.certMeta}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="calendar-outline" size={13} color="#999" />
                                        <Text style={styles.metaText}>{cert.date}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="trophy-outline" size={13} color="#999" />
                                        <Text style={styles.metaText}>Score: {cert.score}</Text>
                                    </View>
                                </View>

                                {cert.status === 'Pending' && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, { backgroundColor: '#43E97B' }]}
                                            onPress={() => updateStatus(cert.id, 'Approved')}
                                            activeOpacity={0.85}
                                        >
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                            <Text style={styles.actionBtnText}>Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]}
                                            onPress={() => updateStatus(cert.id, 'Rejected')}
                                            activeOpacity={0.85}
                                        >
                                            <Ionicons name="close" size={16} color="#FFF" />
                                            <Text style={styles.actionBtnText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })}
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
    content: { padding: 20, paddingBottom: 40 },

    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: {
        flex: 1, borderRadius: 16, padding: 16, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
    },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: '600' },

    tabsRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 4, marginBottom: 16, gap: 4 },
    tab: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
    tabActive: { backgroundColor: '#2D3561' },
    tabText: { fontSize: 12, fontWeight: '600', color: '#999' },
    tabTextActive: { color: '#FFF' },

    certCard: {
        backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    certHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    certAvatar: { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    certAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    certName: { fontSize: 15, fontWeight: '700', color: '#2D3561', marginBottom: 4 },
    certCourse: { fontSize: 12, color: '#667EEA', fontWeight: '600' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
    statusText: { fontSize: 11, fontWeight: '700' },

    certMeta: { flexDirection: 'row', gap: 16, marginBottom: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EAEEFF' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, color: '#999' },

    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
    actionBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
