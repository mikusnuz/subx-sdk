import { useState, useEffect } from 'react';
import { SubXReactNative } from '../SubXReactNative';
import { OfferingWithStoreProducts, PackageWithStoreProducts, StoreProduct } from '../types';
import type { Offering, Package, Product } from '@subx-dev/sdk';

export function useOfferings() {
  const [offerings, setOfferings] = useState<OfferingWithStoreProducts[]>([]);
  const [currentOffering, setCurrentOffering] = useState<OfferingWithStoreProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        const subx = SubXReactNative.shared;
        const client = subx.getClient();
        const storeService = subx.getStoreService();

        const res = await client.getOfferings();

        const allSkus = new Set<string>();
        for (const offering of res.allOfferings) {
          for (const pkg of offering.packages) {
            for (const product of pkg.products) {
              allSkus.add(product.storeProductId);
            }
          }
        }

        const skuArr = Array.from(allSkus);
        let storeProducts: StoreProduct[] = [];
        if (skuArr.length > 0) {
          storeProducts = await storeService.getProducts(skuArr);
        }

        const storeProductMap = new Map<string, StoreProduct>();
        for (const sp of storeProducts) {
          storeProductMap.set(sp.productId, sp);
        }

        const merged: OfferingWithStoreProducts[] = res.allOfferings.map((offering: Offering) => ({
          ...offering,
          packagesWithProducts: offering.packages.map((pkg: Package): PackageWithStoreProducts => ({
            ...pkg,
            storeProducts: pkg.products
              .map((p: Product) => storeProductMap.get(p.storeProductId))
              .filter((sp): sp is StoreProduct => sp !== undefined),
          })),
        }));

        if (!cancelled) {
          setOfferings(merged);
          setCurrentOffering(merged.find((o) => o.isCurrent) || merged[0] || null);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { offerings, currentOffering, isLoading, error };
}
