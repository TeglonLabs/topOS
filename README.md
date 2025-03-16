# Pensieve - TeglonLabs/topOS

## Overview

Pensieve is a powerful WebGPU-capable MCP worlding environment for exploring and analyzing communication data through the TeglonLabs/topOS framework:

- **Data Extraction**: Extract messages from secure messaging platforms
- **Infinity-Topos Integration**: Map message data into higher categorical structures
- **Trust Polarization Models**: Analyze relationship dynamics using balanced ternary logic
- **Chromatic Compositional Analysis**: Visualize obstructions in compositions
- **WebGPU Acceleration**: Hardware-accelerated visualization of high-dimensional embeddings
- **Universal URI Scheme**: Access resources through `world://`, `worm://`, `diagram://`, `vibe://`, `_://` protocols

### TeglonLabs/topOS Framework

The topOS framework implements a comprehensive RECO (Relational Entity Compositional Operating) metasystem:

```
┌─────────────────────────────────────────────────────────┐
│                   TeglonLabs/topOS                      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│ world://    │ worm://     │ diagram://  │ vibe://      │
│ Entity Space│ Flow Logic  │ Visual Maps │ Trust Network│
├─────────────┴─────────────┴─────────────┴──────────────┤
│               WebGPU Accelerated Runtime               │
├─────────────────────────────────────────────────────────┤
│              Balanced Ternary Ising Model              │
├─────────────────────────────────────────────────────────┤
│             Homology-Aware Embeddings (H₀...H₃)         │
└─────────────────────────────────────────────────────────┘
```

The system operates as a superhuman information reflow mechanism that can extract, transform, and visualize information from any source using:

1. **World System**: Entity spaces accessed via `world://[id]`
2. **Worm System**: Information flow pathways via `worm://[source]/[destination]`
3. **Diagram System**: Visual mapping through `diagram://[type]/[id]`
4. **Vibe System**: Trust and relationship networks via `vibe://[entity]/[context]`
5. **Universal Accessor**: Resource-agnostic operations through `_://[path]`

### vibes.lol Information Reflow System

The vibes.lol scheme forms the core of the topOS trust infrastructure, providing:

- **Superhuman Extraction**: Ability to process and extract meaning from any website or data source
- **Compositional Access**: Entity-relationship trust flows with balanced ternary values
- **Energy Minimization**: Ising model-based trust field stabilization
- **Homology Preservation**: Topology-aware embeddings that maintain relationship structures

## Getting Started

To use this, you'll need to make a copy of your Signal Desktop data. You must
make a copy, so that there is no possibility of corrupting your Signal data.
Quit Signal first, so that nothing is writing to the data while you are copying
it.

Signal "upgraded" data storage to use the platform keychain. On MacOS, use Keychain Access to access the "Signal Safe Storage" keychain entry.

The location of that data is platform dependent. On MacOS, for instance, you
could do
```
cp -a ~/Library/Application\ Support/Signal/ ~/data/signal/2023-11-23/
```
Adjust file paths as appropriate. Next, set the STORAGE_PATH in `.env.local`:
```
STORAGE_PATH=~/data/signal/2023-11-23
KEYCHAIN_PASSWORD=THE_VALUE_FROM_KEYCHAIN_ACCESS
```
Then you are ready to follow the instructions below.

## WebGPU MCP Server

The TeglonLabs/topOS system includes a WebGPU-capable MCP server for visualizing high-dimensional embeddings:

```bash
# Start the WebGPU MCP worlding environment
npm run topos-webgpu

# Or use the Just command
just topos-webgpu
```

Access the visualization interface at http://localhost:3036 using a WebGPU-capable browser like Servo.

## URI Protocol Examples

```javascript
// Access entity in a world
fetch('world://s/entities/k')  // Access entity 'k' in world 's'

// Create information flow
connect('worm://s/b')  // Connect worlds 's' and 'b'

// Generate diagram
render('diagram://trust/network')  // Render trust network diagram

// Access trust data
analyze('vibe://k/global')  // Analyze global trust for entity 'k'

// Universal resource access
extract('_://web/example.com/page')  // Extract from any resource
```

## Next.js Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.