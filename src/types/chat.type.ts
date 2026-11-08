export interface IChatDoctor {
  id: string;
  name: string;
  specialization: string;
  consultationFee: string | null;
}

export interface IChatPayload {
  message: string;
  sessionId?: string;
}

export interface IChatResponse {
  sessionId: string;
  answer: string;
  doctors: IChatDoctor[];
}
