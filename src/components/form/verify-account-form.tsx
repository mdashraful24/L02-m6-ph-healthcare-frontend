"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useResendRegistrationOtp,
  useVerifyAccount,
  useVerifyDoctorAccount,
} from "@/hooks";
import { resendRegistrationOtpSchema } from "@/validation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function VerifyAccountForm({
  mode = "patient",
}: {
  mode: "doctor" | "patient";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const { mutate: resendOtp, isPending: resendPending } =
    useResendRegistrationOtp();

  const { mutate: verifyPatientAccount, isPending: verifyPatientPending } =
    useVerifyAccount();
  const { mutate: verifyDoctorAccount, isPending: verifyDoctorPending } =
    useVerifyDoctorAccount();

  const verify = mode === "doctor" ? verifyDoctorAccount : verifyPatientAccount;

  const email = searchParams.get("email") || "";

  const [expiresAt, setExpiresAt] = useState(
    searchParams.get("expiresAt") || "",
  );
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();
    const updateRemaining = () => {
      const seconds = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds <= 0) {
        clearInterval(timerId);
      }
    };

    updateRemaining();
    const timerId = setInterval(updateRemaining, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  const isOtpExpired = Boolean(expiresAt) && remaining <= 0;

  const formatRemainingTime = () => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleOTP = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    const verifyData = {
      email,
      otp,
    };

    verify(verifyData, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Verification Failed",
            description: "Something went wrong. Please try again.",
            type: "error",
          });
          return;
        }

        if (mode === "doctor") {
          toast.add({
            title: "Verification Successful",
            description:
              "An admin will review your application and verify your account. This may take some time. You will be notified via email once your account is verified.",
            type: "success",
          });
          router.push("/");
          return;
        }

        toast.add({
          title: "Verification Successful",
          description: "Your account has been verified successfully.",
          type: "success",
        });
        router.push("/");
      },
      onError: (err) => {
        toast.add({
          title: "Verification Failed",
          description: err.message || "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleResendOTP = () => {
    const validation = resendRegistrationOtpSchema.safeParse({ email });

    if (!validation.success) {
      toast.add({
        title: "Resend Failed",
        description: "Please provide a valid email address.",
        type: "error",
      });
      return;
    }

    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Resend Failed",
              description: "Something went wrong. Please try again.",
              type: "error",
            });
            return;
          }

          toast.add({
            title: "OTP Sent",
            description: "A new verification OTP has been sent to your email.",
            type: "success",
          });
          setOtp("");

          if (res?.data?.expiresAt) {
            setExpiresAt(res.data.expiresAt);
          }
        },
        onError: (err) => {
          toast.add({
            title: "Resend Failed",
            description:
              err.message || "Something went wrong. Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  if (!email) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Please provide the OTP we sent to your email address.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOTP();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              onChange={(value) => {
                setOtp(value);
                if (isInvalid) {
                  setIsInvalid(false);
                }
              }}
              value={otp}
              autoComplete="off"
              name="otp"
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {isInvalid && (
              <FieldError
                errors={[{ message: "Invalid OTP. Please try again." }]}
              />
            )}
            {isOtpExpired ? (
              <FieldDescription>
                OTP expired. Please resend a new one.
              </FieldDescription>
            ) : (
              expiresAt && (
                <FieldDescription>
                  OTP expires in {formatRemainingTime()}
                </FieldDescription>
              )
            )}
          </Field>
        </form>
      </CardContent>

      <CardFooter>
        <Button onClick={handleResendOTP} disabled={resendPending}>
          {resendPending ? (
            <>
              <Spinner />
              Resending...
            </>
          ) : (
            "Resend OTP"
          )}
        </Button>
        <Button
          type="submit"
          form="otp-form"
          disabled={verifyDoctorPending || isOtpExpired}
        >
          {verifyDoctorPending ? (
            <>
              <Spinner />
              Verifying account...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
