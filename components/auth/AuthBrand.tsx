import { APP_NAME, APP_TAGLINE } from "@/lib/auth";
import { Text, View } from "react-native";

type AuthBrandProps = {
  title: string;
  subtitle: string;
};

export default function AuthBrand({ title, subtitle }: AuthBrandProps) {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">S</Text>
        </View>
        <View>
          <Text className="auth-wordmark">{APP_NAME}</Text>
          <Text className="auth-wordmark-sub">{APP_TAGLINE}</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      <Text className="auth-subtitle">{subtitle}</Text>
    </View>
  );
}
