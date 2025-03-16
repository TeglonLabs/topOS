# TeglonLabs/topOS API Reference

This document outlines the API endpoints and protocols for the TeglonLabs/topOS framework.

## Core API Endpoints

### Protocol Resolution

```
POST /api/resolve
```

Resolves a URI using the appropriate protocol handler.

**Request Body:**
```json
{
  "uri": "protocol://path"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "protocol-name",
  "... protocol-specific fields ..."
}
```

### System Status

```
GET /api/status
```

Returns the current status of the topOS system.

**Response:**
```json
{
  "success": true,
  "system": "TeglonLabs/topOS RECO Metasystem",
  "status": "operational",
  "protocols": ["world://", "worm://", "diagram://", "vibe://", "_://"],
  "version": "1.0.0"
}
```

## Protocol Handlers

### world:// Protocol

#### Get World Information

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "world://[id]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "world",
  "id": "[world-id]",
  "metadata": {
    "name": "World Name",
    "description": "World description",
    "created": "2025-03-16T08:11:00Z"
  }
}
```

#### List Entities in a World

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "world://[id]/entities"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "world",
  "operation": "list_entities",
  "worldId": "[world-id]",
  "entities": ["entity1", "entity2", "..."]
}
```

#### Get Entity Information

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "world://[id]/entities/[entity-id]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "world",
  "operation": "get_entity",
  "worldId": "[world-id]",
  "entityId": "[entity-id]",
  "entity": {
    "id": "[entity-id]",
    "world": "[world-id]",
    "attributes": {
      "... entity-specific attributes ..."
    }
  }
}
```

### worm:// Protocol

#### Create Information Flow

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "worm://[source]/[destination]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "worm",
  "source": "[source-world]",
  "destination": "[destination-world]",
  "filter": null,
  "connection": "Connection from [source] to [destination] established"
}
```

#### Create Filtered Information Flow

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "worm://[source]/[destination]/[filter]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "worm",
  "source": "[source-world]",
  "destination": "[destination-world]",
  "filter": "[filter]",
  "connection": "Connection from [source] to [destination] established with filter [filter]"
}
```

### diagram:// Protocol

#### Generate Diagram

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "diagram://[type]/[id]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "diagram",
  "type": "[diagram-type]",
  "id": "[diagram-id]",
  "visualization": "Generated [type] diagram for [id]"
}
```

### vibe:// Protocol

#### Get Entity Trust Information

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "vibe://[entity]/[context]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "vibe",
  "entity": "[entity-id]",
  "context": "[context]",
  "trust": 1,  // -1, 0, or 1
  "confidence": 0.85,
  "description": "Trust data for [entity] in context [context]"
}
```

### _:// Protocol (Universal Accessor)

#### Extract from Resource

```
POST /api/resolve
```

**Request Body:**
```json
{
  "uri": "_://[type]/[resource]"
}
```

**Response:**
```json
{
  "success": true,
  "protocol": "_",
  "type": "[resource-type]",
  "resource": "[resource-path]",
  "extracted": "Extracted content from [type]://[resource]",
  "summary": "Superhuman extraction of the resource content"
}
```

## WebGPU Visualization API

### Initialize Visualization

```javascript
const vibeVisualizer = await VibeVisualizer.create({
  dimensions: 3,
  colorMode: 'trust',
  entities: ['k', 'y', 'b', 'l'],
  worldId: 's'
});
```

### Render Trust Network

```javascript
await vibeVisualizer.render({
  layout: 'force-directed',
  trustThreshold: 0.3,
  showLabels: true
});
```

### Update Trust Values

```javascript
await vibeVisualizer.updateTrust('k', 'b', 1);  // Set trust from k to b to +1
```

### Export Visualization

```javascript
const imageData = await vibeVisualizer.exportImage('png');
```

## RECO System API

### Create Entity

```javascript
await createEntity('world://s/entities/new_entity', {
  name: 'New Entity',
  initialTrust: 0,  // Neutral initial state
  attributes: {
    type: 'organization',
    description: 'Entity description'
  }
});
```

### Create Trust Relationship

```javascript
await createTrust('vibe://k/new_entity', {
  value: 1,  // Positive trust
  confidence: 0.85,
  evidence: ['source1', 'source2']
});
```

### Compute Trust Field

```javascript
const trustField = await computeTrustField('world://s', {
  temperature: 0.1,
  iterations: 1000,
  convergenceThreshold: 0.001
});
```

### Error Handling

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error codes:

- `400` - Invalid request format
- `404` - Resource not found
- `500` - Internal server error

## Client Examples

### Node.js Example

```javascript
const fetch = require('node-fetch');

async function resolveUri(uri) {
  const response = await fetch('http://localhost:3037/api/resolve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uri })
  });
  
  return await response.json();
}

// Example usage
async function main() {
  const result = await resolveUri('vibe://k/global');
  console.log(result);
}

main().catch(console.error);
```

### Browser Example

```javascript
async function resolveUri(uri) {
  const response = await fetch('/api/resolve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uri })
  });
  
  return await response.json();
}

// Example usage
document.getElementById('resolve-button').addEventListener('click', async () => {
  const uri = document.getElementById('uri-input').value;
  const result = await resolveUri(uri);
  document.getElementById('result').textContent = JSON.stringify(result, null, 2);
});
```