import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "~/components/Avatar";
import useSupabaseAuth from "hooks/useSupabaseAuth";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUserStore } from "store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FetchAllCoins } from "utils/cryptoapi";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";

interface Coin {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const HomeScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState("")
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const {getUserProfile} = useSupabaseAuth();
  const {session} = useUserStore();
  const {navigate}: NavigationProp<ScreenNavigationType> = useNavigation();
  const [balance, setBalance] = useState(1291.00);

  async function handleGetProfile() {
    setLoading(true);
    try{
      const {data, error, status} = await getUserProfile();
      if (error && status !== 406) {
        setLoading(false);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log("Error getting user profile: ", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if(session){
        handleGetProfile();
      }
    }, [session]), 
  );

  const {data: CoinsData, isLoading: isAllCoinsLoading} = useQuery({
    queryKey: ["allCoins"],
    queryFn: FetchAllCoins,
  })

  const renderItems = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
      onPress={() => navigate("CoinDetails", { coinUuid: item.uuid })}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Coin: ${item.name}. Symbol: ${item.symbol}. Price: ${numeral(parseFloat(item.price)).format("$0,0.00")}. Change: ${item.change} percent. Market cap: ${numeral(item.marketCap).format("0.00a").toUpperCase()}`}
    >
      <Animated.View
        entering={FadeInDown.duration(100).delay(index * 200).springify()}
        className="w-full flex-row items-center py-4 px-2"
      >
        {/* Left: Icon */}
        <View className="w-[16%]">
          <View className="w-10 h-10">
            <Image
              source={{ uri: item.iconUrl }}
              style={{ width: 45, height: 45 }}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
              className="w-full h-full flex-1"
            />
          </View>
        </View>
  
        {/* Middle: Name + Price + Change */}
        <View className="w-[55%] justify-start items-start">
          <Text className="font-bold text-lg">{item.name}</Text>
  
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="font-medium text-sm text-neutral-500">
              {numeral(parseFloat(item?.price)).format("$0,0.00")}
            </Text>
  
            <Text
              className={`font-medium text-sm px-1 ${
                item.change < 0
                  ? "text-red-600"
                  : item.change > 0
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {item.change}%
            </Text>
          </View>
        </View>
  
        {/* Right: Symbol + MarketCap */}
        <View className="w-[29%] justify-start items-end">
          <Text className="font-bold text-base">{item.symbol}</Text>
  
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="font-medium text-sm text-neutral-500">
              {item.marketCap
                ? numeral(item.marketCap).format("0.00a").toUpperCase()
                : "N/A"}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
  
  

  console.log({CoinsData});

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        {/* Header */}
        <View className="w-full flex-row justify-between items-center px-4">
        <View
          className="w-3/4 flex-row space-x-2"
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={`Hi ${username || "User"}. Today is your day.`}
        >
          <View className="justify-center items-center">
            <View className="h-12 w-12 rounded-2xl overflow-hidden">
              <Avatar url={avatarUrl} size={50} onUpload={path => {}} />
            </View>
          </View>

          <View className="px-2">
            <Text className="text-lg font-bold">
              Hi, {username ? username : "User"}
            </Text>
            <Text className="text-sm text-neutral-500">
              Today Is Your Day!
            </Text>
          </View>
        </View>

        <View className="py-6">
          <Pressable
            className="bg-neutral-700 rounded-lg p-1"
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => console.log('Menu pressed')}
          >
            <Ionicons name="menu" size={24} color="white" />
          </Pressable>
        </View>
              </View>

              {/* Balance */}
              <View className="mx-4 bg-neutral-800 rounded-[34px] overflow-hidden mt-4 mb-4">
                <View
                  className="bg-[#0DF69E] justify-center items-center py-6 rounded-[34px]"
                  accessible={true}
                  accessibilityRole="summary"
                  accessibilityLabel={`Total balance is ${numeral(balance).format('$0,0.00')}`}
                >
                  <Text className="text-sm font-medium text-neutral-700">
                    Total Balance
                  </Text>
                  <Text className="text-3xl font-extrabold">
                    {numeral(balance).format('$0,0.00')}
                  </Text>
                </View>

                <View className="justify-between items-center flex-row py-4">

                  {/* Send */}
                  <Pressable
                    className="w-1/4 justify-center items-center space-y-2"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Send money"
                    onPress={() => console.log("Send pressed")}
                  >
                    <View className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2 flex items-center justify-center">
                      <Image
                        source={require("../../../../assets/images/money-send.png")}
                        style={{ width: 25, height: 25 }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                        className="w-full h-full flex-1"
                      />
                    </View>
                    <Text className="text-white">Send to</Text>
                  </Pressable>

                  {/* Request */}
                  <Pressable
                    className="w-1/4 justify-center items-center space-y-2"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Request money"
                    onPress={() => console.log("Request pressed")}
                  >
                    <View className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2 items-center justify-center">
                      <Image
                        source={require("../../../../assets/images/money-receive.png")}
                        style={{ width: 25, height: 25 }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                        className="w-full h-full flex-1"
                      />
                    </View>
                    <Text className="text-white">Request</Text>
                  </Pressable>

                  {/* Top up */}
                  <Pressable
                    className="w-1/4 justify-center items-center space-y-2"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Top up your balance"
                    onPress={() => console.log("Top Up pressed")}
                  >
                    <View className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2 items-center justify-center">
                      <Image
                        source={require("../../../../assets/images/card-add.png")}
                        style={{ width: 25, height: 25 }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                        className="w-full h-full flex-1"
                      />
                    </View>
                    <Text className="text-white">Top Up</Text>
                  </Pressable>

                  {/* More */}
                  <Pressable
                    className="w-1/4 justify-center items-center space-y-2"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="More actions"
                    onPress={() => console.log("More pressed")}
                  >
                    <View className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2 items-center justify-center">
                      <Image
                        source={require("../../../../assets/images/more.png")}
                        style={{ width: 25, height: 25 }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                        className="w-full h-full flex-1"
                      />
                    </View>
                    <Text className="text-white">More</Text>
                  </Pressable>


                  
                </View>
                </View>

                {/* Coins */}
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false}
                    >
                  <View className="px-4 py-8 items-center">
                    {isAllCoinsLoading ? (
                      <ActivityIndicator size="large" color="black" />
                    ) : (
                      <FlatList
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                        data={CoinsData.data.coins}
                        keyExtractor={(item) => item.uuid}
                        renderItem={renderItems}
                        showsVerticalScrollIndicator={false}
                      />
                    )}
                  </View>
                </ScrollView>

              
            </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
