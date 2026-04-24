import { create } from "zustand";
import type { ProductType } from "./data";

export interface OrderState {
  step: number;
  productType: ProductType;
  // Script flow
  scriptPackageId: string | null;
  expressScript: boolean;
  // Letter paper flow
  letterPaperId: string | null;
  paperQuantity: number;
  // Letter flows
  letterId: string | null;
  textStyleId: string | null;
  deliveryDate: Date | null;
  boxId: string | null;
  giftId: string | null;
  relation: string | null;
  recipientName: string;
  messageContent: string;
  specialNotes: string;
  // Delivery
  address: string;
  city: string;
  pincode: string;
  paymentScreenshot: string | null;
  appliedCoupon: string | null;
  // Customer Details
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientPhone: string;
  primaryContact: "sender" | "recipient";
  // Helpers
  setStep: (s: number) => void;
  setField: (key: string, value: any) => void;
  reset: () => void;
}

const initial = {
  step: 0,
  productType: "letter" as ProductType,
  scriptPackageId: null,
  expressScript: false,
  letterPaperId: null,
  paperQuantity: 1,
  letterId: null,
  textStyleId: null,
  deliveryDate: null,
  boxId: null,
  giftId: null,
  relation: null,
  recipientName: "",
  messageContent: "",
  specialNotes: "",
  address: "",
  city: "",
  pincode: "",
  paymentScreenshot: null,
  appliedCoupon: null,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  recipientPhone: "",
  primaryContact: "sender" as "sender" | "recipient",
};

export const useOrderStore = create<OrderState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setField: (key, value) => set({ [key]: value }),
  reset: () => set(initial),
}));
