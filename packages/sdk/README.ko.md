[English](README.md) | **한국어**

# @subx-dev/sdk

[SubX](https://subx.dev) — 인앱 구독 관리 플랫폼의 핵심 JavaScript/TypeScript SDK입니다.

이 패키지는 SubX API용 저수준 HTTP 클라이언트를 제공합니다. React Native 앱의 경우 [`@subx-dev/react-native`](https://github.com/mikusnuz/subx-sdk/tree/main/packages/react-native)을 사용하세요.

## 설치

```bash
npm install @subx-dev/sdk
```

## 빠른 시작

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

## API 레퍼런스

### `new SubXClient(config)`

| 옵션 | 타입 | 필수 | 설명 |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes | SubX API 키 |
| `baseUrl` | `string` | No | API 베이스 URL (기본값: `https://api.subx.dev`) |

### 메서드

| 메서드 | 반환값 | 설명 |
|--------|---------|-------------|
| `getOfferings()` | `OfferingsResponse` | 모든 offering 조회 |
| `getOfferingPaywalls(offeringId)` | `PaywallsResponse` | Offering의 paywall 조회 |
| `getSubscriber(appUserId)` | `SubscriberResponse` | 구독자 정보 조회 |
| `upsertSubscriber(appUserId, attributes?)` | `SubscriberResponse` | 구독자 생성 또는 업데이트 |
| `submitReceipt(appUserId, receipt)` | `ReceiptResponse` | 스토어 영수증 제출 |
| `getSubscriberOfferings(appUserId)` | `OfferingsResponse` | 구독자별 offering 조회 |
| `grantEntitlement(appUserId, entitlementId, expiresAt?)` | `{ message }` | Entitlement 부여 |
| `revokeEntitlement(appUserId, entitlementId)` | `{ message }` | Entitlement 취소 |
| `trackEvent(event)` | `void` | 분석 이벤트 추적 |

### 타입

모든 타입은 패키지에서 export됩니다.

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

## 관련 패키지

| 패키지 | 설명 |
|---------|-------------|
| [`@subx-dev/react-native`](https://github.com/mikusnuz/subx-sdk/tree/main/packages/react-native) | Hooks와 provider가 포함된 React Native SDK |

## 라이선스

MIT
