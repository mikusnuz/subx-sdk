**English** | [한국어](README.ko.md)

# @subx-dev/sdk

Core JavaScript/TypeScript SDK for [SubX](https://subx.dev) — in-app subscription management platform.

This package provides a low-level HTTP client for the SubX API. For React Native apps, use [`@subx-dev/react-native`](https://github.com/mikusnuz/subx-sdk/tree/main/packages/react-native) instead.

## Installation

```bash
npm install @subx-dev/sdk
```

## Quick Start

```ts
import { SubXClient } from '@subx-dev/sdk';

const client = new SubXClient({
  apiKey: 'your_subx_api_key',
  baseUrl: 'https://api.subx.dev', // optional
});

// Fetch offerings
const { currentOffering, allOfferings } = await client.getOfferings();

// Identify a subscriber
const subscriber = await client.upsertSubscriber('user-123', {
  plan: 'pro',
});

// Submit a receipt
const result = await client.submitReceipt('user-123', {
  store: 'app_store',
  receiptData: 'base64...',
  productId: 'com.app.pro.monthly',
});

// Grant/revoke entitlements
await client.grantEntitlement('user-123', 'pro');
await client.revokeEntitlement('user-123', 'pro');

// Track events
await client.trackEvent({
  appUserId: 'user-123',
  eventName: 'paywall_viewed',
  properties: { source: 'settings' },
});
```

## API Reference

### `new SubXClient(config)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes | SubX API key |
| `baseUrl` | `string` | No | API base URL (default: `https://api.subx.io`) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getOfferings()` | `OfferingsResponse` | Fetch all offerings |
| `getOfferingPaywalls(offeringId)` | `PaywallsResponse` | Fetch paywalls for an offering |
| `getSubscriber(appUserId)` | `SubscriberResponse` | Get subscriber info |
| `upsertSubscriber(appUserId, attributes?)` | `SubscriberResponse` | Create or update subscriber |
| `submitReceipt(appUserId, receipt)` | `ReceiptResponse` | Submit store receipt |
| `getSubscriberOfferings(appUserId)` | `OfferingsResponse` | Get subscriber-specific offerings |
| `grantEntitlement(appUserId, entitlementId, expiresAt?)` | `{ message }` | Grant entitlement |
| `revokeEntitlement(appUserId, entitlementId)` | `{ message }` | Revoke entitlement |
| `trackEvent(event)` | `void` | Track analytics event |

### Types

All types are exported from the package:

```ts
import type {
  SubXConfig,
  Offering,
  Package,
  Product,
  OfferingsResponse,
  Subscription,
  Entitlement,
  SubscriberResponse,
  Paywall,
  PaywallsResponse,
  ReceiptData,
  ReceiptResponse,
  TrackEventData,
  SubXError,
} from '@subx-dev/sdk';
```

## Related Packages

| Package | Description |
|---------|-------------|
| [`@subx-dev/react-native`](https://github.com/mikusnuz/subx-sdk/tree/main/packages/react-native) | React Native SDK with hooks and provider |

## License

MIT
