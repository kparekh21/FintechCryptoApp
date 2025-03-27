import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins } from '../../../../utils/cryptoapi';
import Animated, { FadeInDown } from 'react-native-reanimated';
import numeral from 'numeral';

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

const MarketScreen = () => {
  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [active, setActive] = useState('all');

  const allCoins = () => {
    setActive('all');
  };

  const calculateTopGainers = () => {
    setActive('gainers');

    const gainers = CoinsData.data.coins.filter(coin => parseFloat(coin.change) > 0);

    setTopGainers(gainers);
  };

  const calculateTopLosers = () => {
    setActive('losers');

    const losers = CoinsData.data.coins.filter(coin => parseFloat(coin.change) < 0);

    setTopLosers(losers);
  };

  const { data: CoinsData, isLoading: IsAllCoinsLoading } = useQuery({
    queryKey: ['allCoins'],
    queryFn: FetchAllCoins,
  });

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
  onPress={() => navigate('CoinDetails', { coinUuid: item.uuid })}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`Coin: ${item.name}. Symbol: ${item.symbol}. Price: ${numeral(parseFloat(item?.price)).format('$0,0.00')}. Change: ${item.change} percent. Market cap: ${numeral(item.marketCap).format('0.00a').toUpperCase()}`}
>
  <Animated.View
    entering={FadeInDown.duration(100).delay(index * 200).springify()}
    className="w-full flex-row items-center px-2 py-3"
  >
    {/* Icon */}
    <View className="w-[16%]">
      <Image
        source={{ uri: item.iconUrl }}
        style={{ width: 45, height: 45 }}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
        className="w-full h-full flex-1"
        accessibilityLabel={`${item.name} logo`}
        accessibilityRole="image"
      />
    </View>

    {/* Name, Price, Change */}
    <View className="w-[55%] justify-start items-start">
      <Text className="font-bold text-lg">{item.name}</Text>
      <View className="flex-row justify-center items-center space-x-2">
        <Text className="font-medium text-sm text-neutral-500">
          {numeral(parseFloat(item?.price)).format('$0,0.00')}
        </Text>
        <Text
          className={`font-medium text-sm px-1 ${
            item.change < 0 ? 'text-red-600' : item.change > 0 ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          {item.change}%
        </Text>
      </View>
    </View>

    {/* Symbol, MarketCap */}
    <View className="w-[29%] justify-center items-end">
      <Text className="font-bold text-base">{item.symbol}</Text>
      <Text className="font-medium text-sm text-neutral-500">
        {numeral(item.marketCap).format('0.00a').toUpperCase()}
      </Text>
    </View>
  </Animated.View>
</Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        {/* Header */}

        <View className="w-full flew-row justify-center items-start px-4 pb-4"
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Market overview">
          <View className="w-3/4 flex-row space-x-2">
            <Text className="text-3xl font-bold">Market</Text>
          </View>
        </View>

        <View className="px-4 flex-row justify-between items-center pb-4">
          {/* All */}
          <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="All coins"
          accessibilityState={{ selected: active === 'all' }}
            className={`w-1/4 justify-center items-center py-1 ${active === 'all' ? 'border-b-4 border-blue-500' : ''}`}
            onPress={allCoins}
          >
            <Text className={`text-lg ${active === 'all' ? 'font-extrabold' : ''}`}>All</Text>
          </Pressable>

          {/* Gainers */}
          <Pressable
           accessible={true}
           accessibilityRole="button"
           accessibilityLabel="Top Gainers"
           accessibilityState={{ selected: active === 'gainers' }}
            className={`w-1/4 justify-center items-center py-1 ${
              active === 'gainers' ? 'border-b-4 border-blue-500' : ''
            }`}
            onPress={calculateTopGainers}
          >
            <Text className={`text-lg ${active === 'gainers' ? 'font-extrabold' : ''}`}>Gainers</Text>
          </Pressable>

          {/* Losers */}
          <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Top Losers"
          accessibilityState={{ selected: active === 'losers' }}
            className={`w-1/4 justify-center items-center py-1 ${
              active === 'losers' ? 'border-b-4 border-blue-500' : ''
            }`}
            onPress={calculateTopLosers}
          >
            <Text className={`text-lg ${active === 'losers' ? 'font-extrabold' : ''}`}>Losers</Text>
          </Pressable>
        </View>

        {/* Coins  */}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View className="px-4 py-1 items-center">
            {/* All */}
            {active === 'all' && (
              <View className="px-4 items-center">
                {IsAllCoinsLoading ? (
                  <ActivityIndicator
                  size="large"
                  color="black"
                  accessible={true}
                  accessibilityLabel="Loading market data"
                />
                
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={CoinsData.data.coins}
                    keyExtractor={item => item.uuid}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}

            {/* Gainers */}
            {active === 'gainers' && (
              <View className="px-4 items-center">
                {IsAllCoinsLoading ? (
                  <ActivityIndicator size="large" color="black" />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={active === 'gainers' ? topGainers : CoinsData.data.coins}
                    keyExtractor={item => item.uuid}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}

            {/* Losers */}
            {active === 'losers' && (
              <View className="px-4 items-center">
                {IsAllCoinsLoading ? (
                  <ActivityIndicator size="large" color="black" />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={active === 'losers' ? topLosers : CoinsData.data.coins}
                    keyExtractor={item => item.uuid}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MarketScreen;