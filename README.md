# VickyCoin (VIC)

This repository is the first technical prototype for VickyCoin.

## Current version

- Token: VickyCoin
- Symbol: VIC
- Standard: ERC-20
- Decimals: 18
- Initial/maximum supply: 1,000,000,000 VIC
- Minting after deployment: none
- Test network: Base Sepolia
- Base Sepolia chain ID: 84532

The contract uses OpenZeppelin's ERC-20 implementation.

## 1. Install

```bash
pkg update
pkg install nodejs git -y
npm install
```

## 2. Configure

```bash
cp .env.example .env
nano .env
```

Put a TESTNET wallet private key in `.env`.

Never send a mainnet private key to chat, GitHub, or anyone else.

## 3. Compile

```bash
npm run compile
```

## 4. Deploy to Base Sepolia

Your deployer wallet needs Base Sepolia ETH for gas.

```bash
npm run deploy
```

The deployment address is saved to:

```text
artifacts/deployment.json
```

## 5. Check a balance

```bash
npm run balance -- 0xYOUR_ADDRESS
```

## 6. Send VIC

```bash
npm run transfer -- 0xRECIPIENT_ADDRESS 100
```

## What comes next

This is deliberately NOT a mainnet launch.

Next production components should include:

1. audited token contract
2. secure treasury/allocation system
3. Vicky Wallet
4. VickyPay payment API
5. merchant checkout
6. transaction/indexing service
7. block explorer/token metadata
8. legal/compliance review for the jurisdictions where VIC will be offered
9. liquidity/market infrastructure
10. mainnet deployment only after testing and security review
