import { posthog } from "@/lib/posthog";
import { useEffect } from "react";
import { Text, View } from "react-native";

const Onboarding = () => {
  useEffect(() => {
    posthog.capture("onboarding_viewed");
  }, []);

  return (
    <View>
      <Text>Onboarding</Text>
    </View>
  );
};

export default Onboarding;
