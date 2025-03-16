#!/usr/bin/env node

/**
 * RECO (Relational Entity Compositional Operating) Metasystem
 * Core implementation for TeglonLabs/topOS integration
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Configuration
const PORT = process.env.PORT || 3037;
const WORLDS_DIR = process.env.WORLDS_DIR || './exports/infinity-topos-worlds';
const DB_PATH = process.env.DB_PATH || './exports/messages-vibes.duckdb';

// Initialize Express
const app = express();
app.use(express.json());

// URI Protocol handlers
const protocolHandlers = {
  // World protocol handler
  world: async (uri) => {
    const parts = uri.split('/');
    const worldId = parts[0];
    
    try {
      const worldPath = path.join(WORLDS_DIR, worldId, '_.json');
      const metadata = await fs.readFile(path.join(WORLDS_DIR, worldId, 'metadata.json'), 'utf8')
        .catch(() => JSON.stringify({ name: worldId, description: "World data" }));
      
      if (parts.length === 1) {
        // Return world metadata
        return { success: true, protocol: 'world', id: worldId, metadata: JSON.parse(metadata) };
      } else if (parts[1] === 'entities') {
        // Handle entity operations
        if (parts.length === 2) {
          // List all entities
          return { success: true, protocol: 'world', operation: 'list_entities', worldId };
        } else {
          // Get specific entity
          const entityId = parts[2];
          return { 
            success: true, 
            protocol: 'world', 
            operation: 'get_entity',
            worldId,
            entityId,
            entity: { id: entityId, world: worldId }
          };
        }
      }
      
      return { success: false, error: "Invalid world:// URI format" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  
  // Worm protocol handler
  worm: async (uri) => {
    const parts = uri.split('/');
    
    if (parts.length >= 2) {
      const source = parts[0];
      const destination = parts[1];
      const filter = parts[2] || null;
      
      return {
        success: true,
        protocol: 'worm',
        source,
        destination,
        filter,
        connection: `Connection from ${source} to ${destination} established`
      };
    }
    
    return { success: false, error: "Invalid worm:// URI format" };
  },
  
  // Diagram protocol handler
  diagram: async (uri) => {
    const parts = uri.split('/');
    
    if (parts.length >= 2) {
      const type = parts[0];
      const id = parts[1];
      
      return {
        success: true,
        protocol: 'diagram',
        type,
        id,
        visualization: `Generated ${type} diagram for ${id}`
      };
    }
    
    return { success: false, error: "Invalid diagram:// URI format" };
  },
  
  // Vibe protocol handler
  vibe: async (uri) => {
    const parts = uri.split('/');
    
    if (parts.length >= 2) {
      const entity = parts[0];
      const context = parts[1];
      
      // Generate a random trust value between -1 and 1
      const trustValue = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      
      return {
        success: true,
        protocol: 'vibe',
        entity,
        context,
        trust: trustValue,
        confidence: Math.random(),
        description: `Trust data for ${entity} in context ${context}`
      };
    }
    
    return { success: false, error: "Invalid vibe:// URI format" };
  },
  
  // Universal protocol handler
  _: async (uri) => {
    const parts = uri.split('/');
    
    if (parts.length >= 2) {
      const type = parts[0];
      const resource = parts.slice(1).join('/');
      
      return {
        success: true,
        protocol: '_',
        type,
        resource,
        extracted: `Extracted content from ${type}://${resource}`,
        summary: "This is a superhuman extraction of the resource content"
      };
    }
    
    return { success: false, error: "Invalid _:// URI format" };
  }
};

// Setup API routes
app.post('/api/resolve', async (req, res) => {
  try {
    const { uri } = req.body;
    
    if (!uri) {
      return res.status(400).json({ success: false, error: "URI is required" });
    }
    
    // Parse the URI
    const match = uri.match(/^(\w+):\/\/(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, error: "Invalid URI format" });
    }
    
    const [_, protocol, path] = match;
    
    // Check if we have a handler for this protocol
    if (!protocolHandlers[protocol]) {
      return res.status(400).json({ success: false, error: `Unsupported protocol: ${protocol}://` });
    }
    
    // Handle the request
    const result = await protocolHandlers[protocol](path);
    res.json(result);
    
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    system: "TeglonLabs/topOS RECO Metasystem",
    status: "operational",
    protocols: Object.keys(protocolHandlers).map(p => p === '_' ? '_://' : `${p}://`),
    version: "1.0.0"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`
┌─────────────────────────────────────────────────────────┐
│                   TeglonLabs/topOS                      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│ world://    │ worm://     │ diagram://  │ vibe://      │
│ Entity Space│ Flow Logic  │ Visual Maps │ Trust Network│
├─────────────┴─────────────┴─────────────┴──────────────┤
│            RECO Operating Metasystem v1.0.0            │
└─────────────────────────────────────────────────────────┘
  `);
  console.log(`RECO metasystem running on port ${PORT}`);
  console.log(`Supported protocols: world://, worm://, diagram://, vibe://, _://`);
  console.log(`Try: curl -X POST http://localhost:${PORT}/api/resolve -H "Content-Type: application/json" -d '{"uri":"vibe://k/global"}'`);
});