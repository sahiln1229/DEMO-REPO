import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const MENU_ITEMS = [
    { label: 'Dashboard', icon: 'grid', screen: 'AdminDashboard' },
    { label: 'Manage Users', icon: 'people', screen: 'AdminUsers' },
    { label: 'Manage Admins', icon: 'shield', screen: 'AdminAdmins' },
    { label: 'Manage Content', icon: 'document-text', screen: 'AdminContent' },
    { label: 'Reports', icon: 'bar-chart', screen: 'AdminReports' },
    { label: 'Certificates', icon: 'ribbon', screen: 'AdminCertificates' },
    { label: 'Settings', icon: 'settings', screen: 'AdminSettings' },
];

export default function AdminSidebar({ open, navigation, active, onClose }) {
    const slideAnim = useRef(new Animated.Value(open ? 0 : -240)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: open ? 0 : -240,
            useNativeDriver: true,
            tension: 80,
            friction: 12,
        }).start();
    }, [open]);

    const handleNav = (screen) => {
        if (!isWeb && onClose) onClose();
        navigation.navigate(screen);
    };

    return (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
            <LinearGradient colors={['#2D3561', '#1A1F4B']} style={styles.gradient}>
                {/* Logo area */}
                <View style={styles.logoArea}>
                    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.logoCircle}>
                        <Ionicons name="medical" size={24} color="#FFF" />
                    </LinearGradient>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.logoTitle}>MedAdmin</Text>
                        <Text style={styles.logoSub}>Super Admin Panel</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menu}>
                    {MENU_ITEMS.map((item) => {
                        const isActive = active === item.label || active === item.screen;
                        return (
                            <TouchableOpacity
                                key={item.screen}
                                style={[styles.menuItem, isActive && styles.menuItemActive]}
                                onPress={() => handleNav(item.screen)}
                                activeOpacity={0.75}
                            >
                                <View style={[styles.menuIconWrap, isActive && styles.menuIconActive]}>
                                    <Ionicons name={item.icon} size={18} color={isActive ? '#FFF' : 'rgba(255,255,255,0.55)'} />
                                </View>
                                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{item.label}</Text>
                                {isActive && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={18} color="#FF6B6B" style={{ marginRight: 10 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: isWeb ? 'fixed' : 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 240,
        zIndex: 100,
        height: isWeb ? '100%' : height,
    },
    gradient: { flex: 1, paddingTop: 20, paddingBottom: 24 },

    logoArea: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 18,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
        marginBottom: 8,
    },
    logoCircle: {
        width: 44, height: 44, borderRadius: 13,
        justifyContent: 'center', alignItems: 'center',
    },
    logoTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
    logoSub: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },

    menu: { flex: 1, paddingHorizontal: 12 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 11, paddingHorizontal: 12,
        borderRadius: 12, marginBottom: 4, position: 'relative',
    },
    menuItemActive: { backgroundColor: 'rgba(102,126,234,0.25)' },
    menuIconWrap: {
        width: 32, height: 32, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    menuIconActive: { backgroundColor: 'rgba(102,126,234,0.5)' },
    menuLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '500', flex: 1 },
    menuLabelActive: { color: '#FFF', fontWeight: '700' },
    activeIndicator: {
        width: 4, height: 18, borderRadius: 2,
        backgroundColor: '#667EEA', position: 'absolute', right: 0,
    },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 20, paddingVertical: 12,
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    },
    logoutText: { color: '#FF6B6B', fontWeight: '600', fontSize: 13 },
});
