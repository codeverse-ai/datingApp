
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { UserIcon } from './icons/UserIcon';
import { SparkIcon } from './icons/SparkIcon';
import { CompassIcon } from './icons/CompassIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { HeartIcon } from './icons/HeartIcon';

const ICONS: { [key: string]: React.ElementType } = {
  Discover: SparkIcon,
  Explore: CompassIcon,
  Matches: HeartIcon,
  Chats: ChatBubbleIcon,
  Profile: UserIcon,
};

const BottomNavbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const Icon = ICONS[label];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const activeColor = '#F06292';
          const inactiveColor = '#9ca3af';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              {Icon && <Icon width={28} height={28} color={isFocused ? activeColor : inactiveColor} variant={isFocused ? 'solid' : 'outline'} />}
              <Text style={{ color: isFocused ? activeColor : inactiveColor, fontSize: 10, marginTop: 4, fontWeight: isFocused ? '600' : '400' }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <SafeAreaView style={styles.safeArea} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
        },
        android: {
            elevation: 5,
        }
    })
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    backgroundColor: 'transparent'
  }
});

export default BottomNavbar;
