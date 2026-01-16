// components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Colors from '../../constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`]];
    
    if (size === 'small') baseStyle.push(styles.smallButton);
    if (size === 'large') baseStyle.push(styles.largeButton);
    if (disabled) baseStyle.push(styles.disabledButton);
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${variant}Text`]];
    if (size === 'small') baseStyle.push(styles.smallText);
    if (size === 'large') baseStyle.push(styles.largeText);
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: '#00C853',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1A73E8',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#1A73E8',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;
