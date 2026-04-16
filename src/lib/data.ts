export const productTypes = [
  { id: "script", title: "Only Script", from: 200, description: "Get a professionally written script/content for your occasion" },
  { id: "letterPaper", title: "Only Letter Paper", from: 150, description: "Choose a beautiful paper design for your letter" },
  { id: "letter", title: "Only Letter", from: 500, description: "A beautifully crafted personalized letter" },
  { id: "letterBox", title: "Letter + Box", from: 650, description: "Your letter in an elegant premium box" },
  { id: "letterBoxGift", title: "Letter + Box + Gift", from: 900, description: "The complete gifting experience" },
] as const;

export type ProductType = typeof productTypes[number]["id"];

export const scriptPackages = [
  { 
    id: "basic", 
    title: "Basic Script", 
    price: 200, 
    description: "A simple, heartfelt script for your occasion",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "premium", 
    title: "Premium Script", 
    price: 350, 
    description: "A detailed, eloquent script with creative flair",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80"
  },
];

export const expressScriptFee = 100;

export const letterPapers = [
  { 
    id: "classic", 
    title: "Classic Paper", 
    price: 150, 
    description: "Timeless off-white premium paper",
    image: "https://images.unsplash.com/photo-1586075010620-2255bc972b80?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "floral", 
    title: "Floral Paper", 
    price: 180, 
    description: "Elegant floral border design",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "premium-textured", 
    title: "Premium Textured Paper", 
    price: 250, 
    description: "Thick textured paper with a luxurious feel",
    image: "https://images.unsplash.com/photo-1562243061-204550d8a2c9?auto=format&fit=crop&w=300&q=80"
  },
];

export const letters = [
  { 
    id: "love", 
    title: "Love Letter", 
    price: 500, 
    description: "Express your deepest feelings with a beautifully crafted love letter",
    image: "/src/assets/product-letter.jpg"
  },
  { 
    id: "birthday", 
    title: "Birthday Letter", 
    price: 400, 
    description: "Make their birthday unforgettable with heartfelt words",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "friendship", 
    title: "Friendship Letter", 
    price: 450, 
    description: "Celebrate a bond that means the world to you",
    image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=300&q=80"
  },
];

export const textStyles = [
  { 
    id: "telugu", 
    title: "Telugu", 
    price: 300, 
    description: "Beautiful Telugu calligraphy",
    image: "https://images.unsplash.com/photo-1583315752157-9d7a86fd4476?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "english", 
    title: "English", 
    price: 200, 
    description: "Elegant English typography",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "handwritten", 
    title: "Handwritten", 
    price: 350, 
    description: "Authentic handwritten style",
    image: "https://images.unsplash.com/photo-1511108690759-001951591c08?auto=format&fit=crop&w=300&q=80"
  },
];

export const boxes = [
  { 
    id: "basic", 
    title: "Basic Box", 
    price: 150, 
    description: "Simple and elegant packaging",
    image: "/src/assets/product-letterbox.jpg" 
  },
  { 
    id: "premium", 
    title: "Premium Box", 
    price: 250, 
    description: "Premium quality with gold accents",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80" 
  },
  { 
    id: "luxury", 
    title: "Luxury Box", 
    price: 400, 
    description: "Luxury packaging with satin lining",
    image: "https://images.unsplash.com/photo-1552345386-240277ec38c4?auto=format&fit=crop&w=300&q=80" 
  },
];

export const gifts = [
  { 
    id: "teddy", 
    title: "Teddy Bear", 
    price: 200, 
    description: "Soft and cuddly companion",
    image: "https://images.unsplash.com/photo-1559440666-3d75896a2985?auto=format&fit=crop&w=300&q=80" 
  },
  { 
    id: "chocolate", 
    title: "Chocolate Box", 
    price: 250, 
    description: "Assorted premium chocolates",
    image: "https://images.unsplash.com/photo-1548900911-84519910bab8?auto=format&fit=crop&w=300&q=80" 
  },
  { 
    id: "flowers", 
    title: "Flower Combo", 
    price: 300, 
    description: "Beautiful floral arrangement",
    image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=300&q=80" 
  },
  { 
    id: "custom", 
    title: "Custom Gift", 
    price: 0, 
    description: "Contact us for custom options",
    image: "/src/assets/product-giftset.jpg" 
  },
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
