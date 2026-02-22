[English](README.md) | **한국어**

# SubX SDK

[![npm @subx-dev/sdk](https://img.shields.io/npm/v/@subx-dev/sdk?label=%40subx-dev%2Fsdk)](https://www.npmjs.com/package/@subx-dev/sdk)
[![npm @subx-dev/react-native](https://img.shields.io/npm/v/@subx-dev/react-native?label=%40subx-dev%2Freact-native)](https://www.npmjs.com/package/@subx-dev/react-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[SubX](https://subx.dev) — 인앱 구독 관리 플랫폼의 공식 SDK입니다.

## 패키지

| 패키지 | 버전 | 설명 |
|---------|---------|-------------|
| [`@subx-dev/sdk`](packages/sdk) | [![npm](https://img.shields.io/npm/v/@subx-dev/sdk)](https://www.npmjs.com/package/@subx-dev/sdk) | 핵심 JavaScript/TypeScript SDK |
| [`@subx-dev/react-native`](packages/react-native) | [![npm](https://img.shields.io/npm/v/@subx-dev/react-native)](https://www.npmjs.com/package/@subx-dev/react-native) | React Native SDK (hooks 및 provider 포함) |

## 빠른 시작

### JavaScript/TypeScript

```bash
npm install @subx-dev/sdk
```

```ts
import { SubXClient } from '@subx-dev/sdk';

const client = new SubXClient({ apiKey: 'your_api_key' });
const { currentOffering } = await client.getOfferings();
```

### React Native

```bash
npm install @subx-dev/react-native react-native-iap
```

```tsx
import { SubXProvider, useSubX } from '@subx-dev/react-native';

function App() {
  return (
    <SubXProvider apiKey="your_api_key" entitlementIds={['pro']}>
      <YourApp />
    </SubXProvider>
  );
}

function SettingsScreen() {
  const { isPro } = useSubX();
  return <Text>{isPro ? 'Pro' : 'Free'}</Text>;
}
```

## 문서

- [SDK 레퍼런스](packages/sdk/README.md)
- [React Native 가이드](packages/react-native/README.md)
- [SubX 대시보드](https://subx.dev)

## 개발

```bash
pnpm install
pnpm build
```

## 라이선스

MIT
