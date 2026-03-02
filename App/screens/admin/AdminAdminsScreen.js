import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

const ADMINS_DATA = [
    { id: 1, name: 'Dr. Rajeev Kumar', email: 'rajeev@college.edu', dept: 'Academic', status: true, perms: { users: true, content: true, certs: true } },
    { id: 2, name: 'Ms. Sunita Mehra', email: 'sunita@college.edu', dept: 'Operations', status: true, perms: { users: true, content: false, certs: false } },
    { id: 3, name: 'Mr. Arun Verma', email: 'arun@college.edu', dept: 'Finance', status: false, perms: { users: false, content: false, certs: true } },
    { id: 4, name: 'Dr. Preeti Sharma', email: 'preeti@college.edu', dept: 'Academic', status: true, perms: { users: false, content: true, certs: true } },
];

export default function AdminAdminsScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const [admins, setAdmins] = useState(ADMINS_DATA);
    const [expanded, setExpanded] = useState(null);

    const togglePerm = (id, perm) => {
        setAdmins(prev => prev.map(a =>
            a.id === id ? { ...a, perms: { ...a.perms, [perm]: !a.perms[perm] } } : a
        ));
    };
    const toggleStatus = (id) => {
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: !a.status } : a));
    };

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Manage Admins" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Manage Admins" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Add Admin button */}
                    <View style={styles.topRow}>
                        <Text style={styles.sectionTitle}>🛠 Admin Accounts ({admins.length})</Text>
                        <TouchableOpacity activeOpacity={0.85}>
                            <LinearGradient colors={['#F953C6', '#B91D73']} style={styles.addBtn}>
                                <Ionicons name="add" size={18} color="#FFF" />
                                <Text style={styles.addText}>Add Admin</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {admins.map((admin) => (
                        <View key={admin.id} style={styles.adminCard}>
                            <TouchableOpacity
                                style={styles.adminCardHeader}
                                onPress={() => setExpanded(expanded === admin.id ? null : admin.id)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={admin.status ? ['#F953C6', '#B91D73'] : ['#999', '#666']} style={styles.adminAvatar}>
                                    <Text style={styles.adminAvatarText}>{admin.name.charAt(0)}</Text>
                                </LinearGradient>
                                <View style={styles.adminInfo}>
                                    <Text style={styles.adminName}>{admin.name}</Text>
                                    <Text style={styles.adminEmail}>{admin.email}</Text>
                                    <View style={[styles.deptBadge, { backgroundColor: '#F953C620' }]}>
                                        <Text style={styles.deptText}>{admin.dept}</Text>
                                    </View>
                                </View>
                                <View style={styles.adminRight}>
                                    <Switch
                                        value={admin.status}
                                        onValueChange={() => toggleStatus(admin.id)}
                                        thumbColor={admin.status ? '#F953C6' : '#ccc'}
                                        trackColor={{ false: '#eee', true: '#F953C640' }}
                                    />
                                    <Ionicons
                                        name={expanded === admin.id ? 'chevron-up' : 'chevron-down'}
                                        size={18} color="#999" style={{ marginTop: 6 }}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* Permissions Panel */}
                            {expanded === admin.id && (
                                <View style={styles.permsPanel}>
                                    <Text style={styles.permsTitle}>🔐 Permissions</Text>
                                    {[
                                        { key: 'users', label: 'Manage Users', icon: 'people' },
                                        { key: 'content', label: 'Manage Content', icon: 'document-text' },
                                        { key: 'certs', label: 'Certificates', icon: 'ribbon' },
                                    ].map((p) => (
                                        <View key={p.key} style={styles.permRow}>
                                            <Ionicons name={p.icon} size={16} color="#667EEA" style={{ marginRight: 10 }} />
                                            <Text style={styles.permLabel}>{p.label}</Text>
                                            <Switch
                                                value={admin.perms[p.key]}
                                                onValueChange={() => togglePerm(admin.id, p.key)}
                                                thumbColor={admin.perms[p.key] ? '#667EEA' : '#ccc'}
                                                trackColor={{ false: '#eee', true: '#667EEA40' }}
                                            />
                                        </View>
                                    ))}
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#667EEA20' }]} activeOpacity={0.7}>
                                            <Ionicons name="pencil" size={14} color="#667EEA" />
                                            <Text style={[styles.iconBtnText, { color: '#667EEA' }]}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#FF6B6B20' }]} activeOpacity={0.7}>
                                            <Ionicons name="trash" size={14} color="#FF6B6B" />
                                            <Text style={[styles.iconBtnText, { color: '#FF6B6B' }]}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
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

    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2D3561' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
    addText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

    adminCard: {
        backgroundColor: '#FFF', borderRadius: 16, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        overflow: 'hidden',
    },
    adminCardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    adminAvatar: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    adminAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    adminInfo: { flex: 1 },
    adminName: { fontSize: 15, fontWeight: '700', color: '#2D3561', marginBottom: 2 },
    adminEmail: { fontSize: 12, color: '#999', marginBottom: 6 },
    deptBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
    deptText: { color: '#F953C6', fontSize: 11, fontWeight: '700' },
    adminRight: { alignItems: 'center' },

    permsPanel: { backgroundColor: '#F8F9FF', borderTopWidth: 1, borderTopColor: '#EAEEFF', padding: 16 },
    permsTitle: { fontSize: 13, fontWeight: '700', color: '#2D3561', marginBottom: 12 },
    permRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EAEEFF' },
    permLabel: { flex: 1, fontSize: 13, color: '#333', fontWeight: '500' },

    cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
    iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    iconBtnText: { fontSize: 13, fontWeight: '600' },
});
