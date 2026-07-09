import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Pressable } from "react-native";
import App from "./index";

// Mutable fixtures referenced by the jest.mock factory below. Jest's module
// hoisting allows identifiers prefixed with "mock" to be used inside
// jest.mock factories even though the factory is hoisted above these
// declarations.
let mockHomeSubscriptions: Subscription[] = [];
let mockUpcomingSubscriptions: UpcomingSubscription[] = [];

const NETFLIX: Subscription = {
  id: "netflix",
  icon: 1 as unknown as Subscription["icon"],
  name: "Netflix",
  plan: "Standard",
  category: "Entertainment",
  paymentMethod: "Visa ending in 1234",
  status: "active",
  startDate: "2024-01-01T00:00:00.000Z",
  price: 15.49,
  currency: "USD",
  billing: "Monthly",
  renewalDate: "2026-08-01T00:00:00.000Z",
  color: "#e50914",
};

const SPOTIFY: Subscription = {
  id: "spotify",
  icon: 1 as unknown as Subscription["icon"],
  name: "Spotify",
  plan: "Premium",
  category: "Music",
  paymentMethod: "Mastercard ending in 5678",
  status: "active",
  startDate: "2023-05-01T00:00:00.000Z",
  price: 9.99,
  currency: "USD",
  billing: "Monthly",
  renewalDate: "2026-09-01T00:00:00.000Z",
  color: "#1db954",
};

jest.mock("@/constants/data", () => ({
  get HOME_SUBSCRIPTIONS() {
    return mockHomeSubscriptions;
  },
  get UPCOMING_SUBSCRIPTIONS() {
    return mockUpcomingSubscriptions;
  },
  HOME_USER: { name: "Jane Doe" },
  HOME_BALANCE: { amount: 1234.56, nextRenewalDate: "2026-08-01T00:00:00.000Z" },
}));

describe("Home tab (App)", () => {
  beforeEach(() => {
    mockHomeSubscriptions = [NETFLIX, SPOTIFY];
    mockUpcomingSubscriptions = [];
  });

  const getCardPressables = () => screen.UNSAFE_getAllByType(Pressable);

  it("renders the header, balance and every subscription in the list", () => {
    render(<App />);

    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("Netflix")).toBeTruthy();
    expect(screen.getByText("Spotify")).toBeTruthy();
  });

  it("renders the empty state when there are no upcoming subscriptions", () => {
    render(<App />);

    expect(screen.getByText("No upcoming subscriptions")).toBeTruthy();
  });

  it("renders the empty state when there are no subscriptions at all", () => {
    mockHomeSubscriptions = [];
    render(<App />);

    expect(screen.getByText("No subscriptions")).toBeTruthy();
    expect(screen.queryByText("Netflix")).toBeNull();
  });

  it("does not show any subscription details until a card is pressed", () => {
    render(<App />);

    expect(screen.queryByText("Visa ending in 1234")).toBeNull();
    expect(screen.queryByText("Mastercard ending in 5678")).toBeNull();
  });

  it("expands a subscription card when it is pressed", () => {
    render(<App />);

    const [netflixCard] = getCardPressables();
    fireEvent.press(netflixCard);

    expect(screen.getByText("Visa ending in 1234")).toBeTruthy();
  });

  it("collapses an expanded subscription card when it is pressed again", () => {
    render(<App />);

    const [netflixCard] = getCardPressables();
    fireEvent.press(netflixCard);
    expect(screen.getByText("Visa ending in 1234")).toBeTruthy();

    fireEvent.press(netflixCard);
    expect(screen.queryByText("Visa ending in 1234")).toBeNull();
  });

  it("only keeps one subscription expanded at a time", () => {
    render(<App />);

    const [netflixCard, spotifyCard] = getCardPressables();

    fireEvent.press(netflixCard);
    expect(screen.getByText("Visa ending in 1234")).toBeTruthy();
    expect(screen.queryByText("Mastercard ending in 5678")).toBeNull();

    fireEvent.press(spotifyCard);
    expect(screen.queryByText("Visa ending in 1234")).toBeNull();
    expect(screen.getByText("Mastercard ending in 5678")).toBeTruthy();
  });
});