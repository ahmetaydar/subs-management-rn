import { colors } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import { Text, View } from "react-native";

const BAR_AREA_HEIGHT = 140;

const WeeklyBarChart = ({ data, maxValue, yLabels }: WeeklyBarChartProps) => {
  return (
    <View className="insights-chart-card">
      <View className="insights-chart-body">
        <View className="insights-chart-y-axis">
          {yLabels.map((label) => (
            <Text key={label} className="insights-chart-y-label">
              {label}
            </Text>
          ))}
        </View>

        <View className="insights-chart-plot">
          <View className="insights-chart-grid" pointerEvents="none">
            {yLabels.map((label) => (
              <View key={`grid-${label}`} className="insights-chart-grid-line" />
            ))}
          </View>

          <View className="insights-chart-bars">
            {data.map((item) => {
              const barHeight = Math.max(
                (item.value / maxValue) * BAR_AREA_HEIGHT,
                8,
              );

              return (
                <View key={item.day} className="insights-chart-bar-col">
                  {item.highlighted ? (
                    <View className="insights-chart-tooltip">
                      <Text className="insights-chart-tooltip-text">
                        {formatCurrency(item.value)}
                      </Text>
                    </View>
                  ) : (
                    <View className="insights-chart-tooltip-spacer" />
                  )}
                  <View
                    className="insights-chart-bar"
                    style={{
                      height: barHeight,
                      backgroundColor: item.highlighted
                        ? colors.accent
                        : colors.primary,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className="insights-chart-x-axis">
        <View className="insights-chart-y-spacer" />
        <View className="insights-chart-x-labels">
          {data.map((item) => (
            <Text
              key={item.day}
              className={clsx(
                "insights-chart-x-label",
                item.highlighted && "text-accent",
              )}
            >
              {item.day}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WeeklyBarChart;
