// <ai_context>
// Propósito: Global state management for the application's UI preferences and Shopping Cart using Zustand.
// Dependencias: zustand, zustand/middleware
// Mantenimiento Seguro: Add new state variables and actions by extending the `AppStore` interface.
// </ai_context>

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number | string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    brand?: string;
    size?: string;
    color?: string;
}

export interface AppStore {
  theme: 'light' | 'dark';
  primaryColor: string;
  activeColor: string;
  isCartDrawerOpen: boolean;
  cartItems: CartItem[];

  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  setActiveColor: (color: string) => void;
  toggleCartDrawer: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      primaryColor: '#000000',
      activeColor: '#0B3022',
      isCartDrawerOpen: false,
      cartItems: [],

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setPrimaryColor: (color: string) => set(() => ({ primaryColor: color })),
      setActiveColor: (color: string) => set(() => ({ activeColor: color })),
      
      toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      
      addToCart: (item) => set((state) => {
          const existing = state.cartItems.find(i => i.id === item.id);
          if (existing) {
              return { 
                  cartItems: state.cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i),
                  isCartDrawerOpen: true
              };
          }
          return { 
              cartItems: [...state.cartItems, { ...item, quantity: 1 }],
              isCartDrawerOpen: true 
          };
      }),
      
      removeFromCart: (id) => set((state) => ({
          cartItems: state.cartItems.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
          cartItems: state.cartItems.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),

      clearCart: () => set(() => ({ cartItems: [], isCartDrawerOpen: false }))
    }),
    {
      name: 'joppa-app-store',
    }
  )
);
