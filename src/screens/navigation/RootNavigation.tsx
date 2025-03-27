import { View, Text } from 'react-native'
import React, {useState} from 'react'
import { TransitionPreset, TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './TabNavigation';
import AuthNavigation from './AuthNavigation';
import { useUserStore } from 'store/useUserStore';

const Stack = createStackNavigator();
export default function RootNavigation() {
  const {session} = useUserStore();

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={
      {headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
        {session && session.user ? (<Stack.Screen name="TabNavigation" component={TabNavigation} />) 
        : (<Stack.Screen name="AuthNavigation" component={AuthNavigation} />)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}