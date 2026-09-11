"use client";

import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function GoogleLoginComponent() {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleLoginSuccess = (credentialResponse: {
    credential?: string;
  }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google Login Failed",
        description:
          "Something went wrong with Google login. Please try again.",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: () => {
          toast.add({
            title: "Google Login Successful",
            description: "You have been successfully logged in.",
            type: "success",
          });
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Google Login Failed",
            description:
              err.message || "Something went wrong. Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleLoginError = () => {
    toast.add({
      title: "Google Login Failed",
      description: "Something went wrong. Please try again.",
      type: "error",
    });
  };

  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
    />
  );
}
