[English](README.md) | **한국어**

# @subx-dev/react-native

SubX를 위한 React Native SDK — 앱 내 구독 관리.

## 사전 준비

SDK를 연동하기 전에 SubX 계정과 프로젝트가 필요합니다:

1. **회원가입** — [subx.dev](https://subx.dev)에서 계정을 만들고 새 프로젝트를 생성합니다
2. **앱 등록** — 프로젝트 내에서 iOS(App Store) 또는 Android(Play Store) 앱을 등록합니다
3. **상품 설정** — SubX 대시보드에서 구독 상품, 권한(entitlement), 오퍼링을 정의합니다
4. **API 키 발급** — **프로젝트 설정 → API Keys**에서 **Public API Key**를 복사합니다 (긴 hex 문자열). 이 키를 `SubXProvider`에 전달합니다
5. **스토어 자격 증명 연결** — 서버 측 영수증 검증을 위해 Apple App Store p8 키 또는 Google Play 서비스 계정 JSON을 업로드합니다
6. **웹훅 설정** — 백엔드에 `POST /webhooks/subx` 엔드포인트를 만들고, **프로젝트 설정 → Webhooks**에 URL을 등록합니다. SubX가 구독 라이프사이클 이벤트(구매, 갱신, 취소 등)를 HMAC-SHA256 서명과 함께 전송합니다

> **참고**: Public API Key는 클라이언트 코드에 포함해도 안전합니다. 오퍼링 조회와 영수증 제출만 가능하며, 프로젝트 설정을 변경할 수 없습니다.

## 설치

```bash
npm install @subx-dev/react-native react-native-iap
```

### iOS 설정

```bash
cd ios && pod install
```

### Android 설정

별도 설정이 필요하지 않습니다.

### Expo

`app.json` 플러그인에 `react-native-iap`를 추가합니다.

```json
{
  "plugins": ["react-native-iap"]
}
```

## 빠른 시작

### 1. SubXProvider로 앱 감싸기

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

### 2. 로그인 후 사용자 식별

```tsx
import { useSubX } from '@subx-dev/react-native';

function LoginScreen() {
  const { identify } = useSubX();

  const handleLogin = async (userId: string) => {
    await identify(userId);
  };
}
```

### 3. 구독 상태 확인

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

### 4. 오퍼링 표시 및 구매

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

### 5. 구매 복원

```tsx
const { restore } = useSubX();
await restore();
```

## API 레퍼런스

### SubXProvider

| 프로퍼티 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `apiKey` | `string` | 예 | SubX 공개 API 키 |
| `baseUrl` | `string` | 아니오 | SubX API 기본 URL (기본값: `https://api.subx.io`) |
| `entitlementIds` | `string[]` | 아니오 | `isPro` 확인에 사용할 권한 ID 목록 |

### useSubX()

반환값:

| 프로퍼티 | 타입 | 설명 |
|---------|------|------|
| `isReady` | `boolean` | SDK 초기화 완료 여부 |
| `isPro` | `boolean` | 지정된 권한 중 하나 이상 보유 여부 |
| `appUserId` | `string \| null` | 현재 사용자 ID |
| `customerInfo` | `CustomerInfo \| null` | 전체 고객 정보 |
| `isEntitled(id)` | `(id: string) => boolean` | 특정 권한 보유 여부 확인 |
| `identify(userId)` | `(userId: string) => Promise<CustomerInfo>` | 사용자 식별 |
| `purchase(productId)` | `(productId: string) => Promise<{ success, customerInfo }>` | 구매 실행 |
| `restore()` | `() => Promise<CustomerInfo \| null>` | 구매 복원 |
| `logout()` | `() => Promise<void>` | 사용자 세션 초기화 |

### useOfferings()

반환값:

| 프로퍼티 | 타입 | 설명 |
|---------|------|------|
| `offerings` | `OfferingWithStoreProducts[]` | 스토어 가격 포함 전체 오퍼링 목록 |
| `currentOffering` | `OfferingWithStoreProducts \| null` | 현재/기본 오퍼링 |
| `isLoading` | `boolean` | 로딩 상태 |
| `error` | `Error \| null` | 에러 상태 |

### usePurchase()

반환값:

| 프로퍼티 | 타입 | 설명 |
|---------|------|------|
| `purchase(productId)` | `(productId: string) => Promise<{ success, customerInfo }>` | 구매 실행 |
| `isPurchasing` | `boolean` | 구매 진행 중 여부 |
| `error` | `Error \| null` | 에러 상태 |

### SubXReactNative (고급)

직접 접근을 위한 싱글톤 클래스입니다.

```ts
import { SubXReactNative } from '@subx-dev/react-native';

const subx = SubXReactNative.shared;
await subx.configure({ apiKey: '...', entitlementIds: ['pro'] });
await subx.identify('user-123');
const info = await subx.getCustomerInfo();
```

## 동작 원리

1. **구매 플로우**: `requestPurchase` → 스토어 구매 → `purchaseUpdatedListener` → SubX에 `submitReceipt` → `finishTransaction` → 고객 정보 갱신
2. **복원 플로우**: `getAvailablePurchases` → 각 영수증 제출 → 고객 정보 갱신
3. **자동 동기화**: 앱이 포그라운드로 복귀할 때 고객 정보가 자동으로 갱신됩니다.

## 라이선스

MIT
