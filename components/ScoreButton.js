import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function ScoreButton({
  label,
  onPress,
  icon,
  variant = 'primary', // 'primary', 'secondary', 'danger'
  style = {},
  disabled = false,
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant]];
    if (disabled) baseStyle.push(styles.disabled);
    return baseStyle;
  };

  const getTextStyle = () => {
    return [styles.text, styles[`${variant}Text`]];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={getTextStyle()}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  primary: {
    backgroundColor: 'rgba(132, 204, 22, 0.8)',
  },
  secondary: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dangerText: {
    color: '#ffffff',
  },
  iconContainer: {
    marginRight: 12,
  },
}); 