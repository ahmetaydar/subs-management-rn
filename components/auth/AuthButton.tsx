import clsx from "clsx";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from "react-native";
import { colors } from "@/constants/theme";

type AuthButtonProps = {
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
} & Omit<PressableProps, "children">;

export default function AuthButton({
  label,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <Pressable
      className={clsx(
        isPrimary ? "auth-button" : "auth-secondary-button",
        isDisabled && isPrimary && "auth-button-disabled",
        isDisabled && !isPrimary && "opacity-50",
      )}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      style={({ pressed }) => [{ opacity: pressed && !isDisabled ? 0.85 : 1 }]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.primary : colors.accent}
        />
      ) : (
        <Text
          className={
            isPrimary ? "auth-button-text" : "auth-secondary-button-text"
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
