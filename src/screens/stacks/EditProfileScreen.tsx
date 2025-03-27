import { View, Text, Pressable, ActivityIndicator, Dimensions, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookmarkSquareIcon, ChevronLeftIcon, ShareIcon } from 'react-native-heroicons/outline';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Input } from 'react-native-elements';
import { useUserStore } from 'store/useUserStore';
import useSupabaseAuth from 'hooks/useSupabaseAuth';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';

const { height, width } = Dimensions.get('window');

const EditProfileScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { session } = useUserStore();
  const navigation = useNavigation();

  const { getUserProfile, updateUserProfile } = useSupabaseAuth();

  const { params: item } = useRoute() || {};

  async function handleGetProfile() {
    setLoading(true);

    try {
      const { data, error, status } = await getUserProfile();

      if (error && status !== 400) {
        setLoading(false);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    setLoading(true);

    try {
      console.log(avatarUrl);
      const { error } = await updateUserProfile(username, fullName, avatarUrl);

      if (error) {
        setLoading(false);
        console.log(error.message);
        Alert.alert(`Profile Update Failed ${error.message}`);
      } else {
        Alert.alert(`Profile Update Successfully`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session])
  );
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

          <View className="w-1/3">
            <Text className="text-xl font-bold">Edit Profile </Text>
          </View>

          <View className="w-1/3"></View>
        </View>

        {/* Avatar */}
        <View>
          <View className="justify-center items-center py-2">
            <View className="overflow-hidden border-2 border-[#2ab07c] rounded-3xl">
              <Avatar
                size={100}
                url={avatarUrl}
                showUpload={true}
                onUpload={(url: string) => {
                  console.log(url);
                  setAvatarUrl(url);
                }}
              />
            </View>

            <View className="w-full py-3 items-center">
              <Text className="text-lg font-bold text-white">{username}</Text>
            </View>
          </View>
        </View>

        <View className="px-4">
          {/* Email */}
          <Input label="Email" value={session?.user?.email} disabled />

          {/* Username */}
          <View className="space-x-1">
            <Input label="Username" value={username || ''} onChangeText={text => setUsername(text)} />
          </View>

          {/* Full name */}
          <View className="space-x-1">
            <Input label="Full name" value={fullName || ''} onChangeText={text => setFullName(text)} />
          </View>

          <Button
            title={isLoading ? <ActivityIndicator color="white" /> : 'Edit'}
            action={() => handleUpdateProfile()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;