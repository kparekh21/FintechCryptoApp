import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../../tabs/search/SearchScreen';
import HomeScreen from '../../tabs/home/HomeScreen';

const Stack = createStackNavigator();

const SearchNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="SearchS" component={SearchScreen} />
      <Stack.Screen name="HomeS" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default SearchNavigation;