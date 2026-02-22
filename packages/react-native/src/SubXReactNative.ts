import { SubXClient, SubscriberResponse } from '@subx-dev/sdk';
import { StoreService } from './store/StoreService';
import { mapPurchaseToReceipt } from './store/receiptMapper';
import { CustomerInfo, SubXRNConfig, CustomerInfoUpdateListener } from './types';
import { AppState, AppStateStatus } from 'react-native';
import type { Purchase } from './store/StoreService';
import type { Entitlement } from '@subx-dev/sdk';

function toCustomerInfo(res: SubscriberResponse): CustomerInfo {
  const activeEntitlementIds = res.entitlements.map((e: Entitlement) => e.lookupKey);
  return {
    appUserId: res.appUserId,
    subscriptions: res.subscriptions,
    entitlements: res.entitlements,
    attributes: res.attributes,
    activeEntitlementIds,
  };
}

export class SubXReactNative {
  private static _instance: SubXReactNative;

  static get shared(): SubXReactNative {
    if (!this._instance) {
      this._instance = new SubXReactNative();
    }
    return this._instance;
  }

  private client!: SubXClient;
  private storeService = new StoreService();
  private _appUserId: string | null = null;
  private _customerInfo: CustomerInfo | null = null;
  private _entitlementIds: string[] = [];
  private _configured = false;
  private _listeners: Set<CustomerInfoUpdateListener> = new Set();
  private _appStateSubscription: any = null;
  private _purchaseUpdateSubscription: any = null;
  private _purchaseErrorSubscription: any = null;

  get isConfigured(): boolean {
    return this._configured;
  }

  get appUserId(): string | null {
    return this._appUserId;
  }

  get customerInfo(): CustomerInfo | null {
    return this._customerInfo;
  }

  async configure(config: SubXRNConfig): Promise<void> {
    if (this._configured) return;

    this.client = new SubXClient({ apiKey: config.apiKey, baseUrl: config.baseUrl });
    this._entitlementIds = config.entitlementIds || [];

    await this.storeService.connect();

    this._purchaseUpdateSubscription = this.storeService.addPurchaseUpdatedListener(
      async (purchase: Purchase) => {
        if (!this._appUserId) return;
        try {
          const receipt = mapPurchaseToReceipt(purchase);
          await this.client.submitReceipt(this._appUserId, receipt);
          await this.storeService.finishTransaction(purchase);
          await this.refreshCustomerInfo();
        } catch (err) {
          console.error('[SubX] Purchase processing error:', err);
        }
      }
    );

    this._appStateSubscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && this._appUserId) {
        this.refreshCustomerInfo();
      }
    });

    this._configured = true;
  }

  async identify(appUserId: string): Promise<CustomerInfo> {
    this._appUserId = appUserId;
    const res = await this.client.upsertSubscriber(appUserId);
    this._customerInfo = toCustomerInfo(res);
    this.notifyListeners();
    return this._customerInfo;
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this._appUserId) return null;
    return this.refreshCustomerInfo();
  }

  async purchase(productId: string): Promise<{ success: boolean; customerInfo: CustomerInfo | null }> {
    if (!this._appUserId) throw new Error('User not identified. Call identify() first.');

    const purchase = await this.storeService.requestPurchase(productId);
    if (!purchase) return { success: false, customerInfo: this._customerInfo };

    const receipt = mapPurchaseToReceipt(purchase);
    await this.client.submitReceipt(this._appUserId, receipt);
    await this.storeService.finishTransaction(purchase);
    const info = await this.refreshCustomerInfo();
    return { success: true, customerInfo: info };
  }

  async restore(): Promise<CustomerInfo | null> {
    if (!this._appUserId) throw new Error('User not identified. Call identify() first.');

    const purchases = await this.storeService.getAvailablePurchases();
    for (const purchase of purchases) {
      const receipt = mapPurchaseToReceipt(purchase);
      await this.client.submitReceipt(this._appUserId, receipt);
      await this.storeService.finishTransaction(purchase);
    }
    return this.refreshCustomerInfo();
  }

  async logout(): Promise<void> {
    this._appUserId = null;
    this._customerInfo = null;
    this.notifyListeners();
  }

  addCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  async destroy(): Promise<void> {
    this._purchaseUpdateSubscription?.remove();
    this._purchaseErrorSubscription?.remove();
    this._appStateSubscription?.remove();
    await this.storeService.disconnect();
    this._configured = false;
    this._listeners.clear();
  }

  private async refreshCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this._appUserId) return null;
    try {
      const res = await this.client.getSubscriber(this._appUserId);
      this._customerInfo = toCustomerInfo(res);
      this.notifyListeners();
      return this._customerInfo;
    } catch (err) {
      console.error('[SubX] Failed to refresh customer info:', err);
      return this._customerInfo;
    }
  }

  private notifyListeners(): void {
    if (this._customerInfo) {
      this._listeners.forEach((l) => l(this._customerInfo!));
    }
  }

  getClient(): SubXClient {
    return this.client;
  }

  getStoreService(): StoreService {
    return this.storeService;
  }
}
