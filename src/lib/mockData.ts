// Mock data for dashboards

export type OrderStatus =
  | "payment_pending"
  | "order_placed"
  | "assigned_to_writer"
  | "accepted_by_writer"
  | "script_in_progress"
  | "script_submitted"
  | "customer_review"
  | "revision_requested"
  | "approved"
  | "under_writing"
  | "out_for_delivery"
  | "delivered";

export type ProductType = "script" | "letterPaper" | "letter" | "letterBox" | "letterBoxGift";

export interface ScriptWriter {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  productType: ProductType;
  letterType: string;
  textStyle: string;
  box: string | null;
  gift: string | null;
  recipientName: string;
  relation: string;
  status: OrderStatus;
  total: number;
  paymentScreenshot?: string;
  deliveryDate: string;
  address: string;
  city: string;
  pincode: string;
  createdAt: string;
  scriptContent?: string;
  scriptApproved?: boolean;
  assignedWriterId?: string;
  revisionFeedback?: string;
  scriptVersions?: { version: number; content: string; date: string }[];
  userAnswers?: { question: string; answer: string }[];
  tone?: string;
  // Script-only fields
  scriptPackage?: string;
  expressScript?: boolean;
  // Letter paper fields
  paperType?: string;
  paperQuantity?: number;
}

export const statusLabels: Record<OrderStatus, string> = {
  payment_pending: "Payment Pending",
  order_placed: "Order Placed",
  assigned_to_writer: "Assigned to Writer",
  accepted_by_writer: "Accepted by Writer",
  script_in_progress: "Script in Progress",
  script_submitted: "Script Submitted",
  customer_review: "Customer Review",
  revision_requested: "Revision Requested",
  approved: "Approved",
  under_writing: "Under Writing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export const statusOrder: OrderStatus[] = [
  "payment_pending",
  "order_placed",
  "assigned_to_writer",
  "accepted_by_writer",
  "script_in_progress",
  "script_submitted",
  "customer_review",
  "approved",
  "under_writing",
  "out_for_delivery",
  "delivered",
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "script" | "delivery" | "feedback" | "assignment" | "revision" | "approval";
  read: boolean;
  createdAt: string;
  targetRole?: "user" | "writer" | "admin";
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
}

