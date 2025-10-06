import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import BrainwaveMonitor from "./screens/BrainwaveMonitor"

// Import screens
import HomeScreen from "./screens/HomeScreen"
import PlaylistScreen from "./screens/PlaylistScreen"
import SettingsScreen from "./screens/SettingsScreen"
// Import types
import type { MainTabParamList } from "./navigation/types"

const Tab = createBottomTabNavigator<MainTabParamList>()

// Simple icon components (replace with react-native-vector-icons or expo-icons later)
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ width: 24, height: 24, backgroundColor: focused ? "#06b6d4" : "#6b7280", borderRadius: 12 }} />
)

const PlaylistIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ width: 24, height: 24, backgroundColor: focused ? "#06b6d4" : "#6b7280", borderRadius: 4 }} />
)

const SettingsIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ width: 24, height: 24, backgroundColor: focused ? "#06b6d4" : "#6b7280", borderRadius: 6 }} />
)

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#1f2937",
              borderTopColor: "#374151",
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
            },
            tabBarActiveTintColor: "#06b6d4",
            tabBarInactiveTintColor: "#6b7280",
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: "Inicio",
              tabBarIcon: HomeIcon,
            }}
          />
          <Tab.Screen
            name="Playlist"
            component={PlaylistScreen}
            options={{
              tabBarLabel: "Música",
              tabBarIcon: PlaylistIcon,
            }}
          />
          <Tab.Screen
            name="Navs"
            component={BrainwaveMonitor}
            options={{
              tabBarLabel: "Ajustes",
              tabBarIcon: SettingsIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  )
}
