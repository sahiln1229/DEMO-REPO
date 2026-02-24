import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const lightTheme = {
    mode: 'light',
    background: '#F4F6FA',
    card: '#FFFFFF',
    text: '#2D2D2D',
    textSecondary: '#555555',
    primary: '#667EEA',
    headerGradient: ['#667EEA', '#764BA2'],
};

export const darkTheme = {
    mode: 'dark',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    primary: '#BB86FC', // Or keep same primary if it looks good, user said "Theme should apply to... Text -> White". 
    // User spec: 
    // Background -> #121212
    // Cards -> #1E1E1E
    // Text -> White
    headerGradient: ['#333333', '#111111'], // Maybe adjust header for dark mode? User didn't specify. Let's keep existing gradient or darken it.
    // Actually user said "Gradient background: #667EEA → #764BA2" in Profile specs.
    // In Dark Mode specs: "Entire app changes to dark theme instantly... Background -> #121212...".
    // Let's keep the header gradient as is for brand identity, or darken it slightly if needed.
    // Start with same gradient.
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(lightTheme);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme === 'dark') {
                setTheme(darkTheme);
                setIsDarkMode(true);
            }
        } catch (error) {
            console.log('Error loading theme', error);
        }
    };

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        const newTheme = newMode ? darkTheme : lightTheme;
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('appTheme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.log('Error saving theme', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
