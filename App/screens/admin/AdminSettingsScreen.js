import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

export default function AdminSettingsScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);
    const [settings, setSettings] = useState({
        emailNotifs: true,
        pushNotifs: true,
        certAutoApprove: false,
        maintenanceMode: false,
        darkMode: false,
        twoFactor: true,
    });

    const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const SETTING_GROUPS = [
        {
            title: '🔔 Notifications',
            items: [
                { key: 'emailNotifs', label: 'Email Notifications', sub: 'Send email alerts to admins', icon: 'mail', color: '#667EEA' },
                { key: 'pushNotifs', label: 'Push Notifications', sub: 'Send push alerts to users', icon: 'notifications', color: '#F953C6' },
            ],
        },
        {
            title: '🎓 Certificate Settings',
            items: [
                { key: 'certAutoApprove', label: 'Auto Approve Certificates', sub: 'Approve if score > 80%', icon: 'ribbon', color: '#43E97B' },
            ],
        },
        {
            title: '🔒 Security',
            items: [
                { key: 'twoFactor', label: 'Two-Factor Authentication', sub: 'Require OTP for admin login', icon: 'shield-checkmark', color: '#764BA2' },
            ],
        },
        {
            title: '⚙ System',
            items: [
                { key: 'maintenanceMode', label: 'Maintenance Mode', sub: 'Show maintenance page to users', icon: 'construct', color: '#FA8231' },
                { key: 'darkMode', label: 'Dark Mode', sub: 'Enable dark UI for all users', icon: 'moon', color: '#2D2D2D' },
            ],
        },
    ];

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Settings" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Settings" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Profile Card */}
                    <LinearGradient colors={['#2D3561', '#667EEA']} style={styles.profileCard}>
                        <LinearGradient colors={['#FA8231', '#F7B731']} style={styles.profileAvatar}>
                            <Text style={styles.profileAvatarText}>SA</Text>
                        </LinearGradient>
                        <View style={{ marginLeft: 16 }}>
                            <Text style={styles.profileName}>Super Admin</Text>
                            <Text style={styles.profileEmail}>superadmin@medcollege.edu</Text>
                            <View style={styles.profileBadge}>
                                <Ionicons name="crown" size={11} color="#FA8231" />
                                <Text style={styles.profileBadgeText}>Super Administrator</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Setting Groups */}
                    {SETTING_GROUPS.map((group, gi) => (
                        <View key={gi} style={styles.groupCard}>
                            <Text style={styles.groupTitle}>{group.title}</Text>
                            {group.items.map((item, ii) => (
                                <View key={item.key} style={[styles.settingRow, ii < group.items.length - 1 && styles.rowDivider]}>
                                    <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                                        <Ionicons name={item.icon} size={18} color={item.color} />
                                    </View>
                                    <View style={styles.settingInfo}>
                                        <Text style={styles.settingLabel}>{item.label}</Text>
                                        <Text style={styles.settingSub}>{item.sub}</Text>
                                    </View>
                                    <Switch
                                        value={settings[item.key]}
                                        onValueChange={() => toggle(item.key)}
                                        thumbColor={settings[item.key] ? item.color : '#ccc'}
                                        trackColor={{ false: '#eee', true: item.color + '40' }}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}

                    {/* Danger Zone */}
                    <View style={[styles.groupCard, { borderWidth: 1.5, borderColor: '#FF6B6B40' }]}>
                        <Text style={[styles.groupTitle, { color: '#FF6B6B' }]}>🚨 Danger Zone</Text>
                        {[
                            { label: 'Reset All Content', icon: 'refresh', sub: 'Remove all uploaded material' },
                            { label: 'Clear User Data', icon: 'trash', sub: 'Wipe all student progress' },
                            { label: 'Factory Reset Portal', icon: 'nuclear-outline', sub: 'Reset to default state' },
                        ].map((d, i) => (
                            <TouchableOpacity key={i} style={[styles.dangerRow, i < 2 && styles.rowDivider]} activeOpacity={0.7}>
                                <Ionicons name={d.icon} size={18} color="#FF6B6B" style={{ marginRight: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dangerLabel}>{d.label}</Text>
                                    <Text style={styles.settingSub}>{d.sub}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity activeOpacity={0.85} style={{ borderRadius: 16, overflow: 'hidden', marginTop: 8 }}>
                        <LinearGradient colors={['#43E97B', '#38F9D7']} style={styles.saveBtn}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.saveBtnText}>Save Settings</Text>
                        </LinearGradient>
                    </TouchableOpacity>

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

    profileCard: {
        borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center',
        marginBottom: 20,
        shadowcolor: '#2D2D2D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
    },
    profileAvatar: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    profileAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 22 },
    profileName: { color: '#FFF', fontWeight: 'bold', fontSize: 17, marginBottom: 3 },
    profileEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 6 },
    profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
    profileBadgeText: { color: '#FA8231', fontSize: 11, fontWeight: '700' },

    groupCard: {
        backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    groupTitle: { fontSize: 14, fontWeight: '700', color: '#2D2D2D', marginBottom: 12 },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F2FF' },
    settingIcon: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingInfo: { flex: 1 },
    settingLabel: { fontSize: 13, fontWeight: '600', color: '#2D2D2D', marginBottom: 2 },
    settingSub: { fontSize: 11, color: '#999' },

    dangerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    dangerLabel: { fontSize: 13, fontWeight: '600', color: '#FF6B6B', marginBottom: 2 },

    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});


