import SubscriptionCard from "@/components/SubscriptionCard";
import { colors } from "@/constants/theme";
import { posthog } from "@/lib/posthog";
import { useSubscriptionsStore } from "@/store/subscriptions";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return subscriptions;

    return subscriptions.filter((subscription) => {
      const haystack = [
        subscription.name,
        subscription.category,
        subscription.plan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={
          <View className="mb-5 gap-4">
            <Text className="text-2xl font-sans-bold text-primary">
              Subscriptions
            </Text>
            <TextInput
              className="rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search subscriptions"
              placeholderTextColor={colors.mutedForeground}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>
        }
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="home-empty">No subscriptions found</Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId((prev) =>
                prev === item.id ? null : item.id
              );
              if (isExpanding) {
                posthog.capture("subscription_expanded", {
                  subscription_id: item.id,
                });
              }
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
