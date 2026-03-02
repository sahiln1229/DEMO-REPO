import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminTopbar({ title, onMenuPress }) {
    return (
        <LinearGradient colors={['#FFFFFF', '#F8F9FF']} style={styles.bar}>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn} activeOpacity={0.7}>
                <Ionicons name="menu" size={24} color="#2D3561" />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <View style={styles.rightArea}>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                    <Ionicons name="notifications-outline" size={22} color="#2D3561" />
                    <View style={styles.notifDot} />
                </TouchableOpacity>
                <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.avatar}>
                    <Text style={styles.avatarText}>SA</Text>
                </LinearGradient>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#EAEEFF',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    },
    menuBtn: { padding: 4, marginRight: 12 },
    title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#2D3561' },
    rightArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBtn: { position: 'relative', padding: 4 },
    notifDot: {
        position: 'absolute', top: 2, right: 2,
        width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B6B',
        borderWidth: 1, borderColor: '#FFF',
    },
    avatar: {
        width: 36, height: 36, borderRadius: 10,
        justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
