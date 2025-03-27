import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Image, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from 'lib/supabase';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  showUpload?: boolean;
}

const Avatar = ({ url, size = 150, onUpload, showUpload }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) {
        console.log(error);
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image:', error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.');
        setUploading(false);
        return;
      }

      const image = result.assets[0];
      console.log('Got image', image);

      if (!image.uri) {
        throw new Error('No image uri!');
      }

      const arraybuffer = await fetch(image.uri).then(res => res.arrayBuffer());

      const fileExt = image.uri?.split('.').pop()?.toLocaleLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('avatars').upload(path, arraybuffer, {
        contentType: image.mimeType ?? 'image/jpeg',
      });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View accessible={true}>
      {/* Avatar Image */}
      <View className="relative">
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require('../../assets/images/avatar.jpg')
          }
          style={[avatarSize, styles.avatar, styles.image]}
          accessibilityLabel={avatarUrl ? "User profile photo" : "Default profile photo"}
          accessibilityRole="image"
        />
      </View>
  
      {/* Upload Button Overlay */}
      {showUpload && (
        <Pressable
          className="absolute w-full h-full justify-center items-center"
          onPress={uploadAvatar}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            uploading
              ? "Uploading profile photo"
              : "Upload new profile photo"
          }
          accessibilityState={{ busy: uploading }}
        >
          {!uploading ? (
            <View className="w-full h-full items-end justify-end pr-1">
              <MaterialIcons name="cloud-upload" size={30} color="black" />
            </View>
          ) : (
            <ActivityIndicator color="black" />
          )}
        </Pressable>
      )}
    </View>
  );
  
};
export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    maxWidth: '100%',
    position: 'relative',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: 'gray',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 20,
  },
});