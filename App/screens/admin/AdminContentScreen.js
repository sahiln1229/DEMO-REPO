import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

const CONTENT_DATA = [
    { id: 1, title: 'Human Anatomy – Chapter 1', category: 'Anatomy', date: '01 Mar 2026', status: 'Published' },
    { id: 2, title: 'Pharmacology Basics', category: 'Pharmacology', date: '28 Feb 2026', status: 'Published' },
    { id: 3, title: 'Cardiology Case Studies', category: 'Cardiology', date: '25 Feb 2026', status: 'Hidden' },
    { id: 4, title: 'Pathology Lab Reports – Unit 2', category: 'Pathology', date: '20 Feb 2026', status: 'Published' },
    { id: 5, title: 'Neuroscience Fundamentals', category: 'Neurology', date: '15 Feb 2026', status: 'Draft' },
    { id: 6, title: 'Surgical Techniques Overview', category: 'Surgery', date: '10 Feb 2026', status: 'Published' },
];

const STATUS_COLORS = {
    Published: { bg: '#43E97B20', text: '#2ECC71' },
    Hidden: { bg: '#FA823120', text: '#FA8231' },
    Draft: { bg: '#99999920', text: '#666' },
};

const CAT_COLORS = ['#667EEA', '#F953C6', '#43E97B', '#FA8231', '#764BA2', '#4ECDC4'];

export default function AdminContentScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const [content, setContent] = useState(CONTENT_DATA);
    const [filter, setFilter] = useState('All');

    const filters = ['All', 'Published', 'Hidden', 'Draft'];
    const filtered = filter === 'All' ? content : content.filter(c => c.status === filter);

    const toggleStatus = (id) => {
        setContent(prev => prev.map(c => {
            if (c.id !== id) return c;
            const cycle = { Published: 'Hidden', Hidden: 'Published', Draft: 'Published' };
            return { ...c, status: cycle[c.status] };
        }));
    };

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Manage Content" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Manage Content" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Header */}
                    <View style={styles.topRow}>
                        <Text style={styles.sectionTitle}>📄 Content Library</Text>
                        <TouchableOpacity activeOpacity={0.85}>
                            <LinearGradient colors={['#43E97B', '#38F9D7']} style={styles.addBtn}>
                                <Ionicons name="add" size={18} color="#FFF" />
                                <Text style={styles.addText}>Add Content</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Filter Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                        {filters.map(f => (
                            <TouchableOpacity
                                key={f} onPress={() => setFilter(f)} activeOpacity={0.8}
                                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            >
                                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Content Cards */}
                    {filtered.map((item, idx) => (
                        <View key={item.id} style={styles.contentCard}>
                            <View style={[styles.catStrip, { backgroundColor: CAT_COLORS[idx % CAT_COLORS.length] }]} />
                            <View style={styles.cardBody}>
                                <View style={styles.cardTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.contentTitle}>{item.title}</Text>
                                        <View style={styles.metaRow}>
                                            <View style={[styles.catBadge, { backgroundColor: CAT_COLORS[idx % CAT_COLORS.length] + '20' }]}>
                                                <Text style={[styles.catText, { color: CAT_COLORS[idx % CAT_COLORS.length] }]}>{item.category}</Text>
                                            </View>
                                            <Ionicons name="calendar-outline" size={12} color="#999" style={{ marginHorizontal: 6 }} />
                                            <Text style={styles.dateText}>{item.date}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status].bg }]}>
                                        <Text style={[styles.statusText, { color: STATUS_COLORS[item.status].text }]}>{item.status}</Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.cardActions}>
                                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#667EEA20' }]} activeOpacity={0.7}>
                                        <Ionicons name="pencil" size={14} color="#667EEA" />
                                        <Text style={[styles.actionText, { color: '#667EEA' }]}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStatus(item.id)} style={[styles.actionBtn, { backgroundColor: '#FA823120' }]} activeOpacity={0.7}>
                                        <Ionicons name={item.status === 'Published' ? 'eye-off' : 'eye'} size={14} color="#FA8231" />
                                        <Text style={[styles.actionText, { color: '#FA8231' }]}>{item.status === 'Published' ? 'Hide' : 'Publish'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF6B6B20' }]} activeOpacity={0.7}>
                                        <Ionicons name="trash" size={14} color="#FF6B6B" />
                                        <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, flexDirection: 'row', backgroundColor: '#F4F6FA' },
    main: { flex: 1 },
    mainShifted: { marginLeft: isWeb ? 240 : 0 },
    scroll: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },

    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2D2D2D' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
    addText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 8, borderWidth: 1.5, borderColor: '#EAEEFF' },
    filterChipActive: { backgroundcolor: '#2D2D2D', bordercolor: '#2D2D2D' },
    filterText: { fontSize: 13, fontWeight: '600', color: '#999' },
    filterTextActive: { color: '#FFF' },

    contentCard: {
        backgroundColor: '#FFF', borderRadius: 16, marginBottom: 14, flexDirection: 'row',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        overflow: 'hidden',
    },
    catStrip: { width: 5 },
    cardBody: { flex: 1, padding: 14 },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    contentTitle: { fontSize: 14, fontWeight: '700', color: '#2D2D2D', marginBottom: 8, lineHeight: 20 },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    catBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    catText: { fontSize: 11, fontWeight: '700' },
    dateText: { fontSize: 11, color: '#999' },
    statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginLeft: 10 },
    statusText: { fontSize: 11, fontWeight: '700' },
    cardActions: { flexDirection: 'row', gap: 8 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    actionText: { fontSize: 12, fontWeight: '600' },
});


