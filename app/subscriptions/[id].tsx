import { posthog } from "@/lib/posthog";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    posthog.capture("subscription_detail_viewed", { subscription_id: id });
  }, [id]);

  return (
    <View className="flex-1 bg-background p-5">
      <Text>SubscriptionDetails {id}</Text>
      <Link
        href="/subscriptions"
        className="mt-4 rounded bg-primary px-4 py-2 text-white"
      >
        Back to Subscriptions
      </Link>
    </View>
  );
};

export default SubscriptionDetails;
