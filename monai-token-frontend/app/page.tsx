'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { injected } from 'wagmi/connectors';
import { monadTestnet } from './providers';

// Contract address on Monad Testnet
const CONTRACT_ADDRESS = '0xeD1EDCC815317a56370a436E055AfABddB2D6488' as const;
const MONAD_TESTNET_CHAIN_ID = 10143;

// Contract ABI - generated from your MonaiToken.sol
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string","name": "_n","type": "string"},{"internalType": "string","name": "_s","type": "string"},{"internalType": "uint256","name": "_supply","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false,"internalType": "bool","name": "status","type": "bool"}],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address","name": "a","type": "address"}],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "a","type": "address"}],
    "name": "addMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "admins",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "address","name": "","type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amt","type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "balance",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "n","type": "address"}],
    "name": "changeOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8","name": "","type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amt","type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "minters",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "a","type": "address"}],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "a","type": "address"}],
    "name": "removeMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amt","type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amt","type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // State for forms
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');

  // Read token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read native MON balance
  const { data: nativeBalance } = useBalance({
    address: address,
    chainId: monadTestnet.id,
  });

  // Read minter role
  const { data: isMinter } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'minters',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read admin role
  const { data: isAdmin } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'admins',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read paused status
  const { data: isPaused, refetch: refetchPaused } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'paused',
  });

  // Write contracts
  const { data: transferHash, writeContract: transfer, isPending: isTransferPending } = useWriteContract();
  const { data: mintHash, writeContract: mint, isPending: isMintPending } = useWriteContract();
  const { data: pauseHash, writeContract: pauseContract, isPending: isPausePending } = useWriteContract();
  const { data: unpauseHash, writeContract: unpauseContract, isPending: isUnpausePending } = useWriteContract();

  // Wait for transactions
  const { isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({ hash: transferHash });
  const { isSuccess: isMintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });
  const { isSuccess: isPauseSuccess } = useWaitForTransactionReceipt({ hash: pauseHash });
  const { isSuccess: isUnpauseSuccess } = useWaitForTransactionReceipt({ hash: unpauseHash });

  // Refetch balances on transaction success
  if (isTransferSuccess || isMintSuccess) {
    refetchBalance();
  }
  if (isPauseSuccess || isUnpauseSuccess) {
    refetchPaused();
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTo || !transferAmount) return;
    
    transfer({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'transfer',
      args: [transferTo as `0x${string}`, parseEther(transferAmount)],
    });
  };

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintTo || !mintAmount) return;
    
    mint({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [mintTo as `0x${string}`, parseEther(mintAmount)],
    });
  };

  const handlePause = () => {
    pauseContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'pause',
    });
  };

  const handleUnpause = () => {
    unpauseContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'unpause',
    });
  };

  // Check if on wrong network
  const isWrongNetwork = isConnected && chainId !== MONAD_TESTNET_CHAIN_ID;

  // STATE 1: WALLET DISCONNECTED
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-[#0a0015] relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-12 text-center">
              <div className="mb-8">
                <div className="inline-block p-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl mb-6 border border-purple-400/30">
                  <div className="text-7xl">💎</div>
                </div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
                  $MONAI Token
                </h1>
                <p className="text-purple-200 text-xl mb-3 font-medium">
                  Powered by Monad Testnet
                </p>
                <p className="text-purple-300/80 text-base max-w-lg mx-auto">
                  Connect your wallet to transfer tokens, mint new supply, and manage roles with blazing-fast transactions
                </p>
              </div>

              <button
                onClick={() => connect({ connector: injected() })}
                className="group px-12 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-400/60 hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-3">
                  <span>Connect Wallet</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              <div className="mt-10 pt-8 border-t border-purple-500/20">
                <p className="text-purple-400/60 text-xs mb-2 uppercase tracking-wider font-semibold">Contract Address</p>
                <p className="text-purple-200 text-sm font-mono break-all bg-purple-950/30 px-4 py-2 rounded-lg border border-purple-500/20">{CONTRACT_ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // STATE 2: WRONG NETWORK
  if (isWrongNetwork) {
    return (
      <main className="min-h-screen bg-[#0a0015] relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-10 text-center">
              <div className="mb-6">
                <div className="inline-block p-5 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl mb-5 border border-red-400/30 animate-pulse">
                  <div className="text-6xl">⚠️</div>
                </div>
                <h2 className="text-4xl font-black text-white mb-4">Wrong Network</h2>
                <p className="text-purple-200 mb-3 text-lg">
                  Please switch to Monad Testnet
                </p>
                <div className="inline-block bg-purple-950/50 px-4 py-2 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    Current: <span className="font-mono font-bold text-purple-200">Chain {chainId}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => switchChain({ chainId: MONAD_TESTNET_CHAIN_ID })}
                className="w-full px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/60 transform hover:scale-105 active:scale-95 mb-4"
              >
                Switch to Monad Testnet
              </button>

              <button
                onClick={() => disconnect()}
                className="w-full px-6 py-3 bg-purple-950/30 border border-purple-500/30 text-purple-200 rounded-xl text-sm font-semibold hover:bg-purple-900/40 hover:border-purple-400/40 transition-all"
              >
                Disconnect Wallet
              </button>

              <div className="mt-8 pt-6 border-t border-purple-500/20">
                <p className="text-purple-400/60 text-xs uppercase tracking-wider font-semibold mb-2">Connected Wallet</p>
                <p className="font-mono text-purple-200 text-sm bg-purple-950/30 px-3 py-2 rounded-lg border border-purple-500/20">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // STATE 3: CORRECT NETWORK - FULL DASHBOARD

  // STATE 3: CORRECT NETWORK - FULL DASHBOARD
  return (
    <main className="min-h-screen bg-[#0a0015] relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Disconnect Button */}
          <header className="mb-8">
            <div className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                    $MONAI Dashboard
                  </h1>
                  <p className="text-purple-200 mt-2 flex items-center gap-2 flex-wrap font-medium">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                    Monad Testnet
                    <span className="text-purple-300/70 text-sm">• Chain {chainId}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right bg-purple-950/40 backdrop-blur px-5 py-3 rounded-xl border border-purple-500/30">
                    <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold mb-1">Wallet</div>
                    <div className="text-sm font-mono text-white font-bold">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="px-5 py-3 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 text-red-200 rounded-xl text-sm font-bold hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400/50 transition-all hover:scale-105 active:scale-95"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            {/* Balances Card */}
            <section className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-6">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💰</span>
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">Your Balances</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 backdrop-blur p-6 rounded-xl border border-purple-400/40 hover:border-purple-300/60 transition-all hover:scale-[1.02] shadow-lg shadow-purple-900/30">
                  <div className="text-sm text-purple-200 mb-2 font-bold uppercase tracking-wider">$MONAI Balance</div>
                  <div className="text-4xl font-black text-white mb-1">
                    {tokenBalance ? formatEther(tokenBalance as bigint) : '0'}
                  </div>
                  <div className="text-purple-300 text-sm font-semibold">MONAI</div>
                </div>
                <div className="bg-gradient-to-br from-violet-600/30 to-indigo-600/30 backdrop-blur p-6 rounded-xl border border-violet-400/40 hover:border-violet-300/60 transition-all hover:scale-[1.02] shadow-lg shadow-violet-900/30">
                  <div className="text-sm text-violet-200 mb-2 font-bold uppercase tracking-wider">Native Balance</div>
                  <div className="text-4xl font-black text-white mb-1">
                    {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0'}
                  </div>
                  <div className="text-violet-300 text-sm font-semibold">MON</div>
                </div>
              </div>
              {isPaused && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 rounded-xl backdrop-blur">
                  <p className="text-yellow-100 font-bold flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    Contract Paused - Transfers & Minting Disabled
                  </p>
                </div>
              )}
            </section>

            {/* Transfer Card */}
            <section className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-6">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📤</span>
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">Transfer Tokens</span>
              </h2>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">Recipient Address</label>
                    <input
                      type="text"
                      className="w-full bg-purple-950/40 border border-purple-500/40 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400/60 backdrop-blur transition-all font-mono"
                      placeholder="0x..."
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">Amount</label>
                    <input
                      type="text"
                      className="w-full bg-purple-950/40 border border-purple-500/40 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400/60 backdrop-blur transition-all"
                      placeholder="0.0"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isTransferPending || !transferTo || !transferAmount}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-black text-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-95"
                >
                  {isTransferPending ? '⏳ Transferring...' : '🚀 Transfer Tokens'}
                </button>
              </form>
            </section>

            {/* Minter Card - Conditional */}
            {isMinter && (
              <section className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-2xl rounded-2xl border-2 border-indigo-400/50 shadow-2xl shadow-indigo-900/50 p-6">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black rounded-full shadow-lg uppercase tracking-wider">Minter Role</span>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <span className="text-3xl">✨</span>
                    <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Mint Tokens</span>
                  </h2>
                </div>
                <form onSubmit={handleMint} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Mint To Address</label>
                      <input
                        type="text"
                        className="w-full bg-indigo-950/40 border border-indigo-500/40 rounded-xl px-4 py-3 text-white placeholder-indigo-400/50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60 backdrop-blur transition-all font-mono"
                        placeholder="0x..."
                        value={mintTo}
                        onChange={(e) => setMintTo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Amount to Mint</label>
                      <input
                        type="text"
                        className="w-full bg-indigo-950/40 border border-indigo-500/40 rounded-xl px-4 py-3 text-white placeholder-indigo-400/50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60 backdrop-blur transition-all"
                        placeholder="0.0"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isMintPending || !mintTo || !mintAmount}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-black text-lg hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-95"
                  >
                    {isMintPending ? '⏳ Minting...' : '💎 Mint New Tokens'}
                  </button>
                </form>
              </section>
            )}

            {/* Admin Card - Conditional */}
            {isAdmin && (
              <section className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 backdrop-blur-2xl rounded-2xl border-2 border-yellow-400/50 shadow-2xl shadow-yellow-900/50 p-6">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-black rounded-full shadow-lg uppercase tracking-wider">Admin Role</span>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <span className="text-3xl">🛡️</span>
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Admin Controls</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handlePause}
                    disabled={isPausePending || isPaused === true}
                    className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-black text-lg hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-95"
                  >
                    {isPausePending ? '⏳ Processing...' : '⏸️ Pause Contract'}
                  </button>
                  <button
                    onClick={handleUnpause}
                    disabled={isUnpausePending || isPaused === false}
                    className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-black text-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-400/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-95"
                  >
                    {isUnpausePending ? '⏳ Processing...' : '▶️ Unpause Contract'}
                  </button>
                </div>
              </section>
            )}

            {/* Roles & Contract Info Card */}
            <section className="bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎭</span>
                    <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">Your Roles</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {isMinter && (
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/50 text-indigo-100 text-sm font-bold rounded-full backdrop-blur flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"></span>
                        Minter ✓
                      </span>
                    )}
                    {isAdmin && (
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400/50 text-yellow-100 text-sm font-bold rounded-full backdrop-blur flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></span>
                        Admin ✓
                      </span>
                    )}
                    {!isMinter && !isAdmin && (
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 border border-purple-400/50 text-purple-100 text-sm font-bold rounded-full backdrop-blur flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></span>
                        Regular User
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">Contract Info</span>
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-purple-400/80 text-xs mb-1 uppercase tracking-wider font-semibold">Contract Address</p>
                      <p className="text-white text-sm font-mono break-all bg-purple-950/40 px-3 py-2 rounded-lg border border-purple-500/30">{CONTRACT_ADDRESS}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
