import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../tabs/profile/ProfileScreen';
import EditProfileScreen from '../../stacks/EditProfileScreen';
import ChangePasswordScreen from '../../stacks/ChangePasswordScreen';

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;