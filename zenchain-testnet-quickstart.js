/**
 * ZenChain Testnet Quickstart (Single File)
 * ------------------------------------------------------------
 * Uses: Node.js + ethers (v6)
 * Network: ZenChain Testnet
 * Chain ID: 8408
 * Public RPC: https://zenchain-testnet.api.onfinality.io/public
 * Explorer: https://zentrace.io  (optional)
 *
 * How to run:
 *   1) npm i ethers dotenv
 *   2) Create a .env file (optional, for sending tx):
 *        PRIVATE_KEY=0xYOUR_TEST_PRIVATE_KEY
 *        TO=0xReceiverAddressForTest
 *        AMOUNT=0.000001   # ZTC (optional, default 0.000001)
 *   3) node zenchain-testnet-quickstart.js
 *
 * Notes:
 * - Native token symbol: ZTC (18 decimals)
 * - Get test ZTC from faucet if available.
 */

import 'dotenv/config';
import { ethers } from 'ethers';

// --- Config ---
const RPC_URL = 'https://zenchain-testnet.api.onfinality.io/public';
const CHAIN_ID = 8408; // For sanity checks

// Optional envs for a tiny transfer
const PRIVATE_KEY = process.env.PRIVATE_KEY; // test-only key
const TO = process.env.TO;                   // recipient
const AMOUNT = process.env.AMOUNT || '0.000001'; // ZTC

(async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Basic network info
  const network = await provider.getNetwork();
  const latestBlock = await provider.getBlockNumber();
  const gasPrice = await provider.getGasPrice();

  console.log('--- ZenChain Testnet — Network Info ---');
  console.log('RPC URL     :', RPC_URL);
  console.log('Reported ID :', Number(network.chainId));
  console.log('Expected ID :', CHAIN_ID);
  console.log('Name        :', network.name || 'zenchain-testnet');
  console.log('LatestBlock :', latestBlock);
  console.log('Gas Price   :', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');
  console.log('---------------------------------------\n');

  if (Number(network.chainId) !== CHAIN_ID) {
    console.error('⚠️  Unexpected chainId. Check the RPC URL.');
    process.exit(1);
  }

  // If no private key, we’re done after read-only info
  if (!PRIVATE_KEY) {
    console.log('No PRIVATE_KEY provided. Read-only mode complete ✅');
    console.log('Tip: set PRIVATE_KEY, TO, AMOUNT in .env to send a small test tx.');
    return;
  }

  // Wallet setup
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const address = await wallet.getAddress();
  const balance = await provider.getBalance(address);

  console.log('--- Wallet ---');
  console.log('Address  :', address);
  console.log('Balance  :', ethers.formatEther(balance), 'ZTC');

  if (!TO) {
    console.log('\nNo TO address set. Skipping transfer. ✅');
    return;
  }

  // Safety: tiny amount, user-controlled via AMOUNT
  const valueWei = ethers.parseEther(AMOUNT);

  if (balance < valueWei) {
    console.error(`\n⚠️  Not enough balance to send ${AMOUNT} ZTC.`);
    console.error('Get test ZTC from the faucet (if available) and retry.');
    return;
  }

  console.log('\n--- Sending Test TX ---');
  console.log(`To     : ${TO}`);
  console.log(`Amount : ${AMOUNT} ZTC`);

  try {
    const tx = await wallet.sendTransaction({ to: TO, value: valueWei });
    console.log('Tx sent! Hash:', tx.hash);
    console.log('Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('✅ Confirmed in block:', receipt.blockNumber);
  } catch (err) {
    console.error('❌ TX failed:', err?.message || err);
  }
})();