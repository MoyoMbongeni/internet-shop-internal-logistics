import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  visible: boolean;
  isOffline: boolean;
  lastSynced: string | null;
  onDismiss: () => void;
}

const formatLastSynced = (iso: string | null): string => {
  if (!iso) return 'Henüz senkronize edilmedi';
  const d = new Date(iso);
  return `Son güncelleme: ${d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}, ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
};

export const OfflineSnackbar: React.FC<Props> = ({
  visible,
  isOffline,
  lastSynced,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [visible]);

  const iconColor = isOffline ? Colors.snackbarOffline : Colors.snackbarOnline;
  const title = isOffline ? 'Çevrimdışı' : 'Senkronize edildi';
  const icon = isOffline ? '⚠' : '✓';

  return (
    <Animated.View
      style={[styles.snackbar, { transform: [{ translateY }] }]}
      // pointerEvents: when hidden (translateY=100), prevent invisible view blocking touches
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{formatLastSynced(lastSynced)}</Text>
      </View>

      {/* Close button — large hit area so it's easy to tap */}
      <Pressable
        onPress={onDismiss}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Kapat"
        accessibilityRole="button"
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
    backgroundColor: Colors.snackbarBg,
    borderWidth: 0.5,
    borderColor: Colors.snackbarBorder,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 999,
    elevation: 8,          // Android shadow so it clearly floats above content
  },
  icon: {
    fontSize: 16,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.snackbarText,
  },
  sub: {
    fontSize: 11,
    color: Colors.snackbarSub,
    marginTop: 1,
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '400',
  },
});
