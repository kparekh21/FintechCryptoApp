import { View, Text, ActivityIndicator, Dimensions, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "~/components/Button";
import Breaker from "~/components/Breaker";
import ButtonOutline from "~/components/ButtonOutline";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp ,useNavigation } from "@react-navigation/native";
import { supabase } from "lib/supabase";
import { useUserStore } from "store/useUserStore";

const { height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {setSession, setUser } = useUserStore();

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> = useNavigation();

  async function signInWithEmail() {
    setIsLoading(true);
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) {
        setIsLoading(false);
        Alert.alert(error.message);
      }
  
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        Alert.alert("Logged in successfully!");
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <View className="flex-1">
      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-50">
            <View className="absolute">
              <ActivityIndicator size="large" color="white" />
            </View>
          </View>
        </View>
      )}

      {/* Content */}
      <View className="justify-center items-center relative flex-1">
        <View
          className="justify-center w-full px-4 space-y-4"
          style={{ height: height * 0.75 }}
        >
          {/* Welcome Text */}
          <Animated.View
            className="justify-center items-center"
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Welcome back. Please log in to your account."
            entering={FadeInDown.duration(100).springify()}
          >
            <Text
              className="text-neutral-800 text-2xl leading-[60px]"
              style={{ fontFamily: "PlusJakartaSansBold" }}
            >
              Welcome Back, User
            </Text>
            <Text className="text-neutral-500 text-sm font-medium">
              Welcome back! Please enter your details.
            </Text>
          </Animated.View>

          {/* Text Input */}
          <Animated.View
            className="py-8 space-y-8"
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            {/* Email */}
            <View className="py-2">
              <View className="border-2 border-gray-400 rounded-lg">
                <TextInput
                  className="p-4"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  accessible={true}
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter your email"
                  returnKeyType="next"
                />
              </View>
            </View>
        

            {/* Password */}
            <View className="py-4">
              <View className="border-2 border-gray-400 rounded-lg">
                <TextInput
                  className="p-4"
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholder="Password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  textContentType="password"
                  accessible={true}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                  returnKeyType="done"
                />
              </View>
            </View>
            
          </Animated.View>

          {/* Login Button */}
          <Animated.View
            className="w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Button title="Login" action={() => signInWithEmail() } 
              accessibilityRole="button"
              accessibilityLabel="Login"
              accessibilityHint="Submits login form" />
            </View>
          </Animated.View>

          {/* Breaker Line */}
          <View>
            <Breaker />
          </View>

          {/* 3rd Party Auth */}
          <View className="w-full justify-normal">
            <Animated.View
              entering={FadeInDown.duration(100).delay(600).springify()}
              className="pb-4"
            >
              <ButtonOutline title="Continue with Google" 
              accessibilityLabel="Sign in with your Google account"
              accessibilityHint="Opens Google login flow">
                <AntDesign name="google" size={20} color="gray" />
              </ButtonOutline>
            </Animated.View>
          </View>

          {/* Don't have an account */}
            <Animated.View
              className="flex-row justify-center items-center"
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Don't have an account? Register"
              entering={FadeInDown.duration(100).delay(700).springify()}
            >
              <Text
                className="text-neutral-500 text-lg font-medium leading-[38px] text-center"
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                }}
              >
                Don't have an account?{" "}
              </Text>
              
              <Pressable accessibilityRole="button"
                accessibilityLabel="Register a new account"
                accessibilityHint="Navigates to the registration screen"
                onPress={() => {navigateAuth("Register")}}>
              <Text
                className="text-neutral-800 text-lg font-medium leading-[38px] text-center"
                style={{
                  fontFamily: "PlusJakartaSansBold",
                }}
              >
                Register{" "}
              </Text>
              </Pressable>
            </Animated.View>


        </View>

        
      </View>
    </View>
  );
};

export default LoginScreen;
