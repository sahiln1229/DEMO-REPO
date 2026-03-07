import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from './context/ThemeContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import CertificatePage from './screens/CertificatePage';
import CertificateDownloadPage from './screens/CertificateDownloadPage';
import ChapterGamesScreen from './screens/ChapterGamesScreen';
import GameScreen from './screens/GameScreen';
import GameResultScreen from './screens/GameResultScreen';

// Super Admin Screens
import SuperAdminDashboard from './screens/admin/SuperAdminDashboard';
import AdminUsersScreen from './screens/admin/AdminUsersScreen';
import AdminAdminsScreen from './screens/admin/AdminAdminsScreen';
import AdminContentScreen from './screens/admin/AdminContentScreen';
import AdminCertificatesScreen from './screens/admin/AdminCertificatesScreen';
import AdminReportsScreen from './screens/admin/AdminReportsScreen';
import AdminSettingsScreen from './screens/admin/AdminSettingsScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const { isDarkMode } = useTheme();



  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            animationTypeForReplace: 'fade',
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animationTypeForReplace: 'fade',
          }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
        <Stack.Screen
          name="Certificate"
          component={CertificatePage}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
        <Stack.Screen
          name="CertificateDownload"
          component={CertificateDownloadPage}
          options={{ animationTypeForReplace: 'push' }}
        />
        <Stack.Screen
          name="ChapterGames"
          component={ChapterGamesScreen}
          options={{ animationTypeForReplace: 'push' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ animationTypeForReplace: 'push' }}
        />
        <Stack.Screen
          name="GameResult"
          component={GameResultScreen}
          options={{ animationTypeForReplace: 'push' }}
        />
        {/* ─── Super Admin ─── */}
        <Stack.Screen name="AdminDashboard" component={SuperAdminDashboard} options={{ animationTypeForReplace: 'fade' }} />
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ animationTypeForReplace: 'push' }} />
        <Stack.Screen name="AdminAdmins" component={AdminAdminsScreen} options={{ animationTypeForReplace: 'push' }} />
        <Stack.Screen name="AdminContent" component={AdminContentScreen} options={{ animationTypeForReplace: 'push' }} />
        <Stack.Screen name="AdminCertificates" component={AdminCertificatesScreen} options={{ animationTypeForReplace: 'push' }} />
        <Stack.Screen name="AdminReports" component={AdminReportsScreen} options={{ animationTypeForReplace: 'push' }} />
        <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ animationTypeForReplace: 'push' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
