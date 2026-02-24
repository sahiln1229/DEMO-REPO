import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';


const HomeScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

  // Get username from navigation params, fallback to default
  const { username } = route.params || { username: 'Guest' };
  const [displayName, setDisplayName] = useState(username);
  const [profileImage, setProfileImage] = useState(null);
  const [staffPost, setStaffPost] = useState('Medical Staff');

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem('userProfile');
          if (savedProfile) {
            const data = JSON.parse(savedProfile);
            if (data.fullName) {
              setDisplayName(data.fullName);
            }
            if (data.image) {
              setProfileImage(data.image);
            }
            if (data.staffPost) {
              setStaffPost(data.staffPost);
            }
          }
        } catch (error) {
          console.log('Error loading profile', error);
        }
      };
      loadProfile();
    }, [])
  );

  // Responsive Layout Logic
  const getLayout = (width) => {
    if (width > 1200) return { numColumns: 4, padding: 40 }; // Desktop Large
    if (width > 900) return { numColumns: 3, padding: 30 };  // Desktop/Tablet Landscape
    return { numColumns: 2, padding: 20 };                  // Mobile/Tablet Portrait
  };

  const { numColumns, padding } = getLayout(width);
  const CARD_GAP = 16;
  const totalGap = (numColumns - 1) * CARD_GAP;
  const availableWidth = width - (padding * 2) - totalGap;
  const cardWidth = availableWidth / numColumns;


  const chapters = [
    {
      id: 1,
      iconName: 'trash', // Ionicons
      iconType: 'Ionicons',
      title: 'wasteDisposal',
      description: 'Proper disposal/segregation of...',
      games: 3,
      gradient: ['#FF512F', '#DD2476'],
      progress: 65,
      duration: '15 min',
    },
    {
      id: 2,
      iconName: 'water', // Ionicons
      iconType: 'Ionicons',
      title: 'bloodSpillage',
      description: 'Clean up procedures for blood',
      games: 3,
      gradient: ['#8E2DE2', '#4A00E0'],
      progress: 40,
      duration: '12 min',
    },
    {
      id: 3,
      iconName: 'flask', // Ionicons
      iconType: 'Ionicons',
      title: 'chemicalSpillage',
      description: 'Handling chemical spills safely',
      games: 3,
      gradient: ['#11998e', '#38ef7d'],
      progress: 80,
      duration: '10 min',
    },
    {
      id: 4,
      iconName: 'shield-alt', // FontAwesome5
      iconType: 'FontAwesome5',
      title: 'wearingPPE',
      description: 'Understanding PPE usage',
      games: 3,
      gradient: ['#4FACFE', '#00F2FE'],
      progress: 25,
      duration: '18 min',
    },

  ];

  const renderIcon = (type, name) => {
    // For web compatibility if icons are missing, or just standard icon rendering
    // Assuming vector icons are properly linked, otherwise need a fallback or image
    // For this environment, we'll try to use standard vector icons.
    // If they fail to load on web without linking, text fallback might be needed but per requirement we use icons.
    const size = 24;
    const color = '#FF7EB3'; // Default color for Hand Hygiene icon for example, but here icons are white in circle

    // The requirements say "Icon centered inside circle" and specific icons.
    // Hand Hygiene: Hand
    // PPE: Shield
    // Patient Care: Heart
    // Medical Waste: Trash Bin

    // Icon color in the circle should be determined by the card or just white/colored?
    // Reference image shows white icons on transparent background or colored icons on white background?
    // "White circular icon background at top. Icon centered inside circle" -> implied colored icon?
    // Re-reading: "White circular icon background at top... Icon centered inside circle"
    // Usually this means white circle, colored icon matching the gradient OR transparent circle white icon.
    // Looking at the snippet "White circular icon background at top" -> Circle is White.
    // Icon color? Usually the primary color of the card. Let's pick a color representing the card or just gray/theme.
    // Actually, looking at the user's reference instructions: "White circular icon background at top... Icon centered inside circle"
    // Let's assume the icon color matches the card theme or is a standard color.
    // Let's use the first color of the gradient for the icon color to make it pop.

    if (type === 'Ionicons') return <Ionicons name={name} size={size} color={color} />;
    if (type === 'FontAwesome5') return <FontAwesome5 name={name} size={size} color={color} />;
    if (type === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={name} size={size} color={color} />;
    return <Text>❓</Text>;
  };

  const handleLogout = () => {
    // Navigate back to Login screen and reset stack history so user can't go back
    navigation.replace('Login');
  };

  // Helper to get icon color based on gradient
  // const getIconColor = (gradient) => gradient[0]; // Unused currently

  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER SECTION */}
      <LinearGradient
        colors={theme.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={28} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>{t('welcome')}</Text>
              <Text style={styles.userNameText}>{displayName}</Text>
              <Text style={styles.userRoleText}>{staffPost}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT SECTION */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: padding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* STATS SECTION */}
        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconBg}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: theme.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Chapters</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <LinearGradient
              colors={['#FF7EB3', '#FF758C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconBg}
            >
              <MaterialCommunityIcons name="trophy" size={22} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: theme.text }]}>53%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Progress</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <LinearGradient
              colors={['#48C6EF', '#6F86D6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconBg}
            >
              <MaterialCommunityIcons name="gamepad-variant" size={22} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Games</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="person-outline" size={20} color="#4CAF50" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Progress')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#2196F3" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.card }]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="certificate" size={20} color="#FF9800" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.card }]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FCE4EC' }]}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color="#E91E63" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION TITLE */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('trainingChapters')}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>


        {/* CARDS GRID */}
        <View style={styles.gridContainer}>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={[
                styles.cardContainer,
                { width: cardWidth, height: cardWidth * 1.5, backgroundColor: theme.card } // Dynamic Width & Aspect Ratio
              ]}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={chapter.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                {/* Progress Badge */}
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{chapter.progress}%</Text>
                </View>

                {/* Icon Circle */}
                <View style={styles.iconCircle}>
                  {/* Render icon based on library */}
                  {chapter.iconType === 'Ionicons' && <Ionicons name={chapter.iconName} size={28} color={chapter.gradient[0]} />}
                  {chapter.iconType === 'FontAwesome5' && <FontAwesome5 name={chapter.iconName} size={24} color={chapter.gradient[0]} />}
                  {chapter.iconType === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={chapter.iconName} size={28} color={chapter.gradient[0]} />}
                </View>

                {/* Text Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{t(chapter.title.replace(/ /g, '').replace(/[^a-zA-Z]/g, '')) || chapter.title}</Text>
                  
                  {/* Duration and Games Info */}
                  <View style={styles.cardInfo}>
                    <View style={styles.cardInfoItem}>
                      <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.cardInfoText}>{chapter.duration}</Text>
                    </View>
                    <View style={styles.cardInfoItem}>
                      <MaterialCommunityIcons name="gamepad-variant" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.cardInfoText}>{chapter.games} {t('games')}</Text>
                    </View>
                  </View>
                </View>

                {/* Start Button */}
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>
                    {chapter.progress > 0 ? 'Continue' : 'Start'}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={chapter.gradient[0]} />
                </TouchableOpacity>

              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 3,
    borderColor: '#FFF',
    marginRight: 12,
  },
  profileImagePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    letterSpacing: 0.3,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  userRoleText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    marginBottom: 25,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 5,
    width: '100%',
    maxWidth: 1200,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    letterSpacing: 0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
    maxWidth: 1200,
  },
  cardContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    justifyContent: 'space-between',
  },
  progressBadge: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  progressBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  cardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardInfoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'stretch',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
