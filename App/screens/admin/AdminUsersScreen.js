import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

const SAMPLE_USERS = [
    { id: 1, name: 'Anita Sharma', email: 'anita@college.edu', role: 'Student', status: 'Active' },
    { id: 2, name: 'Rohit Verma', email: 'rohit@college.edu', role: 'Student', status: 'Active' },
    { id: 3, name: 'Priya Singh', email: 'priya@college.edu', role: 'Student', status: 'Inactive' },
    { id: 4, name: 'Karan Mehta', email: 'karan@college.edu', role: 'Teacher', status: 'Active' },
    { id: 5, name: 'Deepika Gupta', email: 'deepika@college.edu', role: 'Student', status: 'Active' },
    { id: 6, name: 'Sameer Khan', email: 'sameer@college.edu', role: 'Student', status: 'Inactive' },
    { id: 7, name: 'Nisha Patel', email: 'nisha@college.edu', role: 'Teacher', status: 'Active' },
    { id: 8, name: 'Vikram Joshi', email: 'vikram@college.edu', role: 'Student', status: 'Active' },
];

export default function AdminUsersScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(SAMPLE_USERS);
    const [showModal, setShowModal] = useState(false);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = (id) => {
        setUsers(prev => prev.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
        ));
    };

    const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Manage Users" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Manage Users" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <View style={styles.searchWrap}>
                            <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search users..."
                                placeholderTextColor="#999"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
                            <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.addGradient}>
                                <Ionicons name="add" size={20} color="#FFF" />
                                <Text style={styles.addText}>Add User</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        {[
                            { label: 'Total', value: users.length, color: '#667EEA' },
                            { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: '#43E97B' },
                            { label: 'Inactive', value: users.filter(u => u.status === 'Inactive').length, color: '#FA8231' },
                        ].map((s, i) => (
                            <View key={i} style={[styles.statCard, { borderLeftColor: s.color }]}>
                                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Table */}
                    <View style={styles.tableCard}>
                        {/* Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.col, styles.colId, styles.headerCell]}>ID</Text>
                            <Text style={[styles.col, styles.colName, styles.headerCell]}>Name</Text>
                            <Text style={[styles.col, styles.colEmail, styles.headerCell]}>Email</Text>
                            <Text style={[styles.col, styles.colRole, styles.headerCell]}>Role</Text>
                            <Text style={[styles.col, styles.colStatus, styles.headerCell]}>Status</Text>
                            <Text style={[styles.col, styles.colAction, styles.headerCell]}>Actions</Text>
                        </View>

                        {filtered.map((user, idx) => (
                            <View key={user.id} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                                <Text style={[styles.col, styles.colId, styles.cellText]}>#{user.id}</Text>
                                <Text style={[styles.col, styles.colName, styles.cellText]}>{user.name}</Text>
                                <Text style={[styles.col, styles.colEmail, styles.cellText, { color: '#667EEA' }]}>{user.email}</Text>
                                <View style={[styles.col, styles.colRole]}>
                                    <View style={[styles.roleBadge, { backgroundColor: user.role === 'Teacher' ? '#667EEA20' : '#43E97B20' }]}>
                                        <Text style={[styles.roleText, { color: user.role === 'Teacher' ? '#667EEA' : '#2ECC71' }]}>{user.role}</Text>
                                    </View>
                                </View>
                                <View style={[styles.col, styles.colStatus]}>
                                    <View style={[styles.statusBadge, { backgroundColor: user.status === 'Active' ? '#43E97B20' : '#FF6B6B20' }]}>
                                        <View style={[styles.statusDot, { backgroundColor: user.status === 'Active' ? '#43E97B' : '#FF6B6B' }]} />
                                        <Text style={[styles.statusText, { color: user.status === 'Active' ? '#2ECC71' : '#FF6B6B' }]}>{user.status}</Text>
                                    </View>
                                </View>
                                <View style={[styles.col, styles.colAction, { flexDirection: 'row', gap: 6 }]}>
                                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#667EEA20' }]} activeOpacity={0.7}>
                                        <Ionicons name="pencil" size={14} color="#667EEA" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStatus(user.id)} style={[styles.actionBtn, { backgroundColor: '#FA823120' }]} activeOpacity={0.7}>
                                        <Ionicons name={user.status === 'Active' ? 'ban' : 'checkmark'} size={14} color="#FA8231" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteUser(user.id)} style={[styles.actionBtn, { backgroundColor: '#FF6B6B20' }]} activeOpacity={0.7}>
                                        <Ionicons name="trash" size={14} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
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

    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    searchWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    },
    searchInput: { flex: 1, fontSize: 14, color: '#333', paddingVertical: 10, outlineStyle: 'none' },
    addBtn: { borderRadius: 12, overflow: 'hidden' },
    addGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
    addText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statCard: {
        flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 14,
        borderLeftWidth: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    },
    statValue: { fontSize: 24, fontWeight: 'bold' },
    statLabel: { fontSize: 12, color: '#999', marginTop: 2 },

    tableCard: {
        backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    tableHeader: { backgroundcolor: '#2D2D2D' },
    tableRowAlt: { backgroundColor: '#F8F9FF' },
    headerCell: { color: '#FFF', fontWeight: '700', fontSize: 12 },
    col: { paddingHorizontal: 4 },
    colId: { width: 36 },
    colName: { flex: 1.2 },
    colEmail: { flex: 1.8 },
    colRole: { width: 80 },
    colStatus: { width: 90 },
    colAction: { width: 100 },
    cellText: { fontSize: 13, color: '#333' },

    roleBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
    roleText: { fontSize: 11, fontWeight: '700' },
    statusBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
    statusText: { fontSize: 11, fontWeight: '700' },
    actionBtn: { width: 28, height: 28, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
});


