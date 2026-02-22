**English** | [한국어](README.ko.md)

# @subx-dev/react-native

React Native SDK for SubX — in-app subscription management.

## Prerequisites

Before integrating the SDK, you need a SubX account and project:

1. **Sign up** at [subx.dev](https://subx.dev) and create a new project
2. **Create an app** — register your iOS (App Store) or Android (Play Store) app within the project
3. **Set up products** — define your subscription products, entitlements, and offerings in the SubX dashboard
4. **Get your API key** — go to **Project Settings → API Keys** and copy your **Public API Key** (starts with a long hex string). This is the key you'll pass to `SubXProvider`
5. **Configure store credentials** — upload your Apple App Store p8 key or Google Play service account JSON for server-side receipt validation
6. **Set up webhooks** — in your backend, create a `POST /webhooks/subx` endpoint and register the URL in **Project Settings → Webhooks**. SubX will send subscription lifecycle events (purchases, renewals, cancellations) with HMAC-SHA256 signatures

> **Tip**: The Public API Key is safe to include in client-side code. It can only read offerings and submit receipts — it cannot modify your project settings.

## Installation

```bash
npm install @subx-dev/react-native react-native-iap
```

### iOS Setup

```bash
cd ios && pod install
```

### Android Setup

No additional setup required.

### Expo

Add `react-native-iap` to your `app.json` plugins:

```json
{
  "plugins": ["react-native-iap"]
}
```

## Quick Start

### 1. Wrap your app with SubXProvider

```tsx
import { SubXProvider } from '@subx-dev/react-native';

export default function App() {
  return (
    <SubXProvider
      apiKey="your_subx_api_key"
      baseUrl="https://api.subx.dev"
      entitlementIds={['pro']}
    >
      <YourApp />
    </SubXProvider>
  );
}
```

### 2. Identify user after login

```tsx
import { useSubX } from '@subx-dev/react-native';

function LoginScreen() {
  const { identify } = useSubX();

  const handleLogin = async (userId: string) => {
    await identify(userId);
  };
}
```

### 3. Check subscription status

```tsx
import { useSubX } from '@subx-dev/react-native';

function SettingsScreen() {
  const { isPro, isEntitled, customerInfo } = useSubX();

  return (
    <View>
      <Text>{isPro ? 'Pro Plan' : 'Free Plan'}</Text>
      <Text>{isEntitled('premium_feature') ? 'Unlocked' : 'Locked'}</Text>
    </View>
  );
}
```

### 4. Display offerings and make purchases

```tsx
import { useOfferings, usePurchase } from '@subx-dev/react-native';

function PaywallScreen() {
  const { currentOffering, isLoading } = useOfferings();
  const { purchase, isPurchasing } = usePurchase();

  if (isLoading) return <ActivityIndicator />;

  return (
    <View>
      {currentOffering?.packagesWithProducts.map((pkg) => {
        const product = pkg.storeProducts[0];
        if (!product) return null;
        return (
          <TouchableOpacity
            key={pkg.id}
            onPress={() => purchase(product.productId)}
            disabled={isPurchasing}
          >
            <Text>{pkg.displayName}</Text>
            <Text>{product.localizedPrice}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
```

### 5. Restore purchases

```tsx
const { restore } = useSubX();
await restore();
```

## API Reference

### SubXProvider

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | SubX public API key |
| `baseUrl` | `string` | No | SubX API base URL (default: `https://api.subx.io`) |
| `entitlementIds` | `string[]` | No | Entitlement IDs to check for `isPro` |

### useSubX()

Returns:

| Property | Type | Description |
|----------|------|-------------|
| `isReady` | `boolean` | Whether SDK is initialized |
| `isPro` | `boolean` | Whether user has any of the specified entitlements |
| `appUserId` | `string \| null` | Current user ID |
| `customerInfo` | `CustomerInfo \| null` | Full customer info |
| `isEntitled(id)` | `(id: string) => boolean` | Check specific entitlement |
| `identify(userId)` | `(userId: string) => Promise<CustomerInfo>` | Identify user |
| `purchase(productId)` | `(productId: string) => Promise<{ success, customerInfo }>` | Make purchase |
| `restore()` | `() => Promise<CustomerInfo \| null>` | Restore purchases |
| `logout()` | `() => Promise<void>` | Clear user session |

### useOfferings()

Returns:

| Property | Type | Description |
|----------|------|-------------|
| `offerings` | `OfferingWithStoreProducts[]` | All offerings with store prices |
| `currentOffering` | `OfferingWithStoreProducts \| null` | Current/default offering |
| `isLoading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error state |

### usePurchase()

Returns:

| Property | Type | Description |
|----------|------|-------------|
| `purchase(productId)` | `(productId: string) => Promise<{ success, customerInfo }>` | Execute purchase |
| `isPurchasing` | `boolean` | Purchase in progress |
| `error` | `Error \| null` | Error state |

### SubXReactNative (Advanced)

Singleton class for direct access:

```ts
import { SubXReactNative } from '@subx-dev/react-native';

const subx = SubXReactNative.shared;
await subx.configure({ apiKey: '...', entitlementIds: ['pro'] });
await subx.identify('user-123');
const info = await subx.getCustomerInfo();
```

## How It Works

1. **Purchase Flow**: `requestPurchase` → store purchase → `purchaseUpdatedListener` → `submitReceipt` to SubX → `finishTransaction` → refresh customer info
2. **Restore Flow**: `getAvailablePurchases` → submit each receipt → refresh customer info
3. **Auto-sync**: Customer info refreshes when app returns to foreground

## License

MIT
