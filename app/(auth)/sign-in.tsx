import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthScreen from "@/components/auth/AuthScreen";
import { APP_NAME } from "@/lib/auth";
import {
  getFieldErrorMessage,
  getGlobalErrorMessage,
  validateCode,
  validateEmail,
  validatePassword,
} from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { Link, type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type LocalErrors = {
  email?: string | null;
  password?: string | null;
  code?: string | null;
};

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFetching = fetchStatus === "fetching" || submitting;
  const needsVerification = signIn.status === "needs_client_trust";

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setFormError(
            "Additional account setup is required before continuing.",
          );
          return;
        }

        const url = decorateUrl("/");
        router.replace(url as Href);
      },
    });
  };

  const handleSubmit = async () => {
    const nextErrors: LocalErrors = {
      email: validateEmail(emailAddress),
      password: validatePassword(password),
    };
    setLocalErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setFormError(
          error.longMessage ||
            error.message ||
            "Unable to sign in. Check your details and try again.",
        );
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
        return;
      }

      if (signIn.status === "needs_second_factor") {
        setFormError(
          "Two-factor authentication is required for this account.",
        );
        return;
      }

      setFormError("Unable to complete sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const codeError = validateCode(code);
    setLocalErrors({ code: codeError });
    setFormError(null);
    if (codeError) return;

    setSubmitting(true);
    try {
      const { error } = await signIn.mfa.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        setFormError(
          error.longMessage ||
            error.message ||
            "Invalid verification code. Please try again.",
        );
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      setFormError("Verification incomplete. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        setFormError(
          error.longMessage || error.message || "Could not resend the code.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = async () => {
    setCode("");
    setLocalErrors({});
    setFormError(null);
    await signIn.reset();
  };

  const bannerError =
    formError ||
    getGlobalErrorMessage(errors.global) ||
    (needsVerification
      ? getFieldErrorMessage(errors.fields.code)
      : getFieldErrorMessage(errors.fields.identifier) ||
        getFieldErrorMessage(errors.fields.password));

  if (needsVerification) {
    return (
      <AuthScreen
        title="Verify it's you"
        subtitle="Enter the 6-digit code we sent to your email to finish signing in."
        bannerError={bannerError}
        footer={
          <View className="auth-link-row">
            <Pressable onPress={handleStartOver} hitSlop={8}>
              <Text className="auth-link">Use a different account</Text>
            </Pressable>
          </View>
        }
      >
        <AuthField
          label="Verification code"
          value={code}
          onChangeText={(value) => {
            setCode(value);
            if (localErrors.code) {
              setLocalErrors((prev) => ({ ...prev, code: null }));
            }
          }}
          error={localErrors.code || getFieldErrorMessage(errors.fields.code)}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={6}
        />
        <AuthButton
          label="Verify and continue"
          onPress={handleVerify}
          loading={isFetching}
          disabled={!code.trim()}
        />
        <AuthButton
          label="Resend code"
          variant="secondary"
          onPress={handleResendCode}
          disabled={isFetching}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
      bannerError={bannerError}
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">New to {APP_NAME}?</Text>
          <Link href="/(auth)/sign-up">
            <Text className="auth-link">Create an account</Text>
          </Link>
        </View>
      }
    >
      <AuthField
        label="Email"
        value={emailAddress}
        onChangeText={(value) => {
          setEmailAddress(value);
          if (localErrors.email) {
            setLocalErrors((prev) => ({ ...prev, email: null }));
          }
        }}
        error={
          localErrors.email || getFieldErrorMessage(errors.fields.identifier)
        }
        placeholder="Enter your email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <AuthField
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (localErrors.password) {
            setLocalErrors((prev) => ({ ...prev, password: null }));
          }
        }}
        error={
          localErrors.password || getFieldErrorMessage(errors.fields.password)
        }
        placeholder="Enter your password"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
      <AuthButton
        label="Sign in"
        onPress={handleSubmit}
        loading={isFetching}
        disabled={!emailAddress.trim() || !password}
      />
    </AuthScreen>
  );
}
