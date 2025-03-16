#!/usr/bin/env node

/**
 * TeglonLabs/topOS Client
 * 
 * Command-line client for interacting with the topOS RECO metasystem
 */

const readline = require('readline');
const fetch = require('node-fetch');
const chalk = require('chalk');
const boxen = require('boxen');
const { table } = require('table');

// Configuration
const SERVER_URL = process.env.TOPOS_SERVER || 'http://localhost:3037';
let interactive = process.argv.length <= 2;

// Create readline interface for interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.cyan('topOS> ')
});

// ANSI color scheme for protocols
const colors = {
  world: chalk.blue,
  worm: chalk.yellow,
  diagram: chalk.green,
  vibe: chalk.magenta,
  _: chalk.cyan,
  error: chalk.red,
  success: chalk.green,
  info: chalk.white
};

// Command history
const history = [];

// Display welcome banner
function showBanner() {
  const banner = boxen(
    chalk.bold.white(`
┌─────────────────────────────────────────────────────────┐
│                   TeglonLabs/topOS                      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│ ${colors.world('world://')}   │ ${colors.worm('worm://')}    │ ${colors.diagram('diagram://')} │ ${colors.vibe('vibe://')}     │
│ Entity Space│ Flow Logic  │ Visual Maps │ Trust Network│
├─────────────┴─────────────┴─────────────┴──────────────┤
│        RECO (Relational Entity Compositional OS)        │
└─────────────────────────────────────────────────────────┘
`), 
    { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
  );
  
  console.log(banner);
  console.log(chalk.cyan('TeglonLabs/topOS Client - Interactive Mode'));
  console.log(chalk.cyan('Type "help" for available commands or a URI to resolve'));
  console.log(chalk.cyan('Example: world://s/entities'));
  console.log('');
}

// Resolve a URI
async function resolveUri(uri) {
  try {
    // Add protocol:// if not present
    if (!uri.includes('://')) {
      uri = `${uri}://`;
    }
    
    const response = await fetch(`${SERVER_URL}/api/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uri })
    });
    
    const result = await response.json();
    return result;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Get system status
async function getStatus() {
  try {
    const response = await fetch(`${SERVER_URL}/api/status`);
    const result = await response.json();
    return result;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Format and display results
function displayResult(result) {
  if (!result.success) {
    console.log(colors.error(`Error: ${result.error}`));
    return;
  }
  
  const protocol = result.protocol || 'unknown';
  const colorFn = colors[protocol] || colors.info;
  
  console.log(colorFn(`Protocol: ${protocol}://`));
  
  if (protocol === 'world') {
    if (result.operation === 'list_entities') {
      console.log(colorFn(`World: ${result.worldId}`));
      console.log(colorFn('Entities:'));
      if (result.entities && result.entities.length > 0) {
        result.entities.forEach(entity => {
          console.log(colorFn(`  - ${entity}`));
        });
      } else {
        console.log(colorFn('  No entities found'));
      }
    } else if (result.operation === 'get_entity') {
      console.log(colorFn(`World: ${result.worldId}`));
      console.log(colorFn(`Entity: ${result.entityId}`));
      console.log(colorFn('Attributes:'));
      if (result.entity && result.entity.attributes) {
        Object.entries(result.entity.attributes).forEach(([key, value]) => {
          console.log(colorFn(`  ${key}: ${value}`));
        });
      } else {
        console.log(colorFn('  No attributes found'));
      }
    } else {
      // World info
      console.log(colorFn(`World: ${result.id}`));
      if (result.metadata) {
        console.log(colorFn('Metadata:'));
        Object.entries(result.metadata).forEach(([key, value]) => {
          console.log(colorFn(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`));
        });
      }
    }
  } else if (protocol === 'worm') {
    console.log(colorFn(`Source: ${result.source}`));
    console.log(colorFn(`Destination: ${result.destination}`));
    if (result.filter) {
      console.log(colorFn(`Filter: ${result.filter}`));
    }
    console.log(colorFn(`Connection: ${result.connection}`));
  } else if (protocol === 'diagram') {
    console.log(colorFn(`Type: ${result.type}`));
    console.log(colorFn(`ID: ${result.id}`));
    console.log(colorFn(`Visualization: ${result.visualization}`));
  } else if (protocol === 'vibe') {
    console.log(colorFn(`Entity: ${result.entity}`));
    console.log(colorFn(`Context: ${result.context}`));
    console.log(colorFn(`Trust: ${result.trust} (${result.trust === 1 ? 'Positive' : result.trust === 0 ? 'Neutral' : 'Negative'})`));
    console.log(colorFn(`Confidence: ${result.confidence}`));
    console.log(colorFn(`Description: ${result.description}`));
  } else if (protocol === '_') {
    console.log(colorFn(`Type: ${result.type}`));
    console.log(colorFn(`Resource: ${result.resource}`));
    console.log(colorFn(`Extracted: ${result.extracted}`));
    console.log(colorFn(`Summary: ${result.summary}`));
  } else {
    // Generic display for unknown protocols
    Object.entries(result).forEach(([key, value]) => {
      if (key !== 'success' && key !== 'protocol') {
        console.log(colorFn(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`));
      }
    });
  }
}

// Display help
function displayHelp() {
  console.log(chalk.cyan('Available Commands:'));
  console.log(chalk.cyan('-------------------'));
  console.log(chalk.cyan('help                - Show this help message'));
  console.log(chalk.cyan('status              - Show system status'));
  console.log(chalk.cyan('history             - Show command history'));
  console.log(chalk.cyan('clear               - Clear the screen'));
  console.log(chalk.cyan('exit, quit          - Exit the client'));
  console.log('');
  console.log(chalk.cyan('URI Protocols:'));
  console.log(chalk.cyan('--------------'));
  console.log(colors.world('world://[id]              - Access world information'));
  console.log(colors.world('world://[id]/entities     - List entities in a world'));
  console.log(colors.world('world://[id]/entities/[e] - Get entity information'));
  console.log(colors.worm('worm://[src]/[dst]        - Create information flow'));
  console.log(colors.diagram('diagram://[type]/[id]     - Generate diagram'));
  console.log(colors.vibe('vibe://[entity]/[context] - Get trust information'));
  console.log(colors.info('_://[type]/[resource]     - Universal resource access'));
  console.log('');
  console.log(chalk.cyan('Examples:'));
  console.log(chalk.cyan('----------'));
  console.log(colors.world('world://s                  - Get information about world "s"'));
  console.log(colors.vibe('vibe://k/global            - Get trust data for entity "k" in global context'));
  console.log(colors.info('_://web/example.com        - Extract from website'));
}

// Display status
async function displayStatus() {
  const status = await getStatus();
  
  if (!status.success) {
    console.log(colors.error(`Error: ${status.error}`));
    return;
  }
  
  console.log(colors.info(`System: ${status.system}`));
  console.log(colors.info(`Status: ${status.status}`));
  console.log(colors.info(`Version: ${status.version}`));
  console.log(colors.info('Supported Protocols:'));
  
  if (status.protocols) {
    status.protocols.forEach(protocol => {
      const colorFn = colors[protocol.replace('://', '')] || colors.info;
      console.log(colorFn(`  - ${protocol}`));
    });
  }
}

// Display history
function displayHistory() {
  if (history.length === 0) {
    console.log(colors.info('No command history'));
    return;
  }
  
  const data = history.map((cmd, i) => [i + 1, cmd]);
  data.unshift(['#', 'Command']);
  
  console.log(table(data));
}

// Process command
async function processCommand(cmd) {
  cmd = cmd.trim();
  
  if (!cmd) {
    return;
  }
  
  // Add to history
  history.push(cmd);
  
  // Process command
  if (cmd === 'help') {
    displayHelp();
  } else if (cmd === 'status') {
    await displayStatus();
  } else if (cmd === 'history') {
    displayHistory();
  } else if (cmd === 'clear') {
    console.clear();
    if (interactive) {
      showBanner();
    }
  } else if (cmd === 'exit' || cmd === 'quit') {
    console.log(colors.info('Goodbye!'));
    if (interactive) {
      rl.close();
    }
    process.exit(0);
  } else {
    // Assume it's a URI
    const result = await resolveUri(cmd);
    displayResult(result);
  }
}

// Main function
async function main() {
  if (interactive) {
    showBanner();
    
    rl.prompt();
    
    rl.on('line', async (line) => {
      await processCommand(line);
      rl.prompt();
    });
    
    rl.on('close', () => {
      console.log(colors.info('Goodbye!'));
      process.exit(0);
    });
  } else {
    // Non-interactive mode - process command from arguments
    const cmd = process.argv.slice(2).join(' ');
    await processCommand(cmd);
    process.exit(0);
  }
}

// Install required packages if not available
async function checkDependencies() {
  try {
    require('node-fetch');
    require('chalk');
    require('boxen');
    require('table');
  } catch (err) {
    console.log('Installing required dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install --no-save node-fetch chalk boxen table');
    console.log('Dependencies installed. Restarting client...');
    
    // Re-require modules
    global.fetch = require('node-fetch');
    global.chalk = require('chalk');
    global.boxen = require('boxen');
    global.table = require('table').table;
  }
}

// Start the client
checkDependencies()
  .then(main)
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });