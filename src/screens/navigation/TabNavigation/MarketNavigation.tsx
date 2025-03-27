import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import MarketScreen from '~/screens/tabs/markets/MarketScreen';

const Stack = createStackNavigator();

const MarketNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="MarketS" component={MarketScreen} />
    </Stack.Navigator> 
  );
};

export default MarketNavigation;