export interface AdminLetter {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface AdminTextStyle {
  id: string;
  title: string;
  price: number;
}

export interface AdminBox {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface AdminGift {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface AdminQuestion {
  id: string;
  relation: string;
  question: string;
}

export interface AdminScriptPackage {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface AdminLetterPaper {
  id: string;
  title: string;
  price: number;
  description: string;
}

export const mockWriters: ScriptWriter[] = [
  { id: "w1", name: "Priya Sharma", email: "priya@alanaatii.com", status: "active" },
  { id: "w2", name: "Arun Kumar", email: "arun@alanaatii.com", status: "active" },
  { id: "w3", name: "Sneha Reddy", email: "sneha@alanaatii.com", status: "inactive" },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    productType: "letterBoxGift",
    letterType: "Love Letter",
    textStyle: "Handwritten",
    box: "Premium Box",
    gift: "Teddy Bear",
    recipientName: "Meera",
    relation: "Lover",
    status: "customer_review",
    total: 1300,
    deliveryDate: "2026-05-01",
    address: "123, Rose Street",
    city: "Hyderabad",
    pincode: "500001",
    createdAt: "2026-04-05",
    assignedWriterId: "w1",
    tone: "Romantic & Poetic",
    scriptContent: "Dearest Meera,\n\nEvery moment with you feels like a beautiful dream that I never want to wake up from. Your smile lights up my world in ways words can barely capture...\n\nWith all my love,\nYours forever",
    scriptApproved: false,
    scriptVersions: [
      { version: 1, content: "Dearest Meera,\n\nEvery moment with you feels like a beautiful dream...", date: "2026-04-08" },
    ],
    userAnswers: [
      { question: "What is your favorite memory together?", answer: "Our first trip to Goa, watching the sunset on the beach." },
      { question: "What do you love most about them?", answer: "Her infectious laugh and the way she cares for everyone around her." },
    ],
  },
  {
    id: "ORD-002",
    productType: "letter",
    letterType: "Birthday Letter",
    textStyle: "English",
    box: null,
    gift: null,
    recipientName: "Ravi",
    relation: "Friend",
    status: "delivered",
    total: 600,
    deliveryDate: "2026-04-02",
    address: "45, MG Road",
    city: "Chennai",
    pincode: "600001",
    createdAt: "2026-03-20",
    assignedWriterId: "w2",
    tone: "Fun & Casual",
    scriptApproved: true,
    scriptContent: "Hey Ravi! 🎉\n\nAnother year older, another year wiser...",
    scriptVersions: [{ version: 1, content: "Hey Ravi! 🎉\n\nAnother year older...", date: "2026-03-25" }],
    userAnswers: [{ question: "How did you meet?", answer: "We were college roommates in first year." }],
  },
  {
    id: "ORD-003",
    productType: "letterBox",
    letterType: "Friendship Letter",
    textStyle: "Telugu",
    box: "Luxury Box",
    gift: null,
    recipientName: "Anu",
    relation: "Friend",
    status: "assigned_to_writer",
    total: 1400,
    deliveryDate: "2026-05-15",
    address: "78, Lake View",
    city: "Bangalore",
    pincode: "560001",
    createdAt: "2026-04-08",
    assignedWriterId: "w1",
    tone: "Warm & Heartfelt",
    userAnswers: [{ question: "How did you meet?", answer: "We grew up as neighbors." }],
  },
  {
    id: "ORD-004",
    productType: "script",
    letterType: "Premium Script",
    textStyle: "",
    box: null,
    gift: null,
    recipientName: "Kavya",
    relation: "Lover",
    status: "script_in_progress",
    total: 450,
    deliveryDate: "",
    address: "",
    city: "",
    pincode: "",
    createdAt: "2026-04-10",
    assignedWriterId: "w2",
    tone: "Romantic & Deep",
    scriptPackage: "Premium Script",
    expressScript: true,
    userAnswers: [
      { question: "What is your favorite memory together?", answer: "The surprise birthday party she threw for me." },
    ],
  },
  {
    id: "ORD-005",
    productType: "letterPaper",
    letterType: "Floral Paper",
    textStyle: "",
    box: null,
    gift: null,
    recipientName: "Self",
    relation: "Other",
    status: "out_for_delivery",
    total: 410,
    deliveryDate: "2026-05-10",
    address: "56, Temple Street",
    city: "Delhi",
    pincode: "110001",
    createdAt: "2026-04-07",
    paperType: "Floral Paper",
    paperQuantity: 2,
  },
  {
    id: "ORD-006",
    productType: "letterBoxGift",
    letterType: "Anniversary Letter",
    textStyle: "Handwritten",
    box: "Luxury Box",
    gift: "Flower Combo",
    recipientName: "Aditi",
    relation: "Wife",
    status: "payment_pending",
    total: 1850,
    paymentScreenshot: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=300&h=400",
    deliveryDate: "2026-05-20",
    address: "Banjara Hills",
    city: "Hyderabad",
    pincode: "500034",
    createdAt: "2026-04-14",
    tone: "Romantic"
  },
  {
    id: "ORD-007",
    productType: "script",
    letterType: "Apology Script",
    textStyle: "",
    box: null,
    gift: null,
    recipientName: "Rahul",
    relation: "Brother",
    status: "payment_pending",
    total: 350,
    paymentScreenshot: "https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=300&h=400",
    deliveryDate: "",
    address: "",
    city: "",
    pincode: "",
    createdAt: "2026-04-14",
    tone: "Sincere"
  },
  {
    id: "ORD-008",
    productType: "letter",
    letterType: "Graduation Letter",
    textStyle: "English",
    box: null,
    gift: null,
    recipientName: "Siddharth",
    relation: "Son",
    status: "payment_pending",
    total: 550,
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=300&h=400",
    deliveryDate: "2026-05-25",
    address: "Indiranagar",
    city: "Bangalore",
    pincode: "560038",
    createdAt: "2026-04-15",
    tone: "Proud & Encouraging"
  },
  {
    id: "ORD-009",
    productType: "letterBox",
    letterType: "Thank You Letter",
    textStyle: "Telugu",
    box: "Premium Box",
    gift: null,
    recipientName: "Dr. Lakshmi",
    relation: "Mentor",
    status: "payment_pending",
    total: 1100,
    paymentScreenshot: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=300&h=400",
    deliveryDate: "2026-06-01",
    address: "Anna Nagar",
    city: "Chennai",
    pincode: "600040",
    createdAt: "2026-04-15",
    tone: "Respectful"
  },
];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Script Ready for Review", message: "Your love letter script for Meera is ready.", type: "script", read: false, createdAt: "2026-04-09", targetRole: "user" },
  { id: "n2", title: "Order Delivered!", message: "Your birthday letter for Ravi has been delivered.", type: "delivery", read: true, createdAt: "2026-04-02", targetRole: "user" },
  { id: "n3", title: "Share Your Feedback", message: "How was your experience with order ORD-002?", type: "feedback", read: false, createdAt: "2026-04-03", targetRole: "user" },
  { id: "n4", title: "New Script Assignment", message: "You've been assigned to write a script for ORD-003.", type: "assignment", read: false, createdAt: "2026-04-08", targetRole: "writer" },
  { id: "n5", title: "Revision Requested", message: "Customer requested changes on ORD-005.", type: "revision", read: false, createdAt: "2026-04-10", targetRole: "writer" },
  { id: "n6", title: "Script Approved! 🎉", message: "Your script for ORD-002 has been approved.", type: "approval", read: true, createdAt: "2026-03-27", targetRole: "writer" },
  { id: "n7", title: "Script Approved by Customer", message: "ORD-002 script approved.", type: "approval", read: true, createdAt: "2026-03-27", targetRole: "admin" },
  { id: "n8", title: "Writer Accepted Order", message: "Priya Sharma accepted ORD-003.", type: "assignment", read: false, createdAt: "2026-04-08", targetRole: "admin" },
];

export const mockCoupons: Coupon[] = [
  { id: "c1", code: "LOVE20", discount: 20, active: true },
  { id: "c2", code: "FIRST10", discount: 10, active: true },
  { id: "c3", code: "BIRTHDAY15", discount: 15, active: false },
  { id: "c4", code: "START20", discount: 20, active: true },
];

export const mockAdminLetters: AdminLetter[] = [
  { id: "l1", title: "Love Letter", price: 500, description: "Express your deepest feelings" },
  { id: "l2", title: "Birthday Letter", price: 400, description: "Make their birthday unforgettable" },
  { id: "l3", title: "Friendship Letter", price: 450, description: "Celebrate a bond that means the world" },
];

export const mockAdminTextStyles: AdminTextStyle[] = [
  { id: "ts1", title: "Telugu", price: 300 },
  { id: "ts2", title: "English", price: 200 },
  { id: "ts3", title: "Handwritten", price: 350 },
];

export const mockAdminBoxes: AdminBox[] = [
  { id: "b1", title: "Basic Box", price: 150, description: "Simple and elegant" },
  { id: "b2", title: "Premium Box", price: 250, description: "Premium quality with gold accents" },
  { id: "b3", title: "Luxury Box", price: 400, description: "Luxury packaging with satin lining" },
];

export const mockAdminGifts: AdminGift[] = [
  { id: "g1", title: "Teddy Bear", price: 200, description: "Soft and cuddly" },
  { id: "g2", title: "Chocolate Box", price: 250, description: "Assorted premium chocolates" },
  { id: "g3", title: "Flower Combo", price: 300, description: "Beautiful floral arrangement" },
];

export const mockAdminQuestions: AdminQuestion[] = [
  { id: "q1", relation: "Lover", question: "What is your favorite memory together?" },
  { id: "q2", relation: "Lover", question: "What do you love most about them?" },
  { id: "q3", relation: "Friend", question: "How did you meet?" },
  { id: "q4", relation: "Parent", question: "What lesson did they teach you?" },
];

export const mockAdminScriptPackages: AdminScriptPackage[] = [
  { id: "sp1", title: "Basic Script", price: 200, description: "A simple, heartfelt script" },
  { id: "sp2", title: "Premium Script", price: 350, description: "Detailed, eloquent script with creative flair" },
];

export const mockAdminLetterPapers: AdminLetterPaper[] = [
  { id: "lp1", title: "Classic Paper", price: 150, description: "Timeless off-white premium paper" },
  { id: "lp2", title: "Floral Paper", price: 180, description: "Elegant floral border design" },
  { id: "lp3", title: "Premium Textured Paper", price: 250, description: "Thick textured paper with a luxurious feel" },
];

export const productTypeLabels: Record<ProductType, string> = {
  script: "Only Script",
  letterPaper: "Only Letter Paper",
  letter: "Only Letter",
  letterBox: "Letter + Box",
  letterBoxGift: "Letter + Box + Gift",
};

export function getWriterById(id: string): ScriptWriter | undefined {
  return mockWriters.find((w) => w.id === id);
}
