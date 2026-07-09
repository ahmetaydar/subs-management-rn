import clsx from "clsx";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { colors } from "@/constants/theme";

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  secureTextEntry?: boolean;
  helper?: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "secureTextEntry">;

export default function AuthField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  helper,
  ...inputProps
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isSecure = secureTextEntry && !visible;

  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      {secureTextEntry ? (
        <View
          className={clsx("auth-input-row", error && "auth-input-row-error")}
        >
          <TextInput
            className="auth-input-flex"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isSecure}
            placeholderTextColor={colors.mutedForeground}
            autoCorrect={false}
            {...inputProps}
          />
          <Pressable
            className="auth-input-action"
            onPress={() => setVisible((prev) => !prev)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Text className="auth-input-action-text">
              {visible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <TextInput
          className={clsx("auth-input", error && "auth-input-error")}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.mutedForeground}
          autoCorrect={false}
          {...inputProps}
        />
      )}
      {error ? <Text className="auth-error">{error}</Text> : null}
      {!error && helper ? <Text className="auth-helper">{helper}</Text> : null}
    </View>
  );
}
