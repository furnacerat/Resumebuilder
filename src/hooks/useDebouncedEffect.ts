/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, type DependencyList } from "react";

export function useDebouncedEffect(effect: () => void, delayMs: number, deps: DependencyList = []) {
  useEffect(() => {
    const t = window.setTimeout(() => effect(), delayMs);
    return () => window.clearTimeout(t);
  }, deps);
}
