import AuthButton from "@/components/auth/AuthButton";
import { colors } from "@/constants/theme";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Your account";
  const email = user?.primaryEmailAddress?.emailAddress;

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch {
      setSignOutError("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
      <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
        Manage your account and preferences.
      </Text>

      <View className="mt-8 rounded-3xl border border-border bg-card p-5">
        <Text className="text-sm font-sans-semibold text-muted-foreground">
          Signed in as
        </Text>
        <Text className="mt-2 text-xl font-sans-bold text-primary">
          {displayName}
        </Text>
        {email ? (
          <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
            {email}
          </Text>
        ) : null}

        {signOutError ? (
          <Text className="mt-4 text-sm font-sans-medium text-destructive">
            {signOutError}
          </Text>
        ) : null}

        <View className="mt-6">
          <AuthButton
            label="Sign out"
            onPress={handleSignOut}
            loading={signingOut}
          />
        </View>
      </View>

      <Text
        className="mt-6 text-center text-xs font-sans-medium"
        style={{ color: colors.mutedForeground }}
      >
        Sessions stay encrypted on this device until you sign out.
      </Text>
    </SafeAreaView>
  );
};

export default Settings;
