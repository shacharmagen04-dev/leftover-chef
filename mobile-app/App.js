import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold } from "@expo-google-fonts/work-sans";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";
import { Feather } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";

import { AppProvider } from "./src/context/AppContext";
import { COLORS } from "./src/config";
import UploadScreen from "./src/screens/UploadScreen";
import IngredientsScreen from "./src/screens/IngredientsScreen";
import RecipesScreen from "./src/screens/RecipesScreen";
import SavedScreen from "./src/screens/SavedScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="Ingredients" component={IngredientsScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg }}>
        <ActivityIndicator color={COLORS.herb} />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: COLORS.herb,
            tabBarInactiveTintColor: COLORS.inkFainter,
            tabBarStyle: { backgroundColor: COLORS.bg, borderTopColor: COLORS.border },
            tabBarIcon: ({ color, size }) => {
              const iconName = route.name === "CookTab" ? "book-open" : "heart";
              return <Feather name={iconName} size={size - 4} color={color} />;
            },
          })}
        >
          <Tab.Screen name="CookTab" component={CookStack} options={{ title: "Cook" }} />
          <Tab.Screen name="SavedTab" component={SavedScreen} options={{ title: "Saved" }} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
