import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const isWeb = Platform.OS === 'web';

// Simple SVG-free bar chart using Views
const BAR_DATA = [
    { month: 'Sep', users: 80 },
    { month: 'Oct', users: 120 },
    { month: 'Nov', users: 95 },
    { month: 'Dec', users: 160 },
    { month: 'Jan', users: 210 },
    { month: 'Feb', users: 270 },
    { month: 'Mar', users: 320 },
];

const MaxUsers = Math.max(...BAR_DATA.map(d => d.users));

function BarChart() {
    return (
        <View style={chart.container}>
            <Text style={chart.chartTitle}>📈 User Growth (Last 7 Months)</Text>
            <View style={chart.chartArea}>
                {BAR_DATA.map((d, i) => {
                    const heightPct = (d.users / MaxUsers) * 100;
                    return (
                        <View key={i} style={chart.barCol}>
                            <Text style={chart.barValue}>{d.users}</Text>
                            <LinearGradient
                                colors={['#764BA2', '#667EEA']}
                                style={[chart.bar, { height: `${heightPct}%` }]}
                            />
                            <Text style={chart.barLabel}>{d.month}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

// Simple donut-style pie alternative using segmented bars
const PIE_DATA = [
    { label: 'Active Students', value: 68, color: '#43E97B' },
    { label: 'Inactive Students', value: 20, color: '#FF6B6B' },
    { label: 'Teachers', value: 12, color: '#667EEA' },
];

function PieChart() {
    return (
        <View style={pie.container}>
            <Text style={pie.title}>🥧 User Distribution</Text>
            <View style={pie.barTrack}>
                {PIE_DATA.map((d, i) => (
                    <View key={i} style={[pie.segment, { flex: d.value, backgroundColor: d.color }]} />
                ))}
            </View>
            <View style={pie.legend}>
                {PIE_DATA.map((d, i) => (
                    <View key={i} style={pie.legendItem}>
                        <View style={[pie.dot, { backgroundColor: d.color }]} />
                        <Text style={pie.legendText}>{d.label} ({d.value}%)</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const REPORT_ROWS = [
    { label: 'Total Registered Users', value: '1,284', icon: 'people', color: '#667EEA' },
    { label: 'Active This Month', value: '876', icon: 'pulse', color: '#43E97B' },
    { label: 'Certificates Issued', value: '412', icon: 'ribbon', color: '#FA8231' },
    { label: 'Avg. Course Completion Rate', value: '72%', icon: 'bar-chart', color: '#764BA2' },
    { label: 'New Registrations (Mar)', value: '52', icon: 'person-add', color: '#F953C6' },
    { label: 'Content Pieces Published', value: '342', icon: 'document-text', color: '#4ECDC4' },
];

export default function AdminReportsScreen({ navigation }) {
    const [sidebarOpen, setSidebarOpen] = useState(isWeb);

    return (
        <View style={styles.root}>
            <AdminSidebar open={sidebarOpen} navigation={navigation} active="Reports" onClose={() => setSidebarOpen(false)} />
            <View style={[styles.main, sidebarOpen && isWeb && styles.mainShifted]}>
                <AdminTopbar title="Reports & Analytics" onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

                    {/* Summary Metrics Grid */}
                    <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
                    <View style={styles.metricsGrid}>
                        {REPORT_ROWS.map((r, i) => (
                            <View key={i} style={styles.metricCard}>
                                <View style={[styles.metricIcon, { backgroundColor: r.color + '20' }]}>
                                    <Ionicons name={r.icon} size={20} color={r.color} />
                                </View>
                                <Text style={[styles.metricValue, { color: r.color }]}>{r.value}</Text>
                                <Text style={styles.metricLabel}>{r.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Bar Chart */}
                    <BarChart />

                    {/* Pie / Distribution */}
                    <PieChart />

                    {/* Download Button */}
                    <TouchableOpacity activeOpacity={0.85} style={styles.downloadWrap}>
                        <LinearGradient colors={['#2D3561', '#667EEA']} style={styles.downloadBtn}>
                            <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.downloadText}>Download Full Report (PDF)</Text>
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
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2D2D2D', marginBottom: 14 },

    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    metricCard: {
        backgroundColor: '#FFF', borderRadius: 16, padding: 16, minWidth: 140, flex: 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        alignItems: 'center',
    },
    metricIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    metricValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    metricLabel: { fontSize: 11, color: '#999', textAlign: 'center', fontWeight: '500', lineHeight: 16 },

    downloadWrap: { borderRadius: 16, overflow: 'hidden' },
    downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
    downloadText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

const chart = StyleSheet.create({
    container: {
        backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    chartTitle: { fontSize: 14, fontWeight: '700', color: '#2D2D2D', marginBottom: 16 },
    chartArea: { flexDirection: 'row', height: 160, alignItems: 'flex-end', gap: 8 },
    barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
    bar: { width: '80%', borderRadius: 6, minHeight: 8 },
    barValue: { fontSize: 9, color: '#667EEA', fontWeight: '700', marginBottom: 4 },
    barLabel: { fontSize: 10, color: '#999', marginTop: 4 },
});

const pie = StyleSheet.create({
    container: {
        backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    title: { fontSize: 14, fontWeight: '700', color: '#2D2D2D', marginBottom: 16 },
    barTrack: { flexDirection: 'row', height: 28, borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
    segment: {},
    legend: { gap: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    legendText: { fontSize: 13, color: '#333', fontWeight: '500' },
});


