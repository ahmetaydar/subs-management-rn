import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from "zustand";

type SubscriptionsState = {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
};

export const useSubscriptionsStore = create<SubscriptionsState>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({
      subscriptions: [subscription, ...state.subscriptions],
    })),
}));
