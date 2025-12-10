# AgentPay

A decentralized marketplace for AI-powered autonomous agents, built on Avalanche with X402 micropayments and ERC-8004 reputation system.

## Overview

This project is a Next.js-based dApp that provides a marketplace where users can discover, access, and interact with various AI agents. The platform leverages:

- **X402 Protocol**: HTTP 402 Payment Required standard for instant micropayments
- **ERC-8004**: On-chain reputation and identity verification system
- **Avalanche Network**: Fast, low-cost transactions on Avalanche Fuji testnet

## Features

- 🤖 **Agent Marketplace**: Browse and filter AI agents by category, price, and reputation
- 💰 **X402 Micropayments**: Pay-per-use model with instant payment processing
- ⭐ **ERC-8004 Reputation**: On-chain reputation scores for agents and users
- 🔍 **Smart Filtering**: Search and filter agents by multiple criteria
- 💬 **Agent Chat Interface**: Interactive chatbot interface for each agent
- 🔒 **Secure Payments**: Integrated payment flow with wallet connectivity
- 🚀 **Deploy Your Own Agent**: Users can deploy their own AI agents on Avalanche and list them on the marketplace

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Blockchain**: Avalanche Fuji Testnet
- **Payment Protocol**: X402 (Thirdweb)
- **Reputation**: ERC-8004
- **Wallet**: Thirdweb Connect
- **Styling**: Tailwind CSS

## Deployed Contracts

### Reputation Contract (ERC-8004)

- **Contract Address**: `0x13f92005dBaE94aE9C479e33Fe9A958Af618352e`
- **Network**: Avalanche Fuji Testnet (Chain ID: 43113)
- **Explorer**: [View on Routescan](https://testnet.routescan.io/address/0x13f92005dBaE94aE9C479e33Fe9A958Af618352e/contract/43113/code)
- **Verified on Sourcify**: [View on Sourcify](https://repo.sourcify.dev/43113/0x13f92005dBaE94aE9C479e33Fe9A958Af618352e)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Avalanche Fuji testnet wallet
- Thirdweb account (for client ID)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
THIRDWEB_SERVER_WALLET_ADDRESS=your_server_wallet
MERCHANT_WALLET_ADDRESS=your_merchant_wallet
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-app/
├── app/
│   ├── api/              # API routes for X402 payments
│   │   ├── basic/        # Basic tier payment endpoint
│   │   └── premium/      # Premium tier payment endpoint
│   ├── components/      # React components
│   │   ├── AgentCard.tsx
│   │   ├── Landing.tsx
│   │   └── Navbar.tsx
│   ├── marketplace/     # Marketplace page
│   └── page.tsx         # Landing page
├── components/          # Shared components
├── lib/                 # Utilities and constants
│   ├── constants.ts    # Payment amounts and endpoints
│   └── payment.ts       # Payment utilities
└── contract/           # Smart contracts
    └── Reputation.sol   # ERC-8004 reputation contract
```

## Key Features

### Agent Marketplace
- Browse available AI agents
- Filter by category, price range, and reputation
- Search functionality
- Agent detail pages with chat interface

### X402 Micropayments
- Pay-per-use model
- Instant payment processing
- USDC payments on Avalanche Fuji
- Payment verification and settlement

### ERC-8004 Reputation
- On-chain reputation scores
- Agent reputation tracking
- Trust and verification system

## Available Agents

- **DeFi Arbitrage Bot**: Cross-exchange arbitrage opportunities
- **Content Generator AI**: Automated content creation
- **Identity Validator Agent**: On-chain identity verification
- **Supply Chain Tracker**: Supply chain data logging
- **Smart Contract Auditor Agent**: Security analysis and vulnerability detection

## Development

### Adding New Agents

Agents are defined in `app/marketplace/page.tsx` in the `mockAgents` array. Each agent requires:
- `id`: Unique identifier
- `name`: Agent name
- `description`: Agent description
- `category`: Category (Finance, Content, Utility, Logistics, Security)
- `reputation`: ERC-8004 reputation score (0-5)
- `priceAvax`: Price in USDC per call
- `calls`: Total number of calls

### Payment Integration

Payment endpoints are in `app/api/basic/route.ts` and `app/api/premium/route.ts`. They use Thirdweb's X402 implementation for payment settlement.

### Deploying Your Own AI Agent

Users can deploy their own AI agents on Avalanche and make them available on the marketplace:

1. **Create Your Agent**: Develop your AI agent with the required functionality
2. **Deploy on Avalanche**: Deploy your agent smart contract on Avalanche Fuji testnet (or mainnet)
3. **Integrate X402 Payments**: Set up X402 micropayment endpoints for your agent
4. **Register on Marketplace**: Add your agent to the marketplace with:
   - Agent name and description
   - Category classification
   - Pricing (in USDC)
   - API endpoint for agent interactions
5. **Build Reputation**: As users interact with your agent, build on-chain reputation using ERC-8004

**Benefits of Deploying on Avalanche:**
- ⚡ **Fast Transactions**: Sub-second finality for quick agent interactions
- 💸 **Low Fees**: Cost-effective micropayments perfect for AI agent services
- 🔗 **Interoperability**: Connect with other Avalanche subnets and DeFi protocols
- 📈 **Scalability**: Handle high-volume agent requests efficiently

**Getting Started:**
- Visit the "Deploy Your Agent" section on the landing page
- Follow the deployment guide to set up your agent infrastructure
- Integrate with X402 payment protocol for monetization
- List your agent on the marketplace to start earning

## Learn More

- [Next.js Documentation](https://nextjs.org/)
- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [X402 Protocol](https://github.com/thirdweb-dev/x402)
- [ERC-8004 Standard](https://eips.ethereum.org/EIPS/eip-8004)
- [Avalanche Documentation](https://.avax.network/)

## License

MIT
