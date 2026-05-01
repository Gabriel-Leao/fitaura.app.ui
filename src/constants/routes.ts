import type { Href } from 'expo-router'

export const ROUTES = {
  HOME: { ROUTE: '/' as Href, LABEL: 'Home', NAME: 'index', ICON: 'home' },
  PROFILE: { ROUTE: '/profile' as Href, LABEL: 'Perfil', NAME: 'profile', ICON: 'user-alt' },
  SHOP: { ROUTE: '/shop' as Href, LABEL: 'Loja', NAME: 'shop', ICON: 'shopping-cart' },
  ORDERS: { ROUTE: '/orders' as Href, LABEL: 'Pedidos', NAME: 'orders' },
  SIGN_IN: { ROUTE: '/sign-in' as Href, LABEL: 'Login', NAME: 'sign-in' },
  SIGN_UP: { ROUTE: '/sign-up' as Href, LABEL: 'Criar Conta', NAME: 'sign-up' },
  WORKOUT: { ROUTE: '/workout' as Href, LABEL: 'Treino', NAME: 'workout', ICON: 'dumbbell' },
} as const
