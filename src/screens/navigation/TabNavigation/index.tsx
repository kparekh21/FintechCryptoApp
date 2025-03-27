import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeNavigation from "./HomeNavigation";
import MarketNavigation from "./MarketNavigation";
import SearchNavigation from "./SearchNavigation";
import ProfileNavigation from "./ProfileNavigation";

import { TransitionPresets } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Market") {
            iconName = "stats-chart-outline";
          } else if (route.name === "Search") {
            iconName = "search-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          const customizeSize = 25;

          return (
            <Ionicons
              name={iconName as any}
              size={customizeSize}
              color={focused ? "#164b48" : "gray"}
            />
          );
        },
        tabBarActiveTintColor: "#164b48",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
  name="Home"
  component={HomeNavigation}
  options={{
    tabBarLabel: "Home",
    tabBarAccessibilityLabel: "Home screen tab",
  }}
/>

<Tab.Screen
  name="Market"
  component={MarketNavigation}
  options={{
    tabBarLabel: "Market",
    tabBarAccessibilityLabel: "Market screen tab",
  }}
/>

<Tab.Screen
  name="Search"
  component={SearchNavigation}
  options={{
    tabBarLabel: "Search",
    tabBarAccessibilityLabel: "Search screen tab",
  }}
/>

<Tab.Screen
  name="Profile"
  component={ProfileNavigation}
  options={{
    tabBarLabel: "Profile",
    tabBarAccessibilityLabel: "Profile screen tab",
  }}
/>

    </Tab.Navigator>
  );
};

export default TabNavigation;
