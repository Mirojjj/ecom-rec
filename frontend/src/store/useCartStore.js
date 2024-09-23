import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addItem: (item) =>
    set((state) => {
      console.log(item.ProdID);
      const existingItem = state.cart.find((i) => i.ProdID === item.ProdID);
      console.log(existingItem);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.ProdID === item.ProdID ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.ProdID !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      // If the quantity is 0, remove the item from the cart
      // console.log(typeof quantity);
      if (quantity < 0) {
        console.log("del");
        return {
          cart: state.cart.filter((item) => item.ProdID !== itemId),
        };
      }

      // Otherwise, update the item's quantity
      return {
        cart: state.cart.map((item) =>
          item.ProdID === itemId ? { ...item, quantity } : item
        ),
      };
    }),

  clearCart: () => set({ cart: [] }),

  // cartTotal: () =>
  //   set((state) => {
  //     const total = state.cart.reduce((acc, item) => {
  //       return acc + item.Price * item.quantity;
  //     }, 0);
  //     return { total };
  //   }),
}));
