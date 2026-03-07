import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'chapterProgress_v1';

// ─── Default state ────────────────────────────────────────────────────────────
const defaultChapters = [
    { id: 1, name: 'Waste Disposal', gamesCompleted: [false, false, false], completed: false },
    { id: 2, name: 'Blood Spillage', gamesCompleted: [false, false, false], completed: false },
    { id: 3, name: 'Chemical Spillage', gamesCompleted: [false, false, false], completed: false },
    { id: 4, name: 'Wearing PPE', gamesCompleted: [false, false, false], completed: false },
];

// ─── Context ──────────────────────────────────────────────────────────────────
export const ProgressContext = createContext({
    chapters: defaultChapters,
    markGameComplete: () => { },
    resetChapter: () => { },
    allChaptersComplete: () => false,
    getChapterProgress: () => 0,
});

export const ProgressProvider = ({ children }) => {
    const [chapters, setChapters] = useState(defaultChapters);

    // Load persisted progress on mount
    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) setChapters(JSON.parse(raw));
            } catch (_) { }
        };
        load();
    }, []);

    // Persist every time chapters change
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chapters)).catch(() => { });
    }, [chapters]);

    // Mark a specific game (1-indexed) inside a chapter as complete
    const markGameComplete = (chapterId, gameNumber) => {
        setChapters((prev) =>
            prev.map((ch) => {
                if (ch.id !== chapterId) return ch;
                const updated = [...ch.gamesCompleted];
                updated[gameNumber - 1] = true;
                const allDone = updated.every(Boolean);
                return { ...ch, gamesCompleted: updated, completed: allDone };
            })
        );
    };

    // Reset a chapter's progress
    const resetChapter = (chapterId) => {
        setChapters((prev) =>
            prev.map((ch) =>
                ch.id === chapterId
                    ? { ...ch, gamesCompleted: [false, false, false], completed: false }
                    : ch
            )
        );
    };

    // Returns true if ALL 4 chapters are completed
    const allChaptersComplete = () => chapters.every((ch) => ch.completed);

    // Returns a 0-100 progress value for a chapter
    const getChapterProgress = (chapterId) => {
        const ch = chapters.find((c) => c.id === chapterId);
        if (!ch) return 0;
        const done = ch.gamesCompleted.filter(Boolean).length;
        return Math.round((done / ch.gamesCompleted.length) * 100);
    };

    return (
        <ProgressContext.Provider
            value={{ chapters, markGameComplete, resetChapter, allChaptersComplete, getChapterProgress }}
        >
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);
