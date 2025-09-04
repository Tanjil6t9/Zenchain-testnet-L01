/**
 * ZenChain Testnet Balance Checker
 * ----------------------------------------------
 * Uses: Node.js + ethers (v6)
 * Network: ZenChain Testnet
 * Chain ID: 8408
 * Public RPC: https://zenchain-testnet.api.onfinality.io/public
 *
 * How to run:
 *   1) npm i ethers dotenv
 *   2) Create a .env file with:
 *        ADDRESS=0xYourTestAddress
 *   3) node zenchian-check-balance.js
 */

import 'dotenv/config';
import { ethers } from 'ethers';

// RPC config
const RPC_URL = 'https://zenchain-testnet.api.onfinality.io/public';
const CHAIN_ID = 8408;

// Load address from .env
const ADDRESS = process.env.ADDRESS;

if (!ADDRESS) {
  console.error("❌ Please provide ADDRESS in .env file");
  process.exit(1);
}

(async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Network check
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) {
    console.error(`⚠️ Wrong chain! Expected ${CHAIN_ID}, got ${network.chainId}`);
    process.exit(1);
  }

  // Balance fetch
  try {
    const balance = await provider.getBalance(ADDRESS);
    console.log('--- ZenChain Testnet Balance Checker ---');
    console.log('Address :', ADDRESS);
    console.log('Balance :', ethers.formatEther(balance), 'ZTC');
    console.log('-----------------------------------------');
  } catch (err) {
    console.error('❌ Error fetching balance:', err?.message || err);
  }
})();