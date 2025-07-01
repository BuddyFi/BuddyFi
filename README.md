# BuddyFi

Find your perfect teammate for hackathons or side projects

**BuddyFi** is a Solana-based web platform that helps developers match with the perfect teammates for hackathons and side projects using **on-chain profiles**, **skill-based matching**, and a familiar **swipe-to-connect interface**.

> Built with Solana, IPFS, and Compressed NFTs to enable decentralized identity and team formation for the next generation of builders.

---

## Live Demo

👉 [https://www.buddyfi.xyz](https://www.buddyfi.xyz)  
Currently live on **Solana Devnet**

---

## Key Features

- 🔐 **Solana Wallet Login** – Seamless authentication using Phantom or any Solana wallet
- 🧬 **Decentralized Profiles** – IPFS-stored metadata + on-chain hash for tamper-proof builder identity
- 🎯 **Skill-Based Matchmaking** – Swipe right/left to match with compatible teammates
- 🛠️ **Team Dashboard** – Shared workspace for task management, progress tracking, and collaboration
- 🎖️ **cNFT Badge System** – Earn and show off hackathon milestones with compressed NFTs
- 💳 **Solana Pay Integration** – Subscription model with a 15-day free trial

---

## Tech Stack

| Category             | Stack                                                                 |
|----------------------|-----------------------------------------------------------------------|
| Framework         | Next.js 15+, TypeScript, TailwindCSS                                  |
| Blockchain        | Solana (Devnet), Anchor, Solana Pay                                   |
| Storage           | IPFS (via Web3.Storage), Arweave (future metadata snapshots)          |
| Smart Matching     | Custom logic for skill/tag-based pairing                              |
| NFT Integration    | Compressed NFTs (cNFTs) for badges and access tokens                  |

---

## Roadmap

| Quarter       | Milestone                                  |
|---------------|---------------------------------------------|
| Q2 2025       | MVP on Solana Devnet (profiles, swipe, dashboard) |
| Q3 2025       | Mainnet launch + cNFT badges + mobile UX upgrade |
| Q4 2025       | Hackathon integrations + event calendar |
| Q1 2025       | Open source SDK + team creation tools   |

---

## Local Development

### Prerequisites

- Node.js 18+
- Yarn or npm
- Phantom Wallet (for dev testing)
- Solana CLI (`solana config set --url https://api.devnet.solana.com`)

### Setup

```bash
git clone https://github.com/your-org/buddyfi.git
cd buddyfi
npm install
npm run dev
```
