import "../global.css"
import { Stack } from "expo-router"
import {QueryClientProvider , QueryClient} from "@tanstack/react-query"
import {  ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <ClerkProvider 
     tokenCache={tokenCache}>
      <ClerkLoaded> 
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}