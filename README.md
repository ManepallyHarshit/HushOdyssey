# Hush Odyssey

## Project Architecture

```
hush-odyssey/
├── blockchain/                # THE LEDGER
│   ├── contracts/             # GenesisProtocol.sol (ERC-1155 POAP contract)
│   └── hardhat.config.js      # Hush Chain RPC + Chain ID config
├── unity/                     # THE SIMULATION
│   ├── Assets/Scripts/        # HushCatController.cs, WebGLBridge.cs, GemPickup.cs
│   ├── Assets/Plugins/        # WebGLBridge.jslib (Unity → Browser bridge)
│   └── Build/                 # Exported WebGL files
├── backend/                   # THE MEMORY (No DB — in-memory session store)
│   ├── models/Player.js       # Player state model
│   └── server.js              # Express API
└── frontend/                  # THE CONSOLE (React + Vite)
    ├── public/unity/          # ← Drop Unity WebGL build here
    ├── src/
    │   ├── App.jsx            # Master Scroll Container
    │   ├── components/        # Header, GameCanvas, BentoHUD, Footer, etc.
    │   ├── hooks/             # useWallet, useMint, useUnityBridge
    │   └── contracts/         # GenesisProtocol.json ABI
    └── vite.config.js
```

## Network

| Field          | Value                                  |
|----------------|----------------------------------------|
| Network Name   | Hush Chain                             |
| Chain ID       | 47755852468                            |
| RPC URL        | https://rpc.hushnetworks.in            |
| Currency       | HUSH                                   |
| Contract       | 0x1BbEB15714eB2f666D28C1762a97cB170B08B6d5 |

## Quick Start

### Frontend (The Console)
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Backend (The Memory)
```bash
cd backend
node server.js     # (optional — frontend degrades gracefully without it)
```

### Unity → React Bridge
1. Export Unity WebGL to `frontend/public/unity/Build/`
2. The React app auto-connects via `useUnityWebBridge`
3. Player beats level → `GenesisAltar.cs` calls `JS_TriggerPoapMint` →
   React opens MetaMask → `mintGenesis()` is signed on Hush Chain

## Gameplay Loop
1. Control the HushCat through neon grasslands
2. Collect gems (each pickup updates React's Bento HUD via `SyncScore`)
3. Deposit all gems at the Genesis Altar
4. MetaMask prompts to sign the POAP mint on Hush Chain
5. POAP is archived forever on the blockchain
