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
      {React.isValidElement(label) ? (
        // Si el label es un View personalizado, no agregues márgenes
        label
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', height: '100%' }}>
          {icon && <View style={{ marginBottom: 8 }}>{icon}</View>}
          <Text style={getTextStyle()}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
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
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
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
}); 