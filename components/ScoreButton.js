import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function ScoreButton({
  label,
  onPress,
  icon,
  variant = 'default', // 'default', 'danger', 'black', 'lime'
  style = {},
  disabled = false,
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant]];
    if (disabled) baseStyle.push(styles.disabled);
    return baseStyle;
  };

  const getTextStyle = () => {
    let styleArr = [styles.text, styles[`${variant}Text`]];
    if (variant === 'secondary') {
      styleArr.push({ color: '#fff' });
    }
    return styleArr;
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
    borderWidth: 2,
  },
  default: {
    backgroundColor: '#232323',
    borderColor: '#444',
  },
  danger: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  },
  black: {
    backgroundColor: '#181818',
    borderColor: '#111',
  },
  lime: {
    backgroundColor: '#181818',
    borderColor: '#bbff01',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  defaultText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
  blackText: {
    color: '#fff',
  },
  limeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconContainer: {
    marginRight: 8,
    marginBottom: 0,
  },
}); 