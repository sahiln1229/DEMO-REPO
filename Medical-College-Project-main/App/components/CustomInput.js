import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  placeholder,
  leftIcon,
  rightIcon,
  isPassword = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
      ]}
    >
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={20}
          color={isFocused ? '#FF6B9D' : '#999'}
          style={styles.leftIcon}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={isPassword && !showPassword}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {isPassword ? (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.rightIcon}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color={isFocused ? '#FF6B9D' : '#999'}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <Icon
          name={rightIcon}
          size={20}
          color={isFocused ? '#FF6B9D' : '#999'}
          style={styles.rightIcon}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginVertical: 10,
    height: 56,
    borderWidth: 2,
    borderColor: '#F7F7F7',
  },
  containerFocused: {
    borderColor: '#FF6B9D',
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  rightIcon: {
    marginLeft: 12,
  },
});

export default CustomInput;
