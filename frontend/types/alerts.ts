export type TipConfirmedEvent = {
  creatorId: string;
  amount: number;
  supporterName: string;
  message?: string;
  tipId: string;
  createdAt: string;
};