import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from 'expo-linking'; // Ye import karein

function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
     // Ye URL Clerk ko batayega ki 'mobile://sso-callback' par vapas jao
    const redirectUrl = Linking.createURL('/sso-callback', { scheme: 'mobile' });

    const { createdSessionId, setActive } = await startSSOFlow({ 
      strategy,
      redirectUrl // <--- Ye pass karna compulsory hai
    });

    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
    }
    }
     catch (error) {
      console.log("* Error in social auth:", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    }
     finally {
      setLoadingStrategy(null);
    }
  };
    return { handleSocialAuth, loadingStrategy };
  };

export default useAuthSocial;
