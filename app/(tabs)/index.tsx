import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white px-4 py-2">Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white px-4 py-2">Go to SignIn</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white px-4 py-2">Go to SignUp</Link>

      <Link href="/(tabs)/subscriptions/spotify" className="mt-4 rounded bg-primary text-white px-4 py-2">Go to Spotify subscription</Link>
      
      <Link href={{
        pathname: "/(tabs)/subscriptions/[id]",
        params: { id: "claude" }
      }} className="mt-4 rounded bg-primary text-white px-4 py-2">Go to Claude subscription</Link>
    </View>
  );
}