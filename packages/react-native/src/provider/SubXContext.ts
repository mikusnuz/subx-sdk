import { createContext } from 'react';
import { CustomerInfo } from '../types';

export interface SubXContextType {
  isReady: boolean;
  appUserId: string | null;
  customerInfo: CustomerInfo | null;
  isPro: boolean;
  isEntitled: (entitlementId: string) => boolean;
  identify: (userId: string) => Promise<CustomerInfo>;
  purchase: (productId: string) => Promise<{ success: boolean; customerInfo: CustomerInfo | null }>;
  restore: () => Promise<CustomerInfo | null>;
  logout: () => Promise<void>;
}

export const SubXContext = createContext<SubXContextType>({
  isReady: false,
  appUserId: null,
  customerInfo: null,
  isPro: false,
  isEntitled: () => false,
  identify: async () => ({
    appUserId: '',
    subscriptions: [],
    entitlements: [],
    attributes: {},
    activeEntitlementIds: [],
  }),
  purchase: async () => ({ success: false, customerInfo: null }),
  restore: async () => null,
  logout: async () => {},
});
