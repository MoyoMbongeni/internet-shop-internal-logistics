import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const SkeletonCard: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.topRow}>
        <View style={[styles.bone, { width: 100, height: 10 }]} />
        <View style={[styles.bone, { width: 70, height: 18, borderRadius: 6 }]} />
      </View>
      <View style={[styles.bone, { width: '60%', height: 14, marginBottom: 8 }]} />
      <View style={styles.metaRow}>
        <View style={[styles.bone, { width: 120, height: 10 }]} />
        <View style={[styles.bone, { width: 55, height: 18, borderRadius: 5 }]} />
      </View>
      <View style={[styles.bone, { width: '75%', height: 10, marginTop: 6 }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 9,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  bone: {
    backgroundColor: '#E8E7E2',
    borderRadius: 4,
  },
});
