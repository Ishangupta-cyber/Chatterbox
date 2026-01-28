import "../global.css"
import { Stack } from "expo-router"
import {QueryClientProvider , QueryClient} from "@tanstack/react-query"
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'


const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
     tokenCache={tokenCache}>
      <ClerkLoaded> {/* <--- Isse wrap karein taaki auth state load ho jaye */}
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="sso-callback" /> 
          </Stack>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
