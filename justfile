# Pensieve justfile - TeglonLabs/topOS Integration
# Run commands with: just <command>

# Default recipe when just is called without arguments
default:
    @just --list

# Start the development server
dev:
    npm run dev

# Build the Next.js application
build:
    npm run build

# Start the production server
start:
    npm run start

# Run ESLint
lint:
    npm run lint

# Launch the TeglonLabs/topOS WebGPU MCP worlding environment
topos-webgpu:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching TeglonLabs/topOS WebGPU worlding environment..."
    if [ ! -f "./scripts/webgpu-embedding-client.js" ]; then
        echo "Error: Client script not found at ./scripts/webgpu-embedding-client.js"
        exit 1
    fi
    
    # Check if Node.js packages are available
    if ! node -e "try { require('express'); require('http-proxy-middleware'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing required packages..."
        npm install --no-save express http-proxy-middleware
    fi
    
    # Start the client
    node scripts/webgpu-embedding-client.js

# Launch the TeglonLabs/topOS Trust Visualizer
trust-visualizer:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching TeglonLabs/topOS Trust Visualizer..."
    if [ ! -f "./scripts/trust-visualizer.js" ]; then
        echo "Error: Visualizer script not found at ./scripts/trust-visualizer.js"
        exit 1
    fi
    
    # Check if Node.js packages are available
    if ! node -e "try { require('express'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing required packages..."
        npm install --no-save express
    fi
    
    # Start the trust visualizer
    node scripts/trust-visualizer.js

# Launch the TeglonLabs/topOS CLI client
topos-client:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching TeglonLabs/topOS client..."
    if [ ! -f "./scripts/topos-client.js" ]; then
        echo "Error: Client script not found at ./scripts/topos-client.js"
        exit 1
    fi
    
    # Check if required packages are available
    if ! node -e "try { require('node-fetch'); require('chalk'); require('boxen'); require('table'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing required packages..."
        npm install --no-save node-fetch chalk boxen table
    fi
    
    # Pass arguments to the client
    node scripts/topos-client.js "$@"

# Launch all TeglonLabs/topOS components
topos-all:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching all TeglonLabs/topOS components..."
    
    # Check if concurrently is available
    if ! command -v concurrently &> /dev/null; then
        echo "Installing concurrently..."
        npm install --no-save concurrently
    fi
    
    # Start all components
    npx concurrently -n "RECO,WEBGPU,TRUST" -c "blue,green,magenta" \
        "npm run reco-log" \
        "npm run topos-webgpu" \
        "npm run trust-visualizer"

# Launch the RECO (Relational Entity Compositional Operating) metasystem
reco-operating-metasystem:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching RECO operating metasystem..."
    if [ ! -f "./scripts/reco-operating-metasystem.js" ]; then
        echo "Error: RECO script not found. Creating minimal implementation..."
        
        # Create minimal implementation
        cat > ./scripts/reco-operating-metasystem.js << 'EOF'
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
EOF
        
        # Make executable
        chmod +x ./scripts/reco-operating-metasystem.js
    fi
    
    # Check if Node.js packages are available
    if ! node -e "try { require('express'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing required packages..."
        npm install --no-save express
    fi
    
    # Start the RECO metasystem
    node scripts/reco-operating-metasystem.js

