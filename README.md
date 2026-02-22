**English** | [한국어](README.ko.md)

# SubX SDK

[![npm @subx-dev/sdk](https://img.shields.io/npm/v/@subx-dev/sdk?label=%40subx-dev%2Fsdk)](https://www.npmjs.com/package/@subx-dev/sdk)
[![npm @subx-dev/react-native](https://img.shields.io/npm/v/@subx-dev/react-native?label=%40subx-dev%2Freact-native)](https://www.npmjs.com/package/@subx-dev/react-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Official SDK for [SubX](https://subx.dev) — in-app subscription management platform.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@subx-dev/sdk`](packages/sdk) | [![npm](https://img.shields.io/npm/v/@subx-dev/sdk)](https://www.npmjs.com/package/@subx-dev/sdk) | Core JavaScript/TypeScript SDK |
| [`@subx-dev/react-native`](packages/react-native) | [![npm](https://img.shields.io/npm/v/@subx-dev/react-native)](https://www.npmjs.com/package/@subx-dev/react-native) | React Native SDK with hooks & provider |

## Quick Start

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

## Documentation

- [SDK Reference](packages/sdk/README.md)
- [React Native Guide](packages/react-native/README.md)
- [SubX Dashboard](https://subx.dev)

## Development

```bash
pnpm install
pnpm build
```

## License

MIT
