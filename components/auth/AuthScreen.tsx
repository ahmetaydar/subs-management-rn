import AuthBrand from "@/components/auth/AuthBrand";
import { styled } from "nativewind";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  bannerError?: string | null;
};

export default function AuthScreen({
  title,
  subtitle,
  children,
  footer,
  bannerError,
}: AuthScreenProps) {
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <AuthBrand title={title} subtitle={subtitle} />

            <View className="auth-card">
              {bannerError ? (
                <View className="auth-banner-error mb-4">
                  <Text className="auth-banner-error-text">{bannerError}</Text>
                </View>
              ) : null}
              <View className="auth-form">{children}</View>
            </View>

            {footer}

            <View className="auth-trust">
              <Text className="auth-trust-text">
                Your account is protected with encrypted sessions.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
