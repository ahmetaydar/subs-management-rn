jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock")
);

jest.mock("nativewind", () => ({
  styled: (Component) => Component,
}));