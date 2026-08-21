import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import HomeScreen from '../screens/HomeScreen';
import HospitalsScreen from '../screens/HospitalsScreen';
import ExamsScreen from '../screens/ExamsScreen';
import NutritionScreen from '../screens/NutritionScreen';
import GlucoseScreen from '../screens/GlucoseScreen';
import { colors, fontSize, radii } from '../theme';

export type RootTabParamList = {
  Home: undefined;
  Hospitals: undefined;
  Exams: undefined;
  Nutrition: undefined;
  Glucose: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, { active: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home' },
  Hospitals: { active: 'location' },
  Exams: { active: 'document-text' },
  Nutrition: { active: 'nutrition' },
  Glucose: { active: 'pulse' },
};

const labels: Record<keyof RootTabParamList, string> = {
  Home: 'Início',
  Hospitals: 'Hospitais',
  Exams: 'Exames',
  Nutrition: 'Alimentação',
  Glucose: 'Glicose',
};

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppHeader />,
        tabBarIcon: ({ focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <Ionicons
              name={icons[route.name].active}
              size={20}
              color={focused ? colors.primary : colors.gray400}
            />
          </View>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Hospitals" component={HospitalsScreen} options={{ title: 'Hospitais' }} />
      <Tab.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exames' }} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} options={{ title: 'Alimentação' }} />
      <Tab.Screen name="Glucose" component={GlucoseScreen} options={{ title: 'Glicose' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    padding: 6,
    borderRadius: radii.lg,
  },
  iconWrapActive: {
    backgroundColor: colors.green50,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 0,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 8,
    height: 64,
    paddingTop: 4,
  },
  tabItem: {
    paddingVertical: 2,
  },
});
