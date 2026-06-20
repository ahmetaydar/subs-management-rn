import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetails    = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>SubscriptionDetails {id}</Text>
      <Link href="/(tabs)/subscriptions" className="mt-4 rounded bg-primary text-white px-4 py-2">Back to Subscriptions</Link>
      <Text className="flex-1 items-center justify-center bg-background">test</Text>
    </View> 
  )
}

export default SubscriptionDetails  