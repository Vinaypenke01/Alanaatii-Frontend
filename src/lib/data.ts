export const productTypes = [
  { id: "script", title: "Only Script", from: 200, description: "Get a professionally written script/content for your occasion" },
  { id: "letterPaper", title: "Only Letter Paper", from: 150, description: "Choose a beautiful paper design for your letter" },
  { id: "letter", title: "Only Letter", from: 500, description: "A beautifully crafted personalized letter" },
  { id: "letterBox", title: "Letter + Box", from: 650, description: "Your letter in an elegant premium box" },
  { id: "letterBoxGift", title: "Letter + Box + Gift", from: 900, description: "The complete gifting experience" },
] as const;

export type ProductType = typeof productTypes[number]["id"];

export const scriptPackages = [
  { id: "basic", title: "Basic Script", price: 200, description: "A simple, heartfelt script for your occasion" },
  { id: "premium", title: "Premium Script", price: 350, description: "A detailed, eloquent script with creative flair" },
];

export const expressScriptFee = 100;

export const letterPapers = [
  { id: "classic", title: "Classic Paper", price: 150, description: "Timeless off-white premium paper" },
  { id: "floral", title: "Floral Paper", price: 180, description: "Elegant floral border design" },
  { id: "premium-textured", title: "Premium Textured Paper", price: 250, description: "Thick textured paper with a luxurious feel" },
];

export const letters = [
  { id: "love", title: "Love Letter", price: 500, description: "Express your deepest feelings with a beautifully crafted love letter" },
  { id: "birthday", title: "Birthday Letter", price: 400, description: "Make their birthday unforgettable with heartfelt words" },
  { id: "friendship", title: "Friendship Letter", price: 450, description: "Celebrate a bond that means the world to you" },
];

export const textStyles = [
  { id: "telugu", title: "Telugu", price: 300, description: "Beautiful Telugu calligraphy" },
  { id: "english", title: "English", price: 200, description: "Elegant English typography" },
  { id: "handwritten", title: "Handwritten", price: 350, description: "Authentic handwritten style" },
];

export const boxes = [
  { id: "basic", title: "Basic Box", price: 150, description: "Simple and elegant packaging" },
  { id: "premium", title: "Premium Box", price: 250, description: "Premium quality with gold accents" },
  { id: "luxury", title: "Luxury Box", price: 400, description: "Luxury packaging with satin lining" },
];

export const gifts = [
  { id: "teddy", title: "Teddy Bear", price: 200, description: "Soft and cuddly companion" },
  { id: "chocolate", title: "Chocolate Box", price: 250, description: "Assorted premium chocolates" },
  { id: "flowers", title: "Flower Combo", price: 300, description: "Beautiful floral arrangement" },
  { id: "custom", title: "Custom Gift", price: 0, description: "Contact us for custom options" },
];

export const relations = ["Friend", "Lover", "Parent", "Other"] as const;

export const deliveryCharges: Record<string, number> = {
  "500": 50,
  "600": 70,
};

export function getDeliveryCharge(pincode: string): number {
  const prefix = pincode.substring(0, 3);
  return deliveryCharges[prefix] ?? 100;
}

export const testimonials = [
  { name: "Priya S.", text: "The letter brought tears of joy. Absolutely beautiful craftsmanship!", rating: 5 },
  { name: "Rahul M.", text: "Surprised my partner with the luxury box. She was speechless!", rating: 5 },
  { name: "Ananya K.", text: "Perfect birthday gift. The handwritten letter felt so personal.", rating: 5 },
];
