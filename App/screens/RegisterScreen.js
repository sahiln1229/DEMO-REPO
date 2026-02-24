import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';


const RegisterScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [identifierType, setIdentifierType] = useState('email'); // 'email' | 'phone'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '#E0E0E0' };
    if (pwd.length < 6) return { strength: 1, label: 'Weak', color: '#FF6B6B' };
    if (pwd.length < 10) return { strength: 2, label: 'Medium', color: '#FFA500' };
    return { strength: 3, label: 'Strong', color: '#4CAF50' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!identifier.trim()) {
      newErrors.identifier = identifierType === 'email' ? 'Email is required' : 'Phone number is required';
    } else if (identifierType === 'email' && !validateEmail(identifier)) {
      newErrors.identifier = 'Invalid email format';
    } else if (identifierType === 'phone' && identifier.length < 10) {
      newErrors.identifier = 'Phone number must be at least 10 digits';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      // console.log('Register:', { fullName, identifierType, identifier, password, confirmPassword });
      // Proceed with registration
      navigation.navigate('Home', { username: fullName });
    }
  };

  return (
    <LinearGradient
      colors={theme.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { backgroundColor: theme.card }]}>

            {/* Icon Circle with Gradient */}
            <LinearGradient
              colors={['#FF7EB3', '#FF758C']}
              style={styles.iconCircle}
            >
              <MaterialCommunityIcons name="account-plus" size={45} color="#FFF" />
            </LinearGradient>

            {/* Title */}
            <Text style={[styles.title, { color: theme.text }]}>{t('registerTitle')}</Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('registerSubtitle')}</Text>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              {/* Full Name Input */}
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: theme.background, 
                  borderColor: focusedInput === 'fullName' ? theme.primary : errors.fullName ? '#FF6B6B' : theme.background 
                }
              ]}>
                <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={t('fullNamePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

              {/* Toggle Email/Phone */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={() => setIdentifierType('email')}
                  style={[
                    styles.toggleButton,
                    identifierType === 'email' && { backgroundColor: theme.primary }
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="mail-outline" 
                    size={18} 
                    color={identifierType === 'email' ? '#FFF' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.toggleText,
                    { color: identifierType === 'email' ? '#FFF' : theme.text }
                  ]}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIdentifierType('phone')}
                  style={[
                    styles.toggleButton,
                    identifierType === 'phone' && { backgroundColor: theme.primary }
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="call-outline" 
                    size={18} 
                    color={identifierType === 'phone' ? '#FFF' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.toggleText,
                    { color: identifierType === 'phone' ? '#FFF' : theme.text }
                  ]}>Phone</Text>
                </TouchableOpacity>
              </View>

              {/* Email/Phone Input */}
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: theme.background, 
                  borderColor: focusedInput === 'identifier' ? theme.primary : errors.identifier ? '#FF6B6B' : theme.background 
                }
              ]}>
                <Ionicons 
                  name={identifierType === 'email' ? 'mail-outline' : 'call-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={identifierType === 'email' ? t('emailPlaceholder') : 'Phone Number'}
                  placeholderTextColor={theme.textSecondary}
                  value={identifier}
                  onChangeText={(text) => {
                    setIdentifier(identifierType === 'phone' ? text.replace(/[^0-9]/g, '') : text);
                    if (errors.identifier) setErrors({ ...errors, identifier: '' });
                  }}
                  onFocus={() => setFocusedInput('identifier')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType={identifierType === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                />
              </View>
              {errors.identifier && <Text style={styles.errorText}>{errors.identifier}</Text>}

              {/* Password Input */}
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: theme.background, 
                  borderColor: focusedInput === 'password' ? theme.primary : errors.password ? '#FF6B6B' : theme.background 
                }
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={t('passwordPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          { backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : '#E0E0E0' }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: theme.background, 
                  borderColor: focusedInput === 'confirmPassword' ? theme.primary : errors.confirmPassword ? '#FF6B6B' : theme.background 
                }
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showConfirm ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Register Button */}
            <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer}>
              <LinearGradient
                colors={theme.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('registerButton')}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                {t('loginLink').split('?')[0]}?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.linkHighlight, { color: theme.primary }]}>{t('loginButton')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#FF7EB3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#F7F7F7',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7EB3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  linkHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
