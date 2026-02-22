export interface SubXConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface Offering {
  id: string;
  lookupKey: string;
  displayName: string;
  isCurrent: boolean;
  packages: Package[];
}

export interface Package {
  id: string;
  lookupKey: string;
  displayName: string;
  products: Product[];
}

export interface Product {
  id: string;
  storeProductId: string;
  type: 'subscription' | 'non_subscription';
  displayName: string;
}

export interface OfferingsResponse {
  currentOffering: Offering | null;
  allOfferings: Offering[];
}

export interface Subscription {
  id: string;
  productId: string;
  store: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  isTrial: boolean;
  autoRenewEnabled: boolean;
  product?: Product;
}

export interface Entitlement {
  id: string;
  lookupKey: string;
  displayName: string;
}

export interface SubscriberResponse {
  appUserId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  subscriptions: Subscription[];
  entitlements: Entitlement[];
  attributes: Record<string, string>;
}

export interface Paywall {
  id: string;
  name: string;
  config: Record<string, any>;
  isActive: boolean;
}

export interface PaywallsResponse {
  paywalls: Paywall[];
}

export interface ReceiptData {
  store: 'app_store' | 'play_store';
  receiptData: string;
  productId: string;
  price?: number;
  currency?: string;
}

export interface ReceiptResponse {
  success: boolean;
  subscription?: Subscription;
}

export interface TrackEventData {
  appUserId?: string;
  eventName: string;
  properties?: Record<string, any>;
}

export interface SubXError {
  statusCode: number;
  message: string;
}
