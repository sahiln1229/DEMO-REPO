import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();

    const [loading, setLoading] = useState(true);

    // Profile Data States
    const [image, setImage] = useState(null);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [staffPost, setStaffPost] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male'); // Default
    const [memberSince] = useState('January 2024'); // Could be loaded from AsyncStorage

    // Settings States (managed by Context now)
    const [notifications, setNotifications] = useState(true);

    // Calculate profile completion
    const profileCompletion = useMemo(() => {
        let completion = 0;
        if (image) completion += 20;
        if (fullName.trim()) completion += 20;
        if (address.trim()) completion += 20;
        if (staffPost.trim()) completion += 20;
        if (age.trim()) completion += 10;
        if (gender) completion += 10;
        return completion;
    }, [image, fullName, address, staffPost, age, gender]);


    // Load Data on Mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('userProfile');
            if (savedProfile) {
                const data = JSON.parse(savedProfile);
                setImage(data.image);
                setFullName(data.fullName || '');
                setAddress(data.address || '');
                setStaffPost(data.staffPost || '');
                setAge(data.age || '');
                setGender(data.gender || 'Male');
                // Theme and Language are loaded by their contexts
                setNotifications(data.notifications !== undefined ? data.notifications : true);
            }

        } catch (error) {
            console.error('Failed to load profile', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Validation Check', 'Please enter your full name.');
            return;
        }

        const profileData = {
            image,
            fullName,
            address,
            staffPost,
            age,
            age,
            gender,
            // darkMode: persisted in ThemeContext
            notifications,
            // language: persisted in LanguageContext
        };


        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
            // Navigate back or stay? User requirement: "After saving, updated information should reflect immediately in Home screen"
            // Usually users expect to stay or go back. Let's suggest going back in the alert or just notify.
        } catch (error) {
            console.error('Failed to save profile', error);
            Alert.alert('Error', 'Failed to save changes.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => {
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#667EEA" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* HEADER SECTION */}
                <LinearGradient
                    colors={theme.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >

                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('myProfile')}</Text>
                        <View style={{ width: 40 }} />

                    </View>
                </LinearGradient>

                {/* PROFILE PICTURE SECTION */}
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#667EEA', '#764BA2', '#F093FB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.avatarGradientBorder}
                        >
                            <View style={styles.avatarContainer}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                                        <Ionicons name="person" size={60} color="#CCCCCC" />
                                    </View>
                                )}
                                <LinearGradient
                                    colors={['#667EEA', '#764BA2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.editIconContainer}
                                >
                                    <Ionicons name="camera" size={18} color="#FFF" />
                                </LinearGradient>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    {/* User Name Display */}
                    <Text style={[styles.profileName, { color: theme.text }]}>
                        {fullName || 'Complete Your Profile'}
                    </Text>
                    <Text style={[styles.profileRole, { color: theme.textSecondary }]}>
                        {staffPost || 'Medical Staff'}
                    </Text>
                    
                    {/* Profile Completion Badge */}
                    <View style={[styles.completionBadge, { backgroundColor: theme.card }]}>
                        <MaterialCommunityIcons name="chart-donut" size={16} color={theme.primary} />
                        <Text style={[styles.completionText, { color: theme.text }]}>
                            {profileCompletion}% Complete
                        </Text>
                    </View>
                </View>

                {/* QUICK STATS SECTION */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                        <LinearGradient
                            colors={['#667EEA', '#764BA2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statIconContainer}
                        >
                            <MaterialCommunityIcons name="calendar-check" size={20} color="#FFF" />
                        </LinearGradient>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Member Since</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>{memberSince}</Text>
                    </View>
                    
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                        <LinearGradient
                            colors={['#FF7EB3', '#FF758C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statIconContainer}
                        >
                            <MaterialCommunityIcons name="shield-check" size={20} color="#FFF" />
                        </LinearGradient>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Account</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>Verified</Text>
                    </View>
                    
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                        <LinearGradient
                            colors={['#48C6EF', '#6F86D6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statIconContainer}
                        >
                            <MaterialCommunityIcons name="star" size={20} color="#FFF" />
                        </LinearGradient>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Status</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>Active</Text>
                    </View>
                </View>

                {/* USER INFORMATION FORM */}
                <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
                    <View style={styles.sectionTitleContainer}>
                        <MaterialCommunityIcons name="account-edit" size={22} color={theme.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('userInformation')}</Text>
                    </View>

                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            {t('fullNamePlaceholder')}
                        </Text>
                        <View style={[styles.inputWithIcon, { backgroundColor: isDarkMode ? theme.background : '#F8F9FA', borderColor: theme.background }]}>
                            <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder={t('fullNamePlaceholder')}
                                placeholderTextColor={theme.textSecondary}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>


                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('address')}</Text>
                        <View style={[styles.inputWithIcon, styles.textAreaContainer, { backgroundColor: isDarkMode ? theme.background : '#F8F9FA', borderColor: theme.background, alignItems: 'flex-start' }]}>
                            <Ionicons name="location-outline" size={20} color={theme.textSecondary} style={[styles.inputIcon, { marginTop: 12 }]} />
                            <TextInput
                                style={[styles.input, styles.textArea, { color: theme.text }]}
                                placeholder={t('address')}
                                placeholderTextColor={theme.textSecondary}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                            />
                        </View>
                    </View>


                    {/* Staff Post */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('staffPost')}</Text>
                        <View style={[styles.inputWithIcon, { backgroundColor: isDarkMode ? theme.background : '#F8F9FA', borderColor: theme.background }]}>
                            <MaterialCommunityIcons name="badge-account" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="e.g. Senior Nurse"
                                placeholderTextColor={theme.textSecondary}
                                value={staffPost}
                                onChangeText={setStaffPost}
                            />
                        </View>
                    </View>


                    {/* Age & Gender Row */}
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('age')}</Text>
                            <View style={[styles.inputWithIcon, { backgroundColor: isDarkMode ? theme.background : '#F8F9FA', borderColor: theme.background }]}>
                                <MaterialCommunityIcons name="calendar" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="25"
                                    placeholderTextColor={theme.textSecondary}
                                    value={age}
                                    onChangeText={setAge}
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('gender')}</Text>
                            <View style={[styles.genderContainer, { backgroundColor: isDarkMode ? theme.background : '#F8F9FA', borderColor: theme.background }]}>
                                {['Male', 'Female'].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[
                                            styles.genderButton,
                                            gender === g && { backgroundColor: theme.primary }
                                        ]}
                                        onPress={() => setGender(g)}
                                    >
                                        <Ionicons 
                                            name={g === 'Male' ? 'male' : 'female'} 
                                            size={16} 
                                            color={gender === g ? '#FFF' : theme.textSecondary}
                                            style={{ marginRight: 4 }}
                                        />
                                        <Text style={[
                                            styles.genderText,
                                            { color: gender === g ? '#FFF' : theme.text }
                                        ]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>


                {/* APP SETTINGS SECTION */}
                <View style={[styles.sectionContainer, { backgroundColor: theme.card }]}>
                    <View style={styles.sectionTitleContainer}>
                        <MaterialCommunityIcons name="cog" size={22} color={theme.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('appSettings')}</Text>
                    </View>

                    {/* Dark Mode */}
                    <View style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#F0F0F0' }]}>
                        <View style={styles.settingLabelContainer}>
                            <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#1A1A2E' : '#FFF5E6' }]}>
                                <Ionicons name={isDarkMode ? "moon" : "moon-outline"} size={20} color={isDarkMode ? '#FFD700' : '#FF9500'} />
                            </View>
                            <View>
                                <Text style={[styles.settingText, { color: theme.text }]}>{t('darkMode')}</Text>
                                <Text style={[styles.settingSubtext, { color: theme.textSecondary }]}>
                                    {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#764BA2" }}
                            thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
                            onValueChange={toggleTheme}
                            value={isDarkMode}
                            ios_backgroundColor="#E0E0E0"
                        />
                    </View>


                    {/* Notifications */}
                    <View style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#F0F0F0' }]}>
                        <View style={styles.settingLabelContainer}>
                            <View style={[styles.settingIconWrapper, { backgroundColor: notifications ? '#E8F5E9' : '#FFF3E0' }]}>
                                <Ionicons name={notifications ? "notifications" : "notifications-outline"} size={20} color={notifications ? '#4CAF50' : '#FF9800'} />
                            </View>
                            <View>
                                <Text style={[styles.settingText, { color: theme.text }]}>{t('notifications')}</Text>
                                <Text style={[styles.settingSubtext, { color: theme.textSecondary }]}>
                                    {notifications ? 'Notifications enabled' : 'Notifications disabled'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#764BA2" }}
                            thumbColor={notifications ? "#FFF" : "#f4f3f4"}
                            onValueChange={() => setNotifications(!notifications)}
                            value={notifications}
                            ios_backgroundColor="#E0E0E0"
                        />
                    </View>


                    {/* Language */}
                    <TouchableOpacity 
                        style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#F0F0F0' }]}
                        onPress={() => {
                            Alert.alert('Select Language', 'Choose your preferred language', [
                                { text: 'English', onPress: () => changeLanguage('en') },
                                { text: 'Hindi (हिंदी)', onPress: () => changeLanguage('hi') },
                                { text: 'Marathi (मराठी)', onPress: () => changeLanguage('mr') },
                                { text: 'Cancel', style: 'cancel' }
                            ]);
                        }}
                    >
                        <View style={styles.settingLabelContainer}>
                            <View style={[styles.settingIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                                <MaterialIcons name="language" size={20} color="#2196F3" />
                            </View>
                            <View>
                                <Text style={[styles.settingText, { color: theme.text }]}>{t('language')}</Text>
                                <Text style={[styles.settingSubtext, { color: theme.textSecondary }]}>
                                    {language === 'en' ? 'English' : language === 'hi' ? 'Hindi (हिंदी)' : 'Marathi (मराठी)'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    {/* Change Password */}
                    <TouchableOpacity 
                        style={[styles.settingRow, { borderBottomWidth: 0 }]}
                        onPress={() => Alert.alert('Change Password', 'This feature will be available soon')}
                    >
                        <View style={styles.settingLabelContainer}>
                            <View style={[styles.settingIconWrapper, { backgroundColor: '#FCE4EC' }]}>
                                <MaterialCommunityIcons name="lock-reset" size={20} color="#E91E63" />
                            </View>
                            <View>
                                <Text style={[styles.settingText, { color: theme.text }]}>{t('changePassword')}</Text>
                                <Text style={[styles.settingSubtext, { color: theme.textSecondary }]}>
                                    Update your password
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                </View>

                {/* SAVE BUTTON */}
                <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSave}>
                    <LinearGradient
                        colors={theme.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButton}
                    >
                        <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* LOGOUT BUTTON */}
                <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
                    <View style={[styles.logoutButton, { borderColor: '#FF6B6B' }]}>
                        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </View>
                </TouchableOpacity>


            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 50,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: -45,
        marginBottom: 25,
    },
    avatarGradientBorder: {
        borderRadius: 70,
        padding: 4,
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 5,
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    placeholderAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        letterSpacing: 0.3,
    },
    profileRole: {
        fontSize: 15,
        marginTop: 4,
        fontWeight: '500',
    },
    completionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    completionText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 2,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#2D2D2D',
        marginLeft: 10,
        letterSpacing: 0.3,
    },
    inputGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
        letterSpacing: 0.2,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderWidth: 1.5,
        borderColor: '#EEE',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 10,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 4,
        borderWidth: 1.5,
        borderColor: '#EEE',
    },
    genderButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    genderText: {
        fontSize: 14,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    settingSubtext: {
        fontSize: 12,
        marginTop: 2,
        color: '#888',
    },
    saveButtonContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },
    logoutButtonContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 16,
    },
    logoutButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FF6B6B',
        backgroundColor: 'transparent',
        gap: 8,
    },
    logoutButtonText: {
        color: '#FF6B6B',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default ProfileScreen;
