import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-dark">
        <ActivityIndicator size="large" color="#F4A261" />
      </View>
    );
  }

  // Agar login ho gaya toh tabs par bhejo, warna wapas login (auth) par
  return isSignedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />
}