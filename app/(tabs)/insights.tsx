import InsightHistoryCard from "@/components/InsightHistoryCard";
import ListHeading from "@/components/ListHeading";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import { icons } from "@/constants/icons";
import {
  INSIGHTS_CHART,
  INSIGHTS_CHART_MAX,
  INSIGHTS_CHART_Y_LABELS,
  INSIGHTS_EXPENSES,
  INSIGHTS_HISTORY,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
  const router = useRouter();
  const changeLabel = `${INSIGHTS_EXPENSES.changePercent > 0 ? "+" : ""}${INSIGHTS_EXPENSES.changePercent}%`;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={
          <>
            <View className="insights-header">
              <Pressable
                className="insights-header-btn"
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => router.push("/")}
              >
                <Image source={icons.back} className="insights-header-icon" />
              </Pressable>
              <Text className="insights-title">Monthly Insights</Text>
              <Pressable
                className="insights-header-btn"
                accessibilityRole="button"
                accessibilityLabel="More options"
              >
                <Image source={icons.menu} className="insights-header-icon" />
              </Pressable>
            </View>

            <ListHeading title="Upcoming" />
            <WeeklyBarChart
              data={INSIGHTS_CHART}
              maxValue={INSIGHTS_CHART_MAX}
              yLabels={INSIGHTS_CHART_Y_LABELS}
            />

            <View className="insights-expenses-card">
              <View>
                <Text className="insights-expenses-label">
                  {INSIGHTS_EXPENSES.label}
                </Text>
                <Text className="insights-expenses-period">
                  {INSIGHTS_EXPENSES.period}
                </Text>
              </View>
              <View className="items-end">
                <Text className="insights-expenses-amount">
                  {formatCurrency(INSIGHTS_EXPENSES.amount)}
                </Text>
                <Text className="insights-expenses-change">{changeLabel}</Text>
              </View>
            </View>

            <ListHeading title="History" />
          </>
        }
        data={INSIGHTS_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InsightHistoryCard {...item} />}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
};

export default Insights;
