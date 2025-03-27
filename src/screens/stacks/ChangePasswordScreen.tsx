import { View, Text, Pressable, ActivityIndicator, Dimensions, Alert, TextInput } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookmarkSquareIcon, ChevronLeftIcon, ShareIcon } from 'react-native-heroicons/outline';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import { MaterialIcons } from '@expo/vector-icons';
import { useUserStore } from 'store/useUserStore';
import useSupabaseAuth from 'hooks/useSupabaseAuth';
import { Input } from 'react-native-elements';
import Button from '~/components/Button';

const { height, width } = Dimensions.get('window');

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { session } = useUserStore();
  const navigation = useNavigation();

  const { updateUserPassword } = useSupabaseAuth();

  async function handleUpdatePassword() {
    if (confirmPassword !== password) {
      Alert.alert('Your passwords are not the same');
      return;
    }

    setLoading(true);
    try {
      const { resetData, error } = await updateUserPassword(password);

      if (error) {
        setLoading(false);
        console.log(error.message);
        Alert.alert('Password Update Failed', error.message);
      } else {
        Alert.alert(`Password Update Successfully`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <View className="flex-row items-center justify-between px-4">
          <View className="w-1/3">
            <Pressable onPress={() => navigation.goBack()}>
              <View className="border-2 border-neutral-500 h-10 w-10 p-2 rounded-full items-center justify-center">
                <ChevronLeftIcon size={24} strokeWidth={3} color="gray" />
              </View>
            </Pressable>
          </View>

          <View className="relative">
            <Text className="text-xl font-bold">Edit Password</Text>
          </View>

          <View className="w-1/3"></View>
        </View>

        <View className="mt-8 px-4">
          {/* Password */}
          <Input
            label="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
            rightIcon={
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="gray"
                forceTextInputFocus={false}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            }
          />

          {/* Confirm Password */}
          <View className="space-x-1">
            <Input
              label="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              rightIcon={
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="gray"
                  forceTextInputFocus={false}
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                />
              }
            />
          </View>

          <Button
            title={isLoading ? <ActivityIndicator color="white" /> : 'Edit'}
            action={() => handleUpdatePassword()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;