import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ─── MCQ Question Component ───────────────────────────────────────────────────
// Props:
//   question  : { question, options, answer, explanation }
//   onAnswer  : (isCorrect: boolean) => void   called after the option tap + animation
const MCQQuestion = ({ question, onAnswer }) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);

    const handleSelect = (index) => {
        if (locked) return;
        setSelected(index);
        setLocked(true);
        const correct = index === question.answer;
        setTimeout(() => onAnswer(correct), 900);
    };

    const getBorderColor = (index) => {
        if (selected === null) return theme.card;
        if (index === question.answer) return '#4CAF50';
        if (index === selected) return '#F44336';
        return theme.card;
    };

    const getBackground = (index) => {
        if (selected === null) return theme.card;
        if (index === question.answer) return '#E8F5E9';
        if (index === selected) return '#FFEBEE';
        return theme.card;
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.questionText, { color: theme.text }]}>{question.question}</Text>

            {question.options.map((opt, i) => (
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    style={[
                        styles.option,
                        {
                            backgroundColor: getBackground(i),
                            borderColor: getBorderColor(i),
                        },
                    ]}
                    onPress={() => handleSelect(i)}
                >
                    <View style={[styles.optionBullet, { backgroundColor: getBorderColor(i) }]}>
                        <Text style={styles.optionBulletText}>{String.fromCharCode(65 + i)}</Text>
                    </View>
                    <Text style={[styles.optionText, { color: theme.text }]}>{opt}</Text>
                    {selected !== null && i === question.answer && (
                        <Text style={styles.feedbackIcon}>✅</Text>
                    )}
                    {selected === i && i !== question.answer && (
                        <Text style={styles.feedbackIcon}>❌</Text>
                    )}
                </TouchableOpacity>
            ))}

            {selected !== null && (
                <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>💡 {question.explanation}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 4 },
    questionText: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 20,
        lineHeight: 26,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 2,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    optionBullet: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionBulletText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    optionText: { flex: 1, fontSize: 15, fontWeight: '500' },
    feedbackIcon: { fontSize: 20, marginLeft: 8 },
    explanationBox: {
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    explanationText: { fontSize: 13, color: '#6D4C41', lineHeight: 20, fontWeight: '500' },
});

export default MCQQuestion;
