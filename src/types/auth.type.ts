export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  patient: {
    contactNumber?: string;
  };
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ResendRegistrationOtpPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
