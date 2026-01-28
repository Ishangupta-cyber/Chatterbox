import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert,  } from "react-native";
import { makeRedirectUri} from "expo-auth-session"
//.        mobile://(tabs)/profile

//
function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);
    try {
      const redirectUrl = makeRedirectUri({ scheme: "mobile", path: "/(tabs)/profile" })
      const { createdSessionId, setActive } = await startSSOFlow({ strategy,redirectUrl});
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log(createdSessionId)
      } else {
        console.log("No session created")
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
