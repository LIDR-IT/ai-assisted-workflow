/**
 * Test component to isolate useClientRegistry issues
 */

import { useState, useEffect } from 'react';

// Test 1: Try importing complete client registry
import { clientRegistry } from '@/data/client-registry';

// Test 2: Try useClientRegistry hook
// import { useClientRegistry } from '@/hooks/useClientRegistry';

export function TestClientRegistry() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    // Test 1: Complete client registry test
    try {
      // Test accessing the registry
      const currentClientId = clientRegistry.currentClientId;
      const availableClients = clientRegistry.getAvailableClients();
      setStatus(
        `Client registry works: ${currentClientId}, available: ${availableClients.join(', ')}`
      );
    } catch (error) {
      setStatus(`Client registry failed: ${(error as Error).message}`);
    }
  }, []); // Empty dependency array to run only once

  // Test 2: Hook usage
  // try {
  //   const { currentClientId } = useClientRegistry();
  //   setStatus(`Hook works: ${currentClientId}`);
  // } catch (error) {
  //   setStatus(`Hook failed: ${error.message}`);
  // }

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Client Registry Test</h3>
      <p>{status}</p>
    </div>
  );
}
