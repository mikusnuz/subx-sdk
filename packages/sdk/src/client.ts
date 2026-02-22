import {
  SubXConfig,
  OfferingsResponse,
  SubscriberResponse,
  PaywallsResponse,
  ReceiptData,
  ReceiptResponse,
  TrackEventData,
} from './types';

export class SubXClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: SubXConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.subx.dev').replace(/\/$/, '');
  }

  // Offerings

  async getOfferings(): Promise<OfferingsResponse> {
    return this.request<OfferingsResponse>('GET', '/v1/offerings');
  }

  async getOfferingPaywalls(offeringId: string): Promise<PaywallsResponse> {
    return this.request<PaywallsResponse>('GET', `/v1/offerings/${offeringId}/paywalls`);
  }

  // Subscribers

  async getSubscriber(appUserId: string): Promise<SubscriberResponse> {
    return this.request<SubscriberResponse>('GET', `/v1/subscribers/${encodeURIComponent(appUserId)}`);
  }

  async upsertSubscriber(
    appUserId: string,
    attributes?: Record<string, string>,
  ): Promise<SubscriberResponse> {
    return this.request<SubscriberResponse>(
      'POST',
      `/v1/subscribers/${encodeURIComponent(appUserId)}`,
      attributes ? { attributes } : undefined,
    );
  }

  async submitReceipt(appUserId: string, receipt: ReceiptData): Promise<ReceiptResponse> {
    return this.request<ReceiptResponse>(
      'POST',
      `/v1/subscribers/${encodeURIComponent(appUserId)}/receipts`,
      receipt,
    );
  }

  async getSubscriberOfferings(appUserId: string): Promise<OfferingsResponse> {
    return this.request<OfferingsResponse>(
      'GET',
      `/v1/subscribers/${encodeURIComponent(appUserId)}/offerings`,
    );
  }

  // Entitlements

  async grantEntitlement(
    appUserId: string,
    entitlementId: string,
    expiresAt?: string,
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      'POST',
      `/v1/subscribers/${encodeURIComponent(appUserId)}/entitlements`,
      expiresAt ? { entitlementId, expiresAt } : { entitlementId },
    );
  }

  async revokeEntitlement(
    appUserId: string,
    entitlementId: string,
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      'DELETE',
      `/v1/subscribers/${encodeURIComponent(appUserId)}/entitlements/${entitlementId}`,
    );
  }

  // Events

  async trackEvent(event: TrackEventData): Promise<void> {
    await this.request<void>('POST', '/v1/events', event);
  }

  // Private

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText })) as { message?: string };
      throw Object.assign(new Error(error.message || 'Request failed'), {
        statusCode: res.status,
      });
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }
}
