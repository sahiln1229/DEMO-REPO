import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './Navigation';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import './i18n/i18n'; // Init i18n

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent />
      <ThemeProvider>
        <LanguageProvider>
          <ProgressProvider>
            <Navigation />
          </ProgressProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
