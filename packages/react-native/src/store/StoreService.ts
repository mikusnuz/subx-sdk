import { StoreProduct } from '../types';

// Detect Expo Go to skip loading react-native-iap entirely
// (NitroModules throws a global error in Expo Go on require)
function isExpoGo(): boolean {
  try {
    const Constants = require('expo-constants');
    const c = Constants.default || Constants;
    return c.appOwnership === 'expo';
  } catch {
    return false;
  }
}

let _iap: typeof import('react-native-iap') | null = null;
let _iapChecked = false;

function getIAP() {
  if (!_iapChecked) {
    _iapChecked = true;
    if (isExpoGo()) {
      console.warn('[SubX] Expo Go detected — IAP disabled');
      _iap = null;
    } else {
      try {
        _iap = require('react-native-iap');
      } catch {
        _iap = null;
      }
    }
  }
  return _iap;
}

export type Purchase = import('react-native-iap').Purchase;
export type PurchaseError = import('react-native-iap').PurchaseError;

export class StoreService {
  private connected = false;

  get isAvailable(): boolean {
    return getIAP() !== null;
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    const iap = getIAP();
    if (!iap) return;
    await iap.initConnection();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;
    const iap = getIAP();
    if (!iap) return;
    await iap.endConnection();
    this.connected = false;
  }

  async getProducts(skus: string[]): Promise<StoreProduct[]> {
    const iap = getIAP();
    if (!iap || skus.length === 0) return [];
    const products = await iap.fetchProducts({ skus });
    if (!products) return [];
    return products.map((p: any) => ({
      productId: p.productId || p.id || '',
      title: p.title || '',
      description: p.description || '',
      price: p.price != null ? String(p.price) : '0',
      currency: p.currency || 'USD',
      localizedPrice: p.localizedPrice || p.displayPrice || p.price || '0',
    }));
  }

  async requestPurchase(sku: string): Promise<Purchase | null> {
    const iap = getIAP();
    if (!iap) throw new Error('IAP not available in this environment');
    try {
      const result = await (iap.requestPurchase as any)({ skus: [sku] });
      if (!result) return null;
      if (Array.isArray(result)) return result[0] || null;
      return result;
    } catch (err: any) {
      if (err.code === 'E_USER_CANCELLED' || err.code === 'user-cancelled') return null;
      throw err;
    }
  }

  async getAvailablePurchases(): Promise<Purchase[]> {
    const iap = getIAP();
    if (!iap) return [];
    const result = await iap.getAvailablePurchases();
    return result || [];
  }

  async finishTransaction(purchase: Purchase, isConsumable = false): Promise<void> {
    const iap = getIAP();
    if (!iap) return;
    await iap.finishTransaction({ purchase, isConsumable });
  }

  addPurchaseUpdatedListener(listener: (purchase: Purchase) => void) {
    const iap = getIAP();
    if (!iap) return { remove: () => {} };
    return iap.purchaseUpdatedListener(listener);
  }

  addPurchaseErrorListener(listener: (error: PurchaseError) => void) {
    const iap = getIAP();
    if (!iap) return { remove: () => {} };
    return iap.purchaseErrorListener(listener);
  }
}
