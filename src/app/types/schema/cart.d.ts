interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subTotal: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CartItem {
  _id: string;
  productId: Product;
  variantId: Variant;
  quantity: number;
  price: number;
  total: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
