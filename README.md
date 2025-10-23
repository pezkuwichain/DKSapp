"# 🏛️ PezkuwiChain DKSapp

**Official Mobile Application for PezkuwiChain**  
*A Sovereign Blockchain for the Kurdish Nation*

[![GitHub](https://img.shields.io/badge/GitHub-pezkuwichain-blue)](https://github.com/pezkuwichain)
[![License](https://img.shields.io/badge/License-Kurdistan_Talent_Institute-green)](LICENSE)
[![Contributors](https://img.shields.io/badge/Contributors-156+-orange)](https://github.com/pezkuwichain/pezkuwi-sdk)
[![Status](https://img.shields.io/badge/Status-Beta_Testnet-yellow)](https://pezkuwichain.io)

---

## 📱 About DKSapp

DKSapp (Digital Kurdistan State App) is the official mobile interface for PezkuwiChain, providing a modern, user-friendly gateway to the world's first **Trust-enhanced Nominated Proof-of-Stake (TNPoS)** blockchain. Built on the battle-tested Polkadot SDK, PezkuwiChain serves as the digital infrastructure backbone for the Kurdish nation and its global diaspora.

### 🌟 Key Features

#### 🎯 Digital Citizenship Platform
- **Feature Gating System**: All users see all features, but Digital Citizens unlock exclusive access
- **Trust Score Gamification**: Build reputation through participation and earn rewards
- **Secure KYC Verification**: Privacy-preserving identity verification with local encryption
- **6 Languages**: English, Kurdî (Kurmancî), کوردی (سۆرانی), Türkçe, العربية, فارسی

#### 💰 Dual-Token Economy
- **HEZ Token**: Inflationary utility token for network security (DOT model)
- **PEZ Token**: Fixed-supply governance token (5 billion total)
- **Wallet**: Send, receive, and exchange HEZ/PEZ tokens
- **QR Scanner**: Quick payment and connection

#### 🗳️ Democratic Governance
- **Welati (Governance)**: Vote on proposals with trust-weighted voting power
- **Parliamentary System**: 201 elected digital representatives with monthly salaries
- **Transparent Treasury**: Community-controlled funds for ecosystem development
- **On-Chain Voting**: Full transparency and accountability

#### 📚 Education & Services
- **Perwerde (Education)**: Access courses, earn certifications, boost trust score
- **Digital Ministries**: Access to 12 Kurdistan Government services
- **Trust Hub**: Gamified reputation system with detailed score breakdown
- **Referral System**: Invite friends and earn PEZ rewards

---

## 🏗️ Architecture

### Tech Stack

**Frontend (Mobile)**
- Framework: **Expo** (React Native)
- Language: **TypeScript**
- Routing: **expo-router** (file-based)
- State Management: **Zustand**
- Internationalization: **react-i18next** (6 languages)
- UI: React Native components + **expo-linear-gradient**

**Backend**
- Framework: **FastAPI** (Python 3.11+)
- Database: **MongoDB**
- Authentication: Wallet-based + KYC
- API: RESTful with async/await

**Blockchain Integration**
- SDK: **Polkadot SDK / Substrate**
- Consensus: **TNPoS** (Trust-enhanced NPoS)
- Language: **Rust**
- Runtime: **WebAssembly** (Wasm)

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18
Python >= 3.11
MongoDB >= 5.0
Yarn or npm
Expo Go app (iOS/Android)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pezkuwichain/DKSapp.git
cd DKSapp
```

2. **Install frontend dependencies**
```bash
cd frontend
yarn install
```

3. **Install backend dependencies**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Backend (.env already configured)
cd backend
# Check .env for MongoDB connection

# Frontend (.env already configured)
cd ../frontend
# Check .env for API URL
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/data
```

6. **Start the backend**
```bash
cd backend
python server.py
# Runs on http://0.0.0.0:8001
```

7. **Start the frontend**
```bash
cd frontend
yarn start
# Or: expo start
```

8. **Test on mobile**
- Install **Expo Go** on your phone
- Scan the QR code from terminal
- App will load on your device

---

## 📂 Project Structure

```
DKSapp/
├── frontend/              # Expo React Native mobile app
│   ├── app/              # Screens (expo-router file-based routing)
│   │   ├── (tabs)/      # Bottom navigation screens
│   │   │   ├── index.tsx          # Dashboard
│   │   │   ├── wallet.tsx         # Wallet & Transactions
│   │   │   ├── qr-scanner.tsx     # QR Code Scanner
│   │   │   ├── trust-hub.tsx      # Trust Score Hub
│   │   │   └── profile.tsx        # User Profile
│   │   ├── auth/        # Authentication screens
│   │   ├── citizenship/ # KYC verification flow
│   │   └── features/    # Feature detail screens
│   ├── components/      # Reusable UI components
│   ├── i18n/           # Translations (6 languages)
│   │   └── translations/
│   │       ├── en.json  # English
│   │       ├── ku.json  # Kurdish Kurmanji
│   │       ├── ckb.json # Kurdish Sorani
│   │       ├── tr.json  # Turkish
│   │       ├── ar.json  # Arabic
│   │       └── fa.json  # Persian
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # API client & helpers
│   └── package.json    # Dependencies
│
├── backend/            # FastAPI Python server
│   ├── server.py      # Main API endpoints
│   ├── requirements.txt
│   └── .env           # Environment variables (not in git)
│
└── tests/             # Test files
```

---

## 🌍 Multi-Language Support

DKSapp supports 6 languages for true global accessibility:

| Language | Code | Script | Speakers |
|----------|------|--------|----------|
| 🇬🇧 English | `en` | Latin | International |
| 🟥🟨🟩 Kurdî (Kurmancî) | `ku` | Latin | ~15M Northern Kurdistan |
| 🟥🟨🟩 کوردی (سۆرانی) | `ckb` | Arabic | ~8M Southern Kurdistan |
| 🇹🇷 Türkçe | `tr` | Latin | Turkey diaspora |
| 🇸🇦 العربية | `ar` | Arabic | Middle East region |
| 🇮🇷 فارسی | `fa` | Arabic | Iran diaspora |

---

## 🔑 Core Concepts

### 🎭 Feature Gating System

All features are **visible** to all users, but **gated features** require Digital Citizenship:

✅ **Public Features** (Always Accessible):
- Wallet: Send, Receive, Exchange
- Stake, Liquidity, Bridge
- Analytics, Identity
- Digital Ministries access

🔒 **Citizen-Only Features** (Gated):
- **Welati (Governance)**: Vote on proposals
- **Perwerde (Education)**: Access courses & certifications
- **Health & Social**: Government services
- **Parliamentary**: Enhanced governance powers

**The UX Strategy**: Users see locked features, creating curiosity and incentive to become citizens!

### 🛡️ Trust Score System

Your reputation score that unlocks benefits and rewards:

| Component | Points | How to Earn |
|-----------|--------|-------------|
| **Base Score** | +100 | Automatic (everyone starts here) |
| **Citizenship Bonus** | +400 | Complete KYC verification |
| **Education Bonus** | +50/course | Complete Perwerde courses |
| **Governance Bonus** | +10/vote | Vote on Welati proposals |
| **Validator Bonus** | Variable | Run a validator node |

**Max Score**: 1000+ points  
**Benefits**: Higher trust = Higher PEZ rewards, Enhanced voting power, Priority access

### 💎 Dual-Token Model

#### HEZ Token (Security Layer)
- **Purpose**: Network security, transaction fees, daily use
- **Supply**: Inflationary (~10% annually, DOT model)
- **Staking**: Secures network, earns rewards
- **Trust Impact**: ❌ **NO** - Trust-independent (proven security)

#### PEZ Token (Governance Layer)
- **Purpose**: Governance, voting, trust-weighted rewards
- **Supply**: Fixed 5 billion (deflationary)
- **Halving**: 48-month cycles (like Bitcoin)
- **Trust Impact**: ✅ **YES** - Higher trust = Higher PEZ rewards

**Key Innovation**: Separation of security (HEZ) from governance (PEZ) allows proven economics without experimental risks!

---

## 🏛️ Digital Government Integration

### Kurdistan Digital Ministries

Access 12 government services directly from the app:

| Ministry | Kurdish Name | URL |
|----------|--------------|-----|
| 🏛️ Prime Ministry | Serokwezîrî | serokweziri.pezkuwichain.io |
| 🌍 Foreign Affairs | Derve | derve.pezkuwichain.io |
| 📚 Education | Perwerde | perwerde.pezkuwichain.io |
| 🏥 Health | Tenduristî | tenduristi.pezkuwichain.io |
| 🛡️ Interior | Navxwe | navxwe.pezkuwichain.io |
| ⚖️ Justice | Dadwerî | dadweri.pezkuwichain.io |
| 💰 Finance | Darayî | darayi.pezkuwichain.io |
| 🪖 Defense | Bergiranî | bergirani.pezkuwichain.io |
| 🌾 Agriculture | Çandinî | candini.pezkuwichain.io |
| ⚡ Energy | Werzî | werzi.pezkuwichain.io |
| 🚗 Transport | Veguhestin | veguhestin.pezkuwichain.io |
| 🎭 Culture & Tourism | Çand û Gerî | cand.pezkuwichain.io |

---

## 🎓 For Developers

### API Endpoints

```typescript
// Authentication
POST /api/auth/signup      // Create wallet
POST /api/auth/login       // Login with wallet

// User & Wallet
GET  /api/user/{user_id}
GET  /api/user/{user_id}/wallet

// Trust Score
GET  /api/trust-score/{user_id}

// KYC (Citizenship)
POST /api/kyc/submit/{user_id}

// Transactions
POST /api/transactions/{user_id}
GET  /api/transactions/{user_id}

// Governance
GET  /api/governance/proposals
POST /api/governance/vote/{user_id}

// Education
GET  /api/education/courses
POST /api/education/enroll/{user_id}
GET  /api/education/my-courses/{user_id}

// Feature Access Control
GET  /api/features/check/{user_id}?feature={name}
```

### Running Locally

**Backend**:
```bash
cd backend
python server.py
# API available at http://localhost:8001
```

**Frontend**:
```bash
cd frontend
yarn start
# Expo DevTools at http://localhost:3000
```

### Testing

```bash
# Backend API test
curl http://localhost:8001/api/

# Create test user
curl -X POST http://localhost:8001/api/auth/signup \
  -H \"Content-Type: application/json\" \
  -d '{\"email\": \"test@pezkuwi.com\"}'
```

---

## 🎨 Screenshots

### Welcome & Authentication
Multi-language selection and secure wallet creation

### Dashboard
- Real-time HEZ/PEZ balances
- Trust Score visualization
- Feature gating demonstration
- Become a Digital Citizen CTA

### Governance
- Active proposals
- Trust-weighted voting
- Transparent vote counting

### Trust Hub
- Detailed score breakdown
- Gamified progression system
- How to increase your score

---

## 🌐 PezkuwiChain Ecosystem

### Blockchain Specifications

| Specification | Value |
|--------------|-------|
| **Consensus** | TNPoS (Trust-enhanced NPoS) |
| **Framework** | Polkadot SDK / Substrate |
| **Language** | Rust |
| **Block Time** | ~6 seconds (BABE) |
| **Finality** | ~12-18 seconds (GRANDPA) |
| **Validators** | 100+ (scalable) |
| **Contributors** | 156+ global developers |

### Innovation: TNPoS Consensus

PezkuwiChain introduces a **dual-layer consensus** mechanism:

1. **HEZ Security Layer**: Uses proven DOT model for network security
   - Trust-independent staking rewards
   - Equal base validator rewards
   - Battle-tested economics (secures $10B+ on Polkadot)

2. **PEZ Governance Layer**: Trust-weighted reward distribution
   - Higher trust score = Higher PEZ rewards
   - Incentivizes long-term commitment
   - No impact on network security

**Key Innovation**: Separates security concerns from governance innovation!

### Parliamentary NFT System

- **201 Elected Representatives**: Democratic parliament on-chain
- **4-Year Terms**: Elections via Welati governance
- **Monthly Salaries**: 10% of PEZ rewards pool
- **Full Accountability**: On-chain voting records and performance tracking

---

## 🛣️ Roadmap

| Phase | Status | Timeline | Milestone |
|-------|--------|----------|-----------|
| Alfa Testnet | ✅ Complete | Q1 2024 | Initial network launch |
| Beta Testnet Phase 1 | ✅ Complete | Q2 2024 | Network stability & validators |
| Beta Testnet Phase 2 | ✅ Complete | Q3 2024 | Dual-token integration |
| Benchmarking | ✅ Complete | Q1 2025 | Performance optimization |
| Security Audits | 🔜 Upcoming | Q3 2025 | Independent audits |
| Parliamentary NFT | 🔜 Upcoming | Q3 2025 | 201 NFT system deployment |
| **Mainnet Launch** | 🎯 Target | Q4 2025 | Production network |
| Parachain Integration | 🔮 Future | 2026 | Polkadot/Kusama connection |

---

## 💡 Use Cases

### 🆔 Digital Identity
- Sovereign digital ID for all citizens
- KYC/AML compliant verification
- Cross-border recognition
- Healthcare and government records

### 🗳️ Democratic Participation  
- Direct democracy via Welati proposals
- Transparent budget allocation
- Parliamentary elections every 4 years
- Liquid democracy with vote delegation

### 🎓 Education & Credentials
- Tamper-proof academic certificates
- Professional licenses and badges
- Skill verification for employers
- Lifelong learning records

### 💳 Decentralized Finance
- Cross-border remittances
- Decentralized exchanges (DEX)
- Lending protocols
- Kurdish Dinar-pegged stablecoins

---

## 👥 Team & Community

**Led by**: Kurdistan Tech Ministry  
**Contributors**: 156+ global developers (as of October 2025)  
**Community**: Kurdish diaspora, blockchain developers, governance enthusiasts

### Core Teams
- 🛠️ **Core Developers**: Runtime development, custom pallets
- 🔬 **Research Team**: Cryptographers, economists, TNPoS research
- 🌐 **Infrastructure**: Node operators, DevOps, monitoring
- 📝 **Documentation**: Technical writers, 6-language translators
- 🎨 **Design**: UI/UX for mobile and web applications

---

## 🤝 Contributing

We welcome contributions from developers, designers, translators, and community members!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript/Python best practices
- Add tests for new features
- Update documentation
- Use conventional commits
- Respect code review process

---

## 📄 License

This project is licensed under the **Kurdistan Talent Institute License** - an open and permissive license that encourages innovation and collaboration.

---

## 🔗 Links & Resources

### Official Channels
- 🌐 **Website**: [pezkuwichain.io](https://pezkuwichain.io)
- 📘 **Main GitHub**: [pezkuwichain/pezkuwi-sdk](https://github.com/pezkuwichain/pezkuwi-sdk)
- 📱 **App GitHub**: [pezkuwichain/DKSapp](https://github.com/pezkuwichain/DKSapp)

### Social Media
- 🐦 **X (Twitter)**: [@PezkuwiChain](https://x.com/PezkuwiChain)
- 📘 **Facebook**: [PezkuwiChain](https://www.facebook.com/profile.php?id=61582484611719)
- 💬 **Discord**: [Join Community](https://discord.gg/YqA5TfVB)

### Contact
- 📧 **General**: info@pezkuwichain.io
- 🔧 **Technical**: tech@kurdistan.gov

### Documentation
- 📖 **Whitepaper**: [Technical Whitepaper v3.0](https://pezkuwichain.io/whitepaper)
- 📚 **Substrate Docs**: [docs.substrate.io](https://docs.substrate.io)
- 🦀 **Polkadot SDK**: [Polkadot SDK Docs](https://docs.polkadot.com)

---

## ⚠️ Important Notes

### Current Status: Beta Testnet (Pre-Mainnet)

This mobile app currently connects to a **simulated backend** for demonstration purposes. 

**For Production Use**:
- Connect to actual PezkuwiChain testnet nodes
- Integrate with Polkadot SDK APIs
- Use real cryptographic wallet generation
- Implement secure key storage

**Mainnet Launch**: Q4 2025 (Target)

### Security Disclaimer

🔒 **This is a beta application**. Do not use for production funds until mainnet launch.

- KYC data is encrypted locally but this is pre-audit
- Wallet generation is simulated (use real keys on mainnet)
- Smart contracts are not yet audited
- Test with small amounts only on testnet

---

## 📊 Network Stats (Beta Testnet)

- **Validators**: 100+ active nodes
- **Total Staked**: Growing daily
- **Proposals Submitted**: Active governance
- **Citizens Registered**: Beta testers
- **Trust Scores**: Gamification active

---

## 🌟 Vision

**Building the Digital Future of Kurdistan**

PezkuwiChain isn't just a blockchain—it's a comprehensive digital infrastructure for a nation. By combining:

- 🔐 **Battle-tested security** (Polkadot SDK)
- 🎯 **Cultural alignment** (Kurdish-first design)
- 🗳️ **Democratic governance** (Welati + Parliamentary NFTs)
- 📚 **Education platform** (Perwerde certifications)
- 🆔 **Sovereign identity** (identity-kyc pallet)
- 🌍 **Global accessibility** (6 languages)

We're creating the foundation for digital sovereignty that serves tens of millions across the Kurdish regions and diaspora.

---

## 🙏 Acknowledgments

- **Polkadot & Parity Technologies**: For the incredible Substrate framework
- **Web3 Foundation**: For supporting blockchain innovation
- **Kurdistan Tech Ministry**: For leadership and funding
- **156+ Contributors**: For dedicating time and expertise
- **Kurdish Community**: For believing in digital sovereignty

---

## 📝 Citation

If you use PezkuwiChain in your research or project, please cite:

```bibtex
@misc{pezkuwichain2025,
  title={PezkuwiChain: A Sovereign Blockchain for the Kurdish Nation},
  author={Kurdistan Tech Ministry and PezkuwiChain Contributors},
  year={2025},
  howpublished={\\url{https://github.com/pezkuwichain/pezkuwi-sdk}},
  note={Technical Whitepaper v3.0}
}
```

---

## 🚨 Disclaimer

This mobile application is for informational and testing purposes. The PEZ and HEZ tokens are utility tokens designed for use within the PezkuwiChain ecosystem. They are not intended as investment vehicles. 

Please consult with legal and financial advisors before participating. Cryptocurrency regulations vary by jurisdiction.

---

**Built with ❤️ by the Kurdish Nation for Digital Sovereignty**

*Version 1.0 | October 2025*
"
