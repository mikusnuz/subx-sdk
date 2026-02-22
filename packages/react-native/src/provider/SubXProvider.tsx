import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SubXReactNative } from '../SubXReactNative';
import { SubXContext } from './SubXContext';
import { CustomerInfo } from '../types';

interface SubXProviderProps {
  apiKey: string;
  baseUrl?: string;
  entitlementIds?: string[];
  children: React.ReactNode;
}

export function SubXProvider({ apiKey, baseUrl, entitlementIds = [], children }: SubXProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const entitlementIdsRef = useRef(entitlementIds);
  entitlementIdsRef.current = entitlementIds;

  useEffect(() => {
    const init = async () => {
      try {
        const subx = SubXReactNative.shared;
        await subx.configure({ apiKey, baseUrl, entitlementIds });

        subx.addCustomerInfoUpdateListener((info) => {
          setCustomerInfo(info);
        });

        setIsReady(true);
      } catch (error) {
        console.error('[SubX] Init failed:', error);
        setIsReady(true);
      }
    };

    init();

    return () => {
      SubXReactNative.shared.destroy();
    };
  }, [apiKey, baseUrl]);

  const identify = useCallback(async (userId: string) => {
    const info = await SubXReactNative.shared.identify(userId);
    setCustomerInfo(info);
    return info;
  }, []);

  const purchase = useCallback(async (productId: string) => {
    const result = await SubXReactNative.shared.purchase(productId);
    if (result.customerInfo) setCustomerInfo(result.customerInfo);
    return result;
  }, []);

  const restore = useCallback(async () => {
    const info = await SubXReactNative.shared.restore();
    if (info) setCustomerInfo(info);
    return info;
  }, []);

  const logout = useCallback(async () => {
    await SubXReactNative.shared.logout();
    setCustomerInfo(null);
  }, []);

  const isEntitled = useCallback(
    (entitlementId: string) => {
      return customerInfo?.activeEntitlementIds.includes(entitlementId) ?? false;
    },
    [customerInfo]
  );

  const isPro =
    entitlementIdsRef.current.length > 0
      ? entitlementIdsRef.current.some(
          (id) => customerInfo?.activeEntitlementIds.includes(id) ?? false
        )
      : (customerInfo?.subscriptions.some((s) => s.status === 'active') ?? false);

  return (
    <SubXContext.Provider
      value={{
        isReady,
        appUserId: SubXReactNative.shared.appUserId,
        customerInfo,
        isPro,
        isEntitled,
        identify,
        purchase,
        restore,
        logout,
      }}
    >
      {children}
    </SubXContext.Provider>
  );
}
