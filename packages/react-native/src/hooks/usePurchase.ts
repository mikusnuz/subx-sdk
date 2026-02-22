import { useState, useCallback } from 'react';
import { useSubX } from './useSubX';
import { CustomerInfo } from '../types';

export function usePurchase() {
  const { purchase: doPurchase } = useSubX();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const purchase = useCallback(
    async (productId: string): Promise<{ success: boolean; customerInfo: CustomerInfo | null }> => {
      setIsPurchasing(true);
      setError(null);
      try {
        const result = await doPurchase(productId);
        return result;
      } catch (err: any) {
        setError(err);
        return { success: false, customerInfo: null };
      } finally {
        setIsPurchasing(false);
      }
    },
    [doPurchase]
  );

  return { purchase, isPurchasing, error };
}
