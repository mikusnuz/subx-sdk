import { Subscription, Entitlement, Offering, Package } from '@subx-dev/sdk';

export type StoreName = 'app_store' | 'play_store';

export interface StoreProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  localizedPrice: string;
  subscriptionPeriod?: string;
}

export interface PurchaseResult {
  success: boolean;
  subscription?: Subscription;
}

export interface PackageWithStoreProducts extends Package {
  storeProducts: StoreProduct[];
}

export interface OfferingWithStoreProducts extends Offering {
  packagesWithProducts: PackageWithStoreProducts[];
}

export interface CustomerInfo {
  appUserId: string;
  subscriptions: Subscription[];
  entitlements: Entitlement[];
  attributes: Record<string, string>;
  activeEntitlementIds: string[];
}

export interface SubXRNConfig {
  apiKey: string;
  baseUrl?: string;
  entitlementIds?: string[];
}

export type CustomerInfoUpdateListener = (info: CustomerInfo) => void;
