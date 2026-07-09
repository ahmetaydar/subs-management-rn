import { formatCurrency } from "@/lib/utils";
import { Image, Text, View } from "react-native";

const InsightHistoryCard = ({
  icon,
  name,
  dateLabel,
  price,
  currency,
  billing,
  color,
}: InsightHistoryCardProps) => {
  return (
    <View className="insights-history-card" style={{ backgroundColor: color }}>
      <View className="insights-history-main">
        <View className="insights-history-icon-wrap">
          <Image source={icon} className="insights-history-icon" />
        </View>
        <View className="insights-history-copy">
          <Text numberOfLines={1} className="insights-history-name">
            {name}
          </Text>
          <Text numberOfLines={1} className="insights-history-date">
            {dateLabel}
          </Text>
        </View>
      </View>

      <View className="insights-history-price-box">
        <Text className="insights-history-price">
          {formatCurrency(price, currency)}
        </Text>
        <Text className="insights-history-billing">{billing}</Text>
      </View>
    </View>
  );
};

export default InsightHistoryCard;