# Create a new vibes.lol trust network
create-vibes-network ENTITIES="k,y,b,l" WORLD="s":
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Creating vibes.lol trust network for entities: {{ENTITIES}} in world: {{WORLD}}"
    
    # Create directory if it doesn't exist
    mkdir -p ./exports/vibes-network
    
    # Generate a simple JSON representation of the trust network
    cat > ./exports/vibes-network/trust-network.json << EOF
{
  "worldId": "{{WORLD}}",
  "entities": [$(echo "{{ENTITIES}}" | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "trustMatrix": {
    $(for entity in $(echo "{{ENTITIES}}" | tr ',' '\n'); do
      echo "    \"$entity\": {"
      for target in $(echo "{{ENTITIES}}" | tr ',' '\n'); do
        if [ "$entity" != "$target" ]; then
          # Generate random trust value (-1, 0, or 1)
          trust_value=$((RANDOM % 3 - 1))
          echo "      \"$target\": $trust_value,"
        fi
      done
      echo "    },"
    done)
  },
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "description": "Trust network generated by TeglonLabs/topOS vibes.lol scheme"
}
EOF
    
    echo "Trust network created at ./exports/vibes-network/trust-network.json"
    echo "Use 'just topos-webgpu' to visualize this network"

# Extract all messages from Signal database (standard method)
extract-messages *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Check if the database exists
    if [ -z "${STORAGE_PATH:-}" ]; then
        echo "ERROR: STORAGE_PATH environment variable not set"
        echo "Please set STORAGE_PATH to the directory containing your Signal database"
        echo ""
        echo "For standard installations:"
        echo "  - macOS: export STORAGE_PATH=\"$HOME/Library/Application Support/Signal\""
        echo "  - Linux: export STORAGE_PATH=\"$HOME/.config/Signal\""
        echo "  - Windows: \$env:STORAGE_PATH=\"\$env:APPDATA\\Signal\""
        echo ""
        echo "For custom installations, find the directory containing config.json and sql/db.sqlite"
        echo "Example: export STORAGE_PATH=\"/Users/barton/infinity-topos/worlds/i/ies/Signal\""
        exit 1
    fi
    
    # Check for required files
    if [ ! -f "$STORAGE_PATH/config.json" ]; then
        echo "ERROR: Signal config file not found at $STORAGE_PATH/config.json"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    if [ ! -f "$STORAGE_PATH/sql/db.sqlite" ]; then
        echo "ERROR: Signal database not found at $STORAGE_PATH/sql/db.sqlite"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    # Check for keychain password
    if [ -z "${KEYCHAIN_PASSWORD:-}" ]; then
        echo "ERROR: KEYCHAIN_PASSWORD environment variable not set"
        echo "This is needed to decrypt the Signal database"
        exit 1
    fi
    
    # Create exports directory if it doesn't exist
    mkdir -p exports
    
    # Run the extraction script
    echo "Starting message extraction..."
    node scripts/extract-messages.mjs {{ARGS}}

# Extract all messages using direct CommonJS script (more reliable)
extract-direct *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    export TODAY=$(date +%Y-%m-%d)
    
    # Check if the database exists
    if [ -z "${STORAGE_PATH:-}" ]; then
        echo "ERROR: STORAGE_PATH environment variable not set"
        echo "Please set STORAGE_PATH to the directory containing your Signal database"
        echo ""
        echo "For standard installations:"
        echo "  - macOS: export STORAGE_PATH=\"$HOME/Library/Application Support/Signal\""
        echo "  - Linux: export STORAGE_PATH=\"$HOME/.config/Signal\""
        echo "  - Windows: \$env:STORAGE_PATH=\"\$env:APPDATA\\Signal\""
        echo ""
        echo "For custom installations, find the directory containing config.json and sql/db.sqlite"
        echo "Example: export STORAGE_PATH=\"/Users/barton/infinity-topos/worlds/i/ies/Signal\""
        exit 1
    fi
    
    # Check for required files
    if [ ! -f "$STORAGE_PATH/config.json" ]; then
        echo "ERROR: Signal config file not found at $STORAGE_PATH/config.json"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    if [ ! -f "$STORAGE_PATH/sql/db.sqlite" ]; then
        echo "ERROR: Signal database not found at $STORAGE_PATH/sql/db.sqlite"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    # Check for keychain password
    if [ -z "${KEYCHAIN_PASSWORD:-}" ]; then
        echo "ERROR: KEYCHAIN_PASSWORD environment variable not set"
        echo "This is needed to decrypt the Signal database"
        exit 1
    fi
    
    # Create exports directory if it doesn't exist
    mkdir -p exports
    
    # Run the extraction script
    echo "Starting direct extraction (CommonJS)..."
    node scripts/extract-direct.js --output=./exports/messages-$TODAY.json {{ARGS}}

# Check how many messages are in the Signal database
count-messages:
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Check if the database exists
    if [ -z "${STORAGE_PATH:-}" ]; then
        echo "ERROR: STORAGE_PATH environment variable not set"
        echo "Please set STORAGE_PATH to the directory containing your Signal database"
        echo ""
        echo "For standard installations:"
        echo "  - macOS: export STORAGE_PATH=\"$HOME/Library/Application Support/Signal\""
        echo "  - Linux: export STORAGE_PATH=\"$HOME/.config/Signal\""
        echo "  - Windows: \$env:STORAGE_PATH=\"\$env:APPDATA\\Signal\""
        echo ""
        echo "For custom installations, find the directory containing config.json and sql/db.sqlite"
        echo "Example: export STORAGE_PATH=\"/Users/barton/infinity-topos/worlds/i/ies/Signal\""
        exit 1
    fi
    
    # Check for required files
    if [ ! -f "$STORAGE_PATH/config.json" ]; then
        echo "ERROR: Signal config file not found at $STORAGE_PATH/config.json"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    if [ ! -f "$STORAGE_PATH/sql/db.sqlite" ]; then
        echo "ERROR: Signal database not found at $STORAGE_PATH/sql/db.sqlite"
        echo "Make sure STORAGE_PATH points to the main Signal data directory"
        exit 1
    fi
    
    # Check for keychain password
    if [ -z "${KEYCHAIN_PASSWORD:-}" ]; then
        echo "ERROR: KEYCHAIN_PASSWORD environment variable not set"
        echo "This is needed to decrypt the Signal database"
        exit 1
    fi
    
    echo "Counting messages in Signal database..."
    echo "This might take a moment..."
    
    # Use Node.js to execute a small script that connects to the database and counts messages
    node -e "
    const connect = require('./lib/db.js').default;
    connect().then(db => {
        const countStmt = db.prepare('SELECT COUNT(*) as total FROM messages');
        const { total } = countStmt.get();
        console.log(\`Total messages: \${total.toLocaleString()}\`);
        process.exit(0);
    }).catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
    "

# Export messages to CSV (for easier data analysis)
export-csv *ARGS:
    node scripts/convert-to-csv.js {{ARGS}}

# Export messages to DuckDB using Node.js
export-duckdb *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Create exports directory if it doesn't exist
    mkdir -p exports
    
    # Check if duckdb CLI is installed (optional but helpful for querying)
    if ! command -v duckdb &> /dev/null; then
        echo "NOTE: DuckDB CLI is not installed (optional)"
        echo "You can install it with: brew install duckdb"
        echo "The export will still work, but you won't be able to run 'just duckdb-query'"
        echo ""
    fi
    
    # Check if DuckDB Node.js package is available
    if ! node -e "try { require('duckdb'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing duckdb package..."
        npm install --no-save duckdb
        
        # Verify installation
        if ! node -e "try { require('duckdb'); } catch(e) { console.error(e); process.exit(1); }"; then
            echo "ERROR: Failed to install duckdb Node.js package"
            exit 1
        fi
    fi
    
    # Run the export script
    echo "Starting DuckDB export..."
    node scripts/export-to-duckdb.mjs {{ARGS}}

# Export messages to DuckDB using Babashka
export-duckdb-bb *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Check if babashka is installed
    if ! command -v bb &> /dev/null; then
        echo "ERROR: Babashka is not installed"
        echo "Please install Babashka: brew install borkdude/brew/babashka"
        echo "Or try using 'just export-duckdb' instead, which uses Node.js"
        exit 1
    fi
    
    # Create exports directory if it doesn't exist
    mkdir -p exports
    
    # Run the export script
    echo "Starting DuckDB export with Babashka..."
    bb scripts/bb-export-to-duckdb.clj {{ARGS}}

# Run a query on the DuckDB database
duckdb-query QUERY DATABASE="exports/messages-$(date +%Y-%m-%d).duckdb":
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Check if duckdb CLI is installed
    if ! command -v duckdb &> /dev/null; then
        echo "ERROR: DuckDB CLI is not installed"
        echo "Please install DuckDB: brew install duckdb"
        exit 1
    fi
    
    # Extract database path from arguments or use default
    DB_PATH="{{DATABASE}}"
    
    # Check if any database exists in exports
    if [ ! -f "$DB_PATH" ]; then
        # Check if there's any .duckdb file in exports
        duckdb_files=$(find ./exports -name "*.duckdb" 2>/dev/null | wc -l)
        if [ "$duckdb_files" -gt 0 ]; then
            # List available databases
            echo "ERROR: DuckDB database not found: $DB_PATH"
            echo "Available databases:"
            find ./exports -name "*.duckdb" -exec ls -lh {} \; | awk '{print "  " $9 " (" $5 ")"}'
            echo ""
            echo "Run query with a specific database:"
            echo "  just duckdb-query \"SELECT COUNT(*) FROM messages\" exports/your-database.duckdb"
            exit 1
        else
            echo "ERROR: No DuckDB databases found in exports directory"
            echo "Run 'just export-duckdb' first to generate a database"
            exit 1
        fi
    fi
    
    echo "Running query: {{QUERY}}"
    echo "Database: $DB_PATH"
    echo "---"
    
    # Run the query
    duckdb "$DB_PATH" -c "{{QUERY}}"

# Extract all message and export them to various formats in one command
extract-all *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "======================="
    echo "Starting full extraction workflow..."
    echo "======================="
    
    # Define paths
    JSON_FILE="./exports/messages-$(date +%Y-%m-%d).json"
    CSV_FILE="./exports/messages-$(date +%Y-%m-%d).csv" 
    DB_FILE="./exports/messages-$(date +%Y-%m-%d).duckdb"
    
    # Check if we need to extract from Signal database
    if [ -n "${SKIP_EXTRACT:-}" ] || [ -z "${STORAGE_PATH:-}" ]; then
        echo "Skipping extraction from Signal database."
        if [ -z "${STORAGE_PATH:-}" ]; then
            echo "To extract messages, set STORAGE_PATH and KEYCHAIN_PASSWORD environment variables."
        fi
        echo ""
        
        # Check if we have an existing JSON file to use
        if [ ! -f "$JSON_FILE" ]; then
            echo "ERROR: No existing JSON file found at $JSON_FILE"
            echo "Either set STORAGE_PATH to extract messages or create a JSON file."
            exit 1
        else
            echo "Found existing JSON file, using it for conversions: $JSON_FILE"
            echo "To extract fresh data, set STORAGE_PATH and run this command again."
        fi
    else
        # Extract messages to JSON
        echo "Extracting messages from Signal database..."
        just extract-direct {{ARGS}}
    fi
    
    # Export to CSV
    echo "Converting to CSV format..."
    just export-csv {{ARGS}}
    
    # Export to DuckDB (with larger datasets, you might want to run this separately)
    echo "Converting to DuckDB format..."
    echo "NOTE: For very large datasets, you may want to run this command separately:"
    echo "just export-duckdb"
    
    # Run with a timeout to avoid hanging
    timeout 600 just export-duckdb {{ARGS}} || echo "DuckDB export timed out - run 'just export-duckdb' separately to complete"
    
    echo "======================="
    echo "Extraction workflow complete"
    echo "======================="
    
    # Show summary of created files
    echo "Files created:"
    echo "- JSON: $(ls -lh "$JSON_FILE" 2>/dev/null | awk '{print $5}' || echo "Not created")" 
    echo "- CSV: $(ls -lh "$CSV_FILE" 2>/dev/null | awk '{print $5}' || echo "Not created")"
    echo "- DuckDB: $(ls -lh "$DB_FILE" 2>/dev/null | awk '{print $5}' || echo "Not created")"
    
    echo ""
    echo "To query the DuckDB database, run:"
    echo "just duckdb-query \"SELECT date, senderName, body FROM messages ORDER BY timestamp DESC LIMIT 10\""

# Homotopy/Chromatic Tower Tools
# ===========================

# Start the Homotopy/Chromatic DuckDB MCP Server
homotopy-mcp:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Starting Homotopy/Chromatic Tower DuckDB MCP Server..."
    if [ ! -f "./lib/homotopy-duckdb-mcp.js" ]; then
        echo "Error: Server file not found at ./lib/homotopy-duckdb-mcp.js"
        exit 1
    fi
    
    # Check if we have exported DuckDB files
    if [ ! -d "./exports" ] || [ $(find ./exports -name "*.duckdb" | wc -l) -eq 0 ]; then
        echo "No DuckDB files found in exports directory."
        echo "Please run 'just export-duckdb' first."
        exit 1
    fi
    
    # Check if Node.js DuckDB package is available
    if ! node -e "try { require('duckdb'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing DuckDB package..."
        npm install --no-save duckdb
    fi
    
    # Make sure express is available
    if ! node -e "try { require('express'); } catch(e) { process.exit(1); }" &> /dev/null; then
        echo "Installing Express package..."
        npm install --no-save express
    fi
    
    # Start the server
    node lib/homotopy-duckdb-mcp.js

# Run the interactive Homotopy/Chromatic analysis toolkit
homotopy-analyze:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching Homotopy/Chromatic Tower Analysis Toolkit..."
    if [ ! -f "./scripts/launch-homotopy-mcp.js" ]; then
        echo "Error: Toolkit file not found at ./scripts/launch-homotopy-mcp.js"
        exit 1
    fi
    
    # Make executable if not already
    chmod +x ./scripts/launch-homotopy-mcp.js
    
    # Start the toolkit
    node ./scripts/launch-homotopy-mcp.js

# Search for homotopy/gay equivalence in message data
search-gay TERM="gay":
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Searching for '{{TERM}}' in mathematical context..."
    if [ ! -f "./scripts/search-homotopy-gay.clj" ]; then
        echo "Error: Search script not found at ./scripts/search-homotopy-gay.clj"
        exit 1
    fi
    
    # Check if Babashka is installed
    if ! command -v bb &> /dev/null; then
        echo "Babashka not found. Please install it with:"
        echo "brew install borkdude/brew/babashka"
        exit 1
    fi
    
    # Run the search
    bb ./scripts/search-homotopy-gay.clj --query="{{TERM}}"

# Run full homotopy equivalence analysis with Babashka
homotopy-full-analysis:
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Running full homotopy equivalence analysis..."
    if [ ! -f "./scripts/homotopy-equivalence-analyzer.clj" ]; then
        echo "Error: Analysis script not found at ./scripts/homotopy-equivalence-analyzer.clj"
        exit 1
    fi
    
    # Check if Babashka is installed
    if ! command -v bb &> /dev/null; then
        echo "Babashka not found. Please install it with:"
        echo "brew install borkdude/brew/babashka"
        exit 1
    fi
    
    # Run the analysis
    bb ./scripts/homotopy-equivalence-analyzer.clj

# Export Signal messages to Infinity-Topos Worlds format
export-infinity-topos INPUT="exports/messages-$(date +%Y-%m-%d).json" WORLD="s":
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Converting Signal messages to Infinity-Topos worlds format..."
    if [ ! -f "./scripts/export-to-infinitytopos.js" ]; then
        echo "Error: Export script not found at ./scripts/export-to-infinitytopos.js"
        exit 1
    fi
    
    # Create exports directory if it doesn't exist
    mkdir -p ./exports/infinity-topos-worlds
    
    # Check if input file exists
    if [ ! -f "{{INPUT}}" ]; then
        echo "Error: Input file not found: {{INPUT}}"
        echo "Run 'just extract-direct' first to extract messages from Signal"
        exit 1
    fi
    
    # Set world ID environment variable
    export WORLD_ID="{{WORLD}}"
    
    # Run the conversion script
    node ./scripts/export-to-infinitytopos.js "{{INPUT}}" "./exports/infinity-topos-worlds"

# Launch the WebGPU-based Infinity-Topos embedding and visualization system
infinity-topos-webgpu WORLDS_DIR="exports/infinity-topos-worlds" DB_PATH="exports/infinity-topos-embeddings.duckdb":
    #!/usr/bin/env bash
    set -euo pipefail
    
    echo "Launching Infinity-Topos WebGPU system..."
    
    # Check if server script exists
    if [ ! -f "./scripts/infinity-topos-embeddings.js" ]; then
        echo "Error: Server script not found at ./scripts/infinity-topos-embeddings.js"
        exit 1
    fi
    
    # Check if client script exists
    if [ ! -f "./scripts/webgpu-embedding-client.js" ]; then
        echo "Error: Client script not found at ./scripts/webgpu-embedding-client.js"
        exit 1
    fi
    
    # Check if launcher script exists
    if [ ! -f "./scripts/launch-infinity-topos-system.js" ]; then
        echo "Error: Launcher script not found at ./scripts/launch-infinity-topos-system.js"
        exit 1
    fi
    
    # Ensure scripts are executable
    chmod +x ./scripts/infinity-topos-embeddings.js ./scripts/webgpu-embedding-client.js ./scripts/launch-infinity-topos-system.js
    
    # Create necessary directories
    mkdir -p "$(dirname "{{DB_PATH}}")"
    
    # Launch the system
    node ./scripts/launch-infinity-topos-system.js "{{WORLDS_DIR}}" "{{DB_PATH}}"