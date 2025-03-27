import { View, Text, ActivityIndicator, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import numeral from 'numeral';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import Animated, { SharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { FetchCoinDetails, FetchCoinHistory } from 'utils/cryptoapi';

const CoinDetailsScreen = () => {
  const {
    params: { coinUuid },
  } = useRoute();

  const [lineData, setLineData] = useState<any>(null);
  const [item, setItem] = useState<any>({});
  const navigation = useNavigation();

  const font = useFont(require('../../../assets/fonts/PlusJakartaSans-Regular.ttf'), 8);

  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  function Tooltip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={8} color="red" />;
  }

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const { data: CoinDetails, isLoading: CoinDetailsLoading } = useQuery({
    queryKey: ['CoinDetails', coinUuid],
    queryFn: () => coinUuid && FetchCoinDetails(coinUuid),
  });

  const { data: CoinHistory, isLoading: CoinHistoryLoading } = useQuery({
    queryKey: ['CoinHistory', coinUuid],
    queryFn: () => coinUuid && FetchCoinHistory(coinUuid),
  });

  useEffect(() => {
    if (CoinHistory && CoinHistory.data.history) {
      const datasets = CoinHistory.data.history.map((item: any) => ({
        price: parseFloat(item.price),
        timestamp: item.timestamp,
      }));

      setLineData(datasets);
    }

    if (CoinDetails && CoinDetails.data.coin) {
      setItem(CoinDetails.data.coin);
    }
  }, [CoinDetails, CoinHistory]);

  return (
    <View className="flex-1 bg-white">
      {CoinDetailsLoading || CoinHistoryLoading ? (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      ) : (
        <SafeAreaView>
          <View className="flex-row items-center justify-between px-4">
            <Pressable className="border-2 border-neutral-500 rounded-full p-1" onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="keyboard-arrow-left" size={24} color="gray" />
            </Pressable>

            <View>
              <Text className="font-bold text-lg">{item.symbol}</Text>
            </View>
            <Pressable
              className="border-2 border-neutral-500 rounded-full p-1"
              onPress={() => Alert.alert('this feature is not yet implemented')}
              accessibilityRole="button"
              accessibilityLabel="More options. Not yet implemented"
            >
              <Entypo name="dots-three-horizontal" size={24} color="gray" />
            </Pressable>
          </View>
          <View className="px-4 justify-center items-center py-2">
            <Text className={`font-extrabold text-2xl`}>{numeral(parseFloat(item?.price)).format('$0,0.00')}</Text>
          </View>

          {item && (
            <View className="flex-row justify-center items-center space-x-2 px-4 py-2">
              <View className="flex-row w-full py-4 items-center"
              accessible={true}
              accessibilityLabel={`Details for ${item.name}. Current price is ${numeral(parseFloat(item?.price)).format('$0,0.00')}. Change is ${item.change} percent. Market cap is ${item.marketCap}`}
              >
                <View className="w-[16%]">
                  <View className="w-10 h-10">
                    <Image
                      source={{ uri: item.iconUrl }}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={1000}
                      className="w-full h-full flex-1"
                    />
                  </View>
                </View>

                <View className="w-[55%] justify-start items-start">
                  <Text className="font-bold text-lg">{item.name}</Text>
                  <View className="flex-row justify-center items-center space-x-2">
                    <Text className="font-medium text-sm text-neutral-500 ">
                      {numeral(parseFloat(item?.price)).format('$0,0.00')}
                    </Text>
                    <Text
                      className={`font-medium text-sm ${
                        item.change < 0 ? 'text-red-600' : item.change > 0 ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {item.change}%
                    </Text>
                  </View>
                </View>

                <View className="w-[29%] justify-center items-end">
                  <Text className="font-bold text-base">{item.symbol}</Text>

                  <View className="flex-row justify-center items-center space-x-2">
                    <Text className="font-medium text-sm text-neutral-500">
                      {item.marketCap?.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      )}

      <View style={{ height: 300, paddingHorizontal: 10 }}
      accessible={true}
      accessibilityLabel={`Price chart for ${item.name}. Swipe left or right to explore data visually.`}>
        {lineData && (
          <CartesianChart
            chartPressState={state}
            axisOptions={{
              font,
              tickCount: 8,
              labelOffset: { x: -1, y: 0 },
              labelColor: 'green',
              formatXLabel: ms => format(new Date(ms * 1000), 'MM/dd'),
            }}
            data={lineData}
            xKey="timestamp"
            yKeys={['price']}
          >
            {({ points }) => (
              <>
                <Line points={points.price} color="green" strokeWidth={2} />
                {/*isActive && <Tooltip x={state.x.position} y={state.y.price.position} />*/}
              </>
            )}
          </CartesianChart>
        )}
      </View>

      <View className="px-4 py-4">
        {/* All time High */}
        <View className="flex-row justify-between"
        accessible={true}
        accessibilityLabel={`All time high: ${numeral(parseFloat(item?.allTimeHigh?.price)).format('$0,0.00')}`}
        >
          <Text className="text-base font-bold text-neutral-500">All Time High</Text>
          <Text className={`font-bold text-base`}>
            {numeral(parseFloat(item?.allTimeHigh?.price)).format('$0,0.00')}
          </Text>
        </View>

        {/* Number of Markets  */}
        <View className="flex-row justify-between">
          <Text className="text-base font-bold text-neutral-500">Number of Markets</Text>
          <Text className={`font-bold text-base`}>{numeral(parseFloat(item?.numberOfMarkets)).format('$0,0.00')}</Text>
        </View>

        {/* Number of Exchanges  */}
        <View className="flex-row justify-between">
          <Text className="text-base font-bold text-neutral-500">Number of Exchanges</Text>
          <Text className={`font-bold text-base`}>
            {numeral(parseFloat(item?.numberOfExchanges)).format('$0,0.00')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CoinDetailsScreen;