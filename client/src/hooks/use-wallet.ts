import { useState, useEffect } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  connecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: null,
    connecting: false
  });

  useEffect(() => {
    // Check localStorage for saved wallet state
    const savedWallet = localStorage.getItem('wallet-connected');
    if (savedWallet === 'true') {
      setState({
        connected: true,
        address: '7xKXtGH2mBc3pLkE9vN4zR8qF6wY1sA3uJ5kM9nP2vB8',
        connecting: false
      });
    }
  }, []);

  const connect = async () => {
    setState(prev => ({ ...prev, connecting: true }));
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const address = '7xKXtGH2mBc3pLkE9vN4zR8qF6wY1sA3uJ5kM9nP2vB8';
    setState({
      connected: true,
      address,
      connecting: false
    });
    
    localStorage.setItem('wallet-connected', 'true');
  };

  const disconnect = () => {
    setState({
      connected: false,
      address: null,
      connecting: false
    });
    localStorage.removeItem('wallet-connected');
  };

  return {
    ...state,
    connect,
    disconnect
  };
}
