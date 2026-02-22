import { Platform } from 'react-native';
import type { Purchase } from './StoreService';
import { ReceiptData } from '@subx-dev/sdk';
import { getStoreName } from '../utils/platform';

export function mapPurchaseToReceipt(purchase: Purchase): ReceiptData {
  const store = getStoreName();

  if (Platform.OS === 'ios') {
    return {
      store,
      receiptData: (purchase as any).transactionReceipt || (purchase as any).purchaseToken || '',
      productId: purchase.productId,
    };
  }

  return {
    store,
    receiptData: (purchase as any).purchaseToken || (purchase as any).transactionReceipt || '',
    productId: purchase.productId,
  };
}
