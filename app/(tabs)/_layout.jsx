import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';
import { useTheme } from '../../context/ThemeContext';

const TabIcon = ({ name, focused, title, colors }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10, width: 72 }}>
    <View style={{
      width: 48,
      height: 32,
      borderRadius: 16,
      backgroundColor: focused ? colors.primaryMuted : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon name={name} size={21} color={focused ? colors.primary : colors.labelTertiary} />
    </View>
    <Text style={{
      fontSize: 10,
      marginTop: 3,
      fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
      color: focused ? colors.primary : colors.labelTertiary,
    }}>
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0.5,
          borderTopColor: colors.tabBarBorder,
          height: 80,
          paddingBottom: 16,
          paddingTop: 4,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home" title="Home" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="myjobs"
        options={{
          title: 'My Jobs',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="browser" title="My Jobs" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="gear" title="Settings" colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
