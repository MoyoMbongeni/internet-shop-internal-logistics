import { useEffect, useRef } from 'react';
import * as Network from 'expo-network';
import { useKargoStore } from '../store/kargoStore';

export const useNetworkStatus = () => {
  const { setOffline, syncRecords, isOffline } = useKargoStore();
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      const offline = !state.isConnected || !state.isInternetReachable;

      setOffline(offline);

      // If we just came back online after being offline — auto sync
      if (wasOfflineRef.current && !offline) {
        syncRecords();
      }

      wasOfflineRef.current = offline;
    };

    // Check immediately on mount
    checkNetwork();

    // Poll every 5 seconds — expo-network has no native event listener on all platforms
    intervalId = setInterval(checkNetwork, 5_000);

    return () => clearInterval(intervalId);
  }, []);

  return { isOffline };
};
