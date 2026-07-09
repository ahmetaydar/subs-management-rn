import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthScreen from "@/components/auth/AuthScreen";
import { APP_NAME } from "@/lib/auth";
import {
  getFieldErrorMessage,
  getGlobalErrorMessage,
  validateCode,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type LocalErrors = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  code?: string | null;
};

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sessionTaskError, setSessionTaskError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFetching = fetchStatus === "fetching" || submitting;
  const needsEmailVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setSessionTaskError(
            "Additional account setup is required before continuing.",
          );
          return;
        }

        setSessionTaskError(null);
        const url = decorateUrl("/");
        router.replace(url as Href);
      },
    });
  };

  const handleSubmit = async () => {
    const nextErrors: LocalErrors = {
      firstName: validateName(firstName, "First name"),
      lastName: validateName(lastName, "Last name"),
      email: validateEmail(emailAddress),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setLocalErrors(nextErrors);
    setFormError(null);
    setSessionTaskError(null);

    if (
      nextErrors.firstName ||
      nextErrors.lastName ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (error) {
        setFormError(
          error.longMessage ||
            error.message ||
            "Unable to create your account. Please try again.",
        );
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setFormError(
          sendError.longMessage ||
            sendError.message ||
            "Account created, but we could not send a verification code.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const codeError = validateCode(code);
    setLocalErrors({ code: codeError });
    setFormError(null);
    setSessionTaskError(null);
    if (codeError) return;

    setSubmitting(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({
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

      if (signUp.status === "complete") {
        await finalizeSignUp();
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
      const { error } = await signUp.verifications.sendEmailCode();
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
    setSessionTaskError(null);
    await signUp.reset();
  };

  if (sessionTaskError) {
    return (
      <AuthScreen
        title="Almost there"
        subtitle="Your account was created, but one more step is required before you can continue."
        bannerError={sessionTaskError}
      >
        <AuthButton
          label="Start over"
          variant="secondary"
          onPress={handleStartOver}
          disabled={isFetching}
        />
      </AuthScreen>
    );
  }

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const bannerError =
    formError ||
    getGlobalErrorMessage(errors.global) ||
    (needsEmailVerification
      ? getFieldErrorMessage(errors.fields.code)
      : getFieldErrorMessage(errors.fields.emailAddress) ||
        getFieldErrorMessage(errors.fields.password) ||
        getFieldErrorMessage(errors.fields.firstName) ||
        getFieldErrorMessage(errors.fields.lastName));

  if (needsEmailVerification) {
    return (
      <AuthScreen
        title="Check your email"
        subtitle={`We sent a 6-digit code to ${emailAddress.trim() || "your inbox"}. Enter it below to activate your account.`}
        bannerError={bannerError}
        footer={
          <View className="auth-link-row">
            <Pressable onPress={handleStartOver} hitSlop={8}>
              <Text className="auth-link">Change email address</Text>
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
          label="Verify email"
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
      title="Create your account"
      subtitle="Start tracking every subscription in one calm, clear place."
      bannerError={bannerError}
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/(auth)/sign-in">
            <Text className="auth-link">Sign in</Text>
          </Link>
        </View>
      }
    >
      <AuthField
        label="First name"
        value={firstName}
        onChangeText={(value) => {
          setFirstName(value);
          if (localErrors.firstName) {
            setLocalErrors((prev) => ({ ...prev, firstName: null }));
          }
        }}
        error={
          localErrors.firstName ||
          getFieldErrorMessage(errors.fields.firstName)
        }
        placeholder="Enter your first name"
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
      />
      <AuthField
        label="Last name"
        value={lastName}
        onChangeText={(value) => {
          setLastName(value);
          if (localErrors.lastName) {
            setLocalErrors((prev) => ({ ...prev, lastName: null }));
          }
        }}
        error={
          localErrors.lastName || getFieldErrorMessage(errors.fields.lastName)
        }
        placeholder="Enter your last name"
        autoCapitalize="words"
        autoComplete="family-name"
        textContentType="familyName"
      />
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
          localErrors.email ||
          getFieldErrorMessage(errors.fields.emailAddress)
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
          if (localErrors.password || localErrors.confirmPassword) {
            setLocalErrors((prev) => ({
              ...prev,
              password: null,
              confirmPassword: null,
            }));
          }
        }}
        error={
          localErrors.password || getFieldErrorMessage(errors.fields.password)
        }
        placeholder="Create a password"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        helper="Use at least 8 characters"
      />
      <AuthField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={(value) => {
          setConfirmPassword(value);
          if (localErrors.confirmPassword) {
            setLocalErrors((prev) => ({ ...prev, confirmPassword: null }));
          }
        }}
        error={localErrors.confirmPassword}
        placeholder="Re-enter your password"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <AuthButton
        label="Create account"
        onPress={handleSubmit}
        loading={isFetching}
        disabled={
          !firstName.trim() ||
          !lastName.trim() ||
          !emailAddress.trim() ||
          !password ||
          !confirmPassword
        }
      />
      {/* Required for bot protection on sign-up */}
      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}
