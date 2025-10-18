import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCart } from '@/context/CartContext';
// Import Lucide icons
import { Home, ShoppingCart, User } from 'lucide-react-native';

interface TabBarItemProps {
  icon: 'home' | 'cart' | 'profile';
  label: string;
  isActive: boolean;
  onPress: () => void;
  badgeCount?: number;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 60;

const TabBarItem: React.FC<TabBarItemProps> = ({
  icon,
  label,
  isActive,
  onPress,
  badgeCount,
}) => {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = colorScheme === 'dark' ? '#888' : '#aaa';

  // Map icon names to Lucide components
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: isActive ? activeColor : inactiveColor,
    };

    switch (icon) {
      case 'home':
        return <Home {...iconProps} />;
      case 'cart':
        return <ShoppingCart {...iconProps} />;
      case 'profile':
        return <User {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, isActive && styles.activeIconContainer]}
      >
        {renderIcon()}
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : badgeCount.toString()}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.label,
          { color: isActive ? activeColor : inactiveColor },
          isActive && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { state: cartState } = useCart();

  // Tab configuration with Lucide icon names
  const tabs = [
    { name: 'index', icon: 'home' as const, label: 'Trang Chủ' },
    { name: 'cart', icon: 'cart' as const, label: 'Giỏ Hàng' },
    { name: 'profile', icon: 'profile' as const, label: 'Hồ Sơ' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
      ]}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.name,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          // Show badge count only for cart tab
          const badgeCount = tab.name === 'cart' ? cartState.items.length : 0;

          return (
            <TabBarItem
              key={tab.name}
              icon={tab.icon}
              label={tab.label}
              isActive={isFocused}
              onPress={onPress}
              badgeCount={badgeCount}
            />
          );
        })}
      </View>
    </View>
  );
};

// Export the tab bar height for use in other components
export const getTabBarHeight = () => TAB_BAR_HEIGHT;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
