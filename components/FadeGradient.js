import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

export const FadeGradientTop = (props) => {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.webGradientTop,
          props.style,
        ]}
      />
    );
  } else {
    const LinearGradient = require('react-native-linear-gradient').default;
    return (
      <LinearGradient
        colors={["rgba(24,24,24,0.08)", "rgba(24,24,24,0)"]}
        style={props.style}
        pointerEvents="none"
      />
    );
  }
};

export const FadeGradientBottom = (props) => {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.webGradientBottom,
          props.style,
        ]}
      />
    );
  } else {
    const LinearGradient = require('react-native-linear-gradient').default;
    return (
      <LinearGradient
        colors={["rgba(24,24,24,0)", "rgba(24,24,24,0.08)"]}
        style={props.style}
        pointerEvents="none"
      />
    );
  }
};

const styles = StyleSheet.create({
  webGradientTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 48,
    zIndex: 20,
    pointerEvents: 'none',
    backgroundImage: 'linear-gradient(to bottom, rgba(24,24,24,0.08) 0%, rgba(24,24,24,0) 100%)',
  },
  webGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
    zIndex: 20,
    pointerEvents: 'none',
    backgroundImage: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,0.08) 100%)',
  },
});

export default FadeGradientBottom; 