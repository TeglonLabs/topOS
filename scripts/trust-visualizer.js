#!/usr/bin/env node

/**
 * TeglonLabs/topOS Trust Visualizer
 * 
 * WebGPU-accelerated trust network visualization component
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Configuration
const PORT = process.env.PORT || 3038;
const TRUST_NETWORK_PATH = process.env.TRUST_NETWORK_PATH || './exports/vibes-network/trust-network.json';
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'trust-visualizer');

// Initialize Express
const app = express();

// Setup static directory
async function setupDirectories() {
  try {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });
    console.log(`Created public directory: ${PUBLIC_DIR}`);
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

// Generate client-side WebGPU code for trust visualization
async function generateClientCode() {
  // Main HTML file
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeglonLabs/topOS Trust Visualizer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="header">
    <h1>TeglonLabs/topOS Trust Visualizer</h1>
    <div class="controls">
      <div class="control-group">
        <label for="layout-type">Layout:</label>
        <select id="layout-type">
          <option value="force-directed">Force-Directed</option>
          <option value="circular">Circular</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div class="control-group">
        <label for="dimension-count">Dimensions:</label>
        <input type="range" id="dimension-count" min="2" max="3" value="2" step="1">
        <span id="dimension-display">2D</span>
      </div>
      <div class="control-group">
        <label for="trust-threshold">Trust Threshold:</label>
        <input type="range" id="trust-threshold" min="-1" max="1" value="0" step="1">
        <span id="threshold-display">0</span>
      </div>
      <button id="regenerate-viz">Regenerate</button>
    </div>
  </div>
  
  <div class="main-container">
    <div class="sidebar">
      <div class="webgpu-status">
        <h3>WebGPU Status</h3>
        <div id="webgpu-badge">Checking...</div>
      </div>
      <div class="network-info">
        <h3>Network Information</h3>
        <div id="network-info">Loading...</div>
      </div>
      <div class="entity-list">
        <h3>Entities</h3>
        <div id="entity-list"></div>
      </div>
      <div class="balanced-ternary">
        <h3>Balanced Ternary Logic</h3>
        <div class="ternary-legend">
          <div class="ternary-item negative">
            <span class="ternary-value">-1</span>
            <span class="ternary-label">Negative Trust</span>
          </div>
          <div class="ternary-item neutral">
            <span class="ternary-value">0</span>
            <span class="ternary-label">Neutral Trust</span>
          </div>
          <div class="ternary-item positive">
            <span class="ternary-value">+1</span>
            <span class="ternary-label">Positive Trust</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <div id="webgpu-canvas-container">
        <canvas id="webgpu-canvas"></canvas>
        <div id="loading-indicator">Loading WebGPU visualization...</div>
      </div>
      <div id="entity-details">
        <h3>Entity Details</h3>
        <div id="detail-content">Select an entity to view details</div>
      </div>
    </div>
  </div>
  
  <script src="trust-network.js" type="module"></script>
  <script src="webgpu-visualizer.js" type="module"></script>
  <script src="app.js" defer></script>
</body>
</html>`;

  // CSS styles
  const cssContent = `/* TeglonLabs/topOS Trust Visualizer Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  margin-bottom: 0.5rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

select, input, button {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.main-container {
  display: flex;
  height: calc(100vh - 120px);
  padding: 1rem;
  gap: 1rem;
}

.sidebar {
  width: 300px;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.sidebar h3 {
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

#webgpu-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin-top: 0.5rem;
}

#webgpu-badge.available {
  background-color: #2ecc71;
  color: white;
}

#webgpu-badge.unavailable {
  background-color: #e74c3c;
  color: white;
}

.entity-list {
  margin-top: 1rem;
}

.entity-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.entity-item:hover {
  background-color: #f5f5f5;
}

.entity-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.balanced-ternary {
  margin-top: 1rem;
}

.ternary-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.ternary-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
}

.ternary-value {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  margin-right: 0.5rem;
  font-weight: bold;
}

.negative .ternary-value {
  background-color: #e74c3c;
  color: white;
}

.neutral .ternary-value {
  background-color: #95a5a6;
  color: white;
}

.positive .ternary-value {
  background-color: #2ecc71;
  color: white;
}

.visualization-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#webgpu-canvas-container {
  position: relative;
  height: 70%;
  background-color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

#webgpu-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0,0,0,0.7);
  color: white;
  padding: 1rem;
  border-radius: 4px;
  display: none;
}

#loading-indicator.visible {
  display: block;
}

#entity-details {
  height: 30%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1rem;
}

.detail-section h4 {
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.25rem;
}

.trust-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.trust-relationship {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.trust-target {
  font-weight: bold;
}

.trust-value {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: 0.25rem;
  font-weight: bold;
}

.trust-negative {
  background-color: #e74c3c;
  color: white;
}

.trust-neutral {
  background-color: #95a5a6;
  color: white;
}

.trust-positive {
  background-color: #2ecc71;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
    height: auto;
  }
  
  .sidebar {
    width: 100%;
  }
  
  #webgpu-canvas-container {
    height: 50vh;
  }
}`;

  // Trust network module
  const trustNetworkJs = `// TeglonLabs/topOS Trust Network Module

export class TrustNetwork {
  constructor(data) {
    this.worldId = data.worldId;
    this.entities = data.entities;
    this.trustMatrix = data.trustMatrix;
    this.created = data.created;
    this.description = data.description;
  }
  
  // Get all entities in the network
  getEntities() {
    return this.entities;
  }
  
  // Get trust relationship between two entities
  getTrust(source, target) {
    if (!this.trustMatrix[source]) {
      return null;
    }
    
    return this.trustMatrix[source][target] !== undefined 
      ? this.trustMatrix[source][target] 
      : null;
  }
  
  // Get all trust relationships for an entity
  getEntityTrust(entity) {
    if (!this.trustMatrix[entity]) {
      return {};
    }
    
    return this.trustMatrix[entity];
  }
  
  // Get all entities that trust a given entity (incoming trust)
  getIncomingTrust(entity) {
    const incoming = {};
    
    for (const source of this.entities) {
      if (source !== entity && this.trustMatrix[source] && this.trustMatrix[source][entity] !== undefined) {
        incoming[source] = this.trustMatrix[source][entity];
      }
    }
    
    return incoming;
  }
  
  // Get network statistics
  getNetworkStats() {
    // Count trust values
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let total = 0;
    
    for (const source of this.entities) {
      if (!this.trustMatrix[source]) continue;
      
      for (const target of this.entities) {
        if (source === target) continue;
        
        const trust = this.trustMatrix[source][target];
        if (trust === undefined) continue;
        
        total++;
        
        if (trust === 1) positive++;
        else if (trust === 0) neutral++;
        else if (trust === -1) negative++;
      }
    }
    
    return {
      entities: this.entities.length,
      relationships: total,
      positive,
      neutral,
      negative,
      density: total / (this.entities.length * (this.entities.length - 1))
    };
  }
  
  // Get graph data for visualization
  getGraphData() {
    const nodes = this.entities.map(entity => ({
      id: entity,
      label: entity
    }));
    
    const edges = [];
    
    for (const source of this.entities) {
      if (!this.trustMatrix[source]) continue;
      
      for (const target of this.entities) {
        if (source === target) continue;
        
        const trust = this.trustMatrix[source][target];
        if (trust === undefined) continue;
        
        edges.push({
          source,
          target,
          value: trust,
          color: trust === 1 ? '#2ecc71' : trust === 0 ? '#95a5a6' : '#e74c3c'
        });
      }
    }
    
    return { nodes, edges };
  }
  
  // Set trust value between two entities
  setTrust(source, target, value) {
    if (!this.entities.includes(source) || !this.entities.includes(target) || source === target) {
      return false;
    }
    
    // Ensure value is -1, 0, or 1
    value = Math.max(-1, Math.min(1, Math.round(value)));
    
    if (!this.trustMatrix[source]) {
      this.trustMatrix[source] = {};
    }
    
    this.trustMatrix[source][target] = value;
    return true;
  }
  
  // Add a new entity to the network
  addEntity(entity) {
    if (this.entities.includes(entity)) {
      return false;
    }
    
    this.entities.push(entity);
    this.trustMatrix[entity] = {};
    
    return true;
  }
  
  // Filter the trust network by threshold
  filterByThreshold(threshold) {
    const filtered = {
      worldId: this.worldId,
      entities: this.entities,
      trustMatrix: {},
      created: this.created,
      description: \`Filtered trust network (threshold: \${threshold})\`
    };
    
    for (const source of this.entities) {
      if (!this.trustMatrix[source]) continue;
      
      filtered.trustMatrix[source] = {};
      
      for (const target of this.entities) {
        if (source === target) continue;
        
        const trust = this.trustMatrix[source][target];
        if (trust === undefined) continue;
        
        if (threshold === 0) {
          // Zero threshold: show all non-neutral
          if (trust !== 0) {
            filtered.trustMatrix[source][target] = trust;
          }
        } else if (threshold === 1) {
          // Positive threshold: show only positive
          if (trust === 1) {
            filtered.trustMatrix[source][target] = trust;
          }
        } else if (threshold === -1) {
          // Negative threshold: show only negative
          if (trust === -1) {
            filtered.trustMatrix[source][target] = trust;
          }
        }
      }
    }
    
    return new TrustNetwork(filtered);
  }
}

// Load trust network data
export async function loadTrustNetwork() {
  try {
    const response = await fetch('/api/trust-network');
    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    
    const data = await response.json();
    return new TrustNetwork(data);
  } catch (err) {
    console.error('Error loading trust network:', err);
    throw err;
  }
}`;

  // WebGPU visualizer module
  const webgpuVisualizerJs = `// TeglonLabs/topOS WebGPU Trust Visualizer

export class WebGPUVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.device = null;
    this.context = null;
    this.pipeline = null;
    this.bindGroup = null;
    this.vertexBuffer = null;
    this.colorBuffer = null;
    this.indexBuffer = null;
    this.uniformBuffer = null;
    this.dimensions = 2;
    this.layout = 'force-directed';
    this.initialized = false;
    this.nodes = [];
    this.edges = [];
    this.positions = [];
    this.colors = [];
    this.indices = [];
    this.nodePositions = new Map();
    this.entityPositions = new Map();
    this.selectedEntity = null;
    this.rotation = 0;
    this.scale = 1;
    this.animationFrameId = null;
    
    // Force-directed layout parameters
    this.forceParams = {
      repulsion: 0.1,
      attraction: 0.01,
      damping: 0.9,
      minDistance: 0.1,
      iterations: 100
    };
    
    // Initialize
    this.initialize();
  }
  
  async initialize() {
    if (!navigator.gpu) {
      console.error('WebGPU not supported');
      return;
    }
    
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('No adapter found');
      }
      
      this.device = await adapter.requestDevice();
      this.context = this.canvas.getContext('webgpu');
      
      const devicePixelRatio = window.devicePixelRatio || 1;
      this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
      this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
      
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
      
      this.context.configure({
        device: this.device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });
      
      // Create shader modules for 2D and 3D rendering
      this.createShaderModules();
      
      // Create uniform buffer
      this.uniformBuffer = this.device.createBuffer({
        size: 16 * Float32Array.BYTES_PER_ELEMENT,  // 4x4 matrix
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      
      // Create bind group layout
      const bindGroupLayout = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: 'uniform' }
          }
        ]
      });
      
      // Create bind group
      this.bindGroup = this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: {
              buffer: this.uniformBuffer
            }
          }
        ]
      });
      
      // Create pipeline layout
      const pipelineLayout = this.device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
      });
      
      // Create render pipeline
      this.pipeline = this.device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
          module: this.shaderModule,
          entryPoint: 'vertexMain',
          buffers: [
            {
              // Position
              arrayStride: (this.dimensions === 2 ? 2 : 3) * Float32Array.BYTES_PER_ELEMENT,
              attributes: [
                {
                  shaderLocation: 0,
                  offset: 0,
                  format: this.dimensions === 2 ? 'float32x2' : 'float32x3'
                }
              ]
            },
            {
              // Color
              arrayStride: 4 * Float32Array.BYTES_PER_ELEMENT,
              attributes: [
                {
                  shaderLocation: 1,
                  offset: 0,
                  format: 'float32x4'
                }
              ]
            }
          ]
        },
        fragment: {
          module: this.shaderModule,
          entryPoint: 'fragmentMain',
          targets: [
            {
              format: presentationFormat
            }
          ]
        },
        primitive: {
          topology: 'triangle-list'
        },
        depthStencil: this.dimensions === 3 ? {
          format: 'depth24plus',
          depthWriteEnabled: true,
          depthCompare: 'less'
        } : undefined
      });
      
      // Set initialized flag
      this.initialized = true;
      
      // Set resize handler
      window.addEventListener('resize', () => this.resize());
      
      // Add interaction handlers
      this.setupInteraction();
      
      // Log success
      console.log(\`WebGPU initialized successfully (\${this.dimensions}D)\`);
      
      // Update WebGPU badge
      const webgpuBadge = document.getElementById('webgpu-badge');
      if (webgpuBadge) {
        webgpuBadge.textContent = 'Available';
        webgpuBadge.classList.add('available');
        webgpuBadge.title = \`Adapter: \${adapter.name || 'Unknown'}\`;
      }
    } catch (err) {
      console.error('WebGPU initialization error:', err);
      
      // Update WebGPU badge
      const webgpuBadge = document.getElementById('webgpu-badge');
      if (webgpuBadge) {
        webgpuBadge.textContent = 'Unavailable';
        webgpuBadge.classList.add('unavailable');
        webgpuBadge.title = err.message;
      }
    }
  }
  
  createShaderModules() {
    const shader2D = \`
      struct Uniforms {
        viewMatrix: mat4x4<f32>,
        projMatrix: mat4x4<f32>,
      };
      
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) color: vec4<f32>,
      };
      
      @vertex
      fn vertexMain(@location(0) position: vec2<f32>, @location(1) color: vec4<f32>) -> VertexOutput {
        var output: VertexOutput;
        var pos = vec4<f32>(position.x, position.y, 0.0, 1.0);
        output.position = uniforms.projMatrix * uniforms.viewMatrix * pos;
        output.color = color;
        return output;
      }
      
      @fragment
      fn fragmentMain(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
        return color;
      }
    \`;
    
    const shader3D = \`
      struct Uniforms {
        viewMatrix: mat4x4<f32>,
        projMatrix: mat4x4<f32>,
      };
      
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) color: vec4<f32>,
      };
      
      @vertex
      fn vertexMain(@location(0) position: vec3<f32>, @location(1) color: vec4<f32>) -> VertexOutput {
        var output: VertexOutput;
        var pos = vec4<f32>(position.x, position.y, position.z, 1.0);
        output.position = uniforms.projMatrix * uniforms.viewMatrix * pos;
        output.color = color;
        return output;
      }
      
      @fragment
      fn fragmentMain(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
        return color;
      }
    \`;
    
    this.shaderModule = this.device.createShaderModule({
      code: this.dimensions === 2 ? shader2D : shader3D
    });
  }
  
  resize() {
    if (!this.initialized) return;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
    
    this.draw();
  }
  
  setupInteraction() {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let startRotationX = 0;
    let startRotationY = 0;
    
    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      startRotationX = this.rotationX || 0;
      startRotationY = this.rotationY || 0;
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      if (this.dimensions === 3) {
        this.rotationX = startRotationX + deltaY * 0.01;
        this.rotationY = startRotationY + deltaX * 0.01;
        this.updateViewMatrix();
        this.draw();
      } else {
        // 2D panning
        // Implement if needed
      }
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Zoom in/out
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.scale *= delta;
      this.scale = Math.max(0.1, Math.min(5, this.scale));
      
      this.updateViewMatrix();
      this.draw();
    });
    
    // Node selection
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to normalized device coordinates (-1 to 1)
      const ndcX = (x / this.canvas.clientWidth) * 2 - 1;
      const ndcY = -((y / this.canvas.clientHeight) * 2 - 1);
      
      // Find closest node
      let closestNode = null;
      let closestDistance = Infinity;
      
      for (const [entity, position] of this.entityPositions) {
        let distance;
        
        if (this.dimensions === 2) {
          distance = Math.sqrt(
            Math.pow(ndcX - position.x, 2) + 
            Math.pow(ndcY - position.y, 2)
          );
        } else {
          // 3D distance calculation would need to account for projection
          // Simplified version for now
          distance = Math.sqrt(
            Math.pow(ndcX - position.x, 2) + 
            Math.pow(ndcY - position.y, 2) + 
            Math.pow(0 - position.z || 0, 2)
          );
        }
        
        if (distance < closestDistance && distance < 0.1) {
          closestDistance = distance;
          closestNode = entity;
        }
      }
      
      if (closestNode) {
        this.selectEntity(closestNode);
      }
    });
  }
  
  selectEntity(entity) {
    this.selectedEntity = entity;
    
    // Dispatch event for the app to handle
    const event = new CustomEvent('entity-selected', {
      detail: { entity }
    });
    this.canvas.dispatchEvent(event);
    
    // Update visualization
    this.updateColors();
    this.draw();
  }
  
  updateViewMatrix() {
    if (!this.initialized) return;
    
    // Create view matrix
    const viewMatrix = new Float32Array(16);
    const projMatrix = new Float32Array(16);
    
    if (this.dimensions === 2) {
      // 2D orthographic projection
      // Simple scale and identity view
      this.mat4Identity(viewMatrix);
      this.mat4Scale(viewMatrix, this.scale, this.scale, 1);
      
      // Orthographic projection
      this.mat4Ortho(projMatrix, -1, 1, -1, 1, -1, 1);
    } else {
      // 3D perspective projection
      this.mat4Identity(viewMatrix);
      this.mat4Translate(viewMatrix, 0, 0, -3); // Move camera back
      this.mat4RotateX(viewMatrix, this.rotationX || 0);
      this.mat4RotateY(viewMatrix, this.rotationY || 0);
      this.mat4Scale(viewMatrix, this.scale, this.scale, this.scale);
      
      // Perspective projection
      const aspect = this.canvas.width / this.canvas.height;
      this.mat4Perspective(projMatrix, Math.PI / 4, aspect, 0.1, 100);
    }
    
    // Update uniform buffer
    this.device.queue.writeBuffer(
      this.uniformBuffer,
      0,
      viewMatrix,
      0,
      16
    );
    
    this.device.queue.writeBuffer(
      this.uniformBuffer,
      16 * Float32Array.BYTES_PER_ELEMENT,
      projMatrix,
      0,
      16
    );
  }
  
  // Matrix utility functions
  mat4Identity(m) {
    m.fill(0);
    m[0] = 1;
    m[5] = 1;
    m[10] = 1;
    m[15] = 1;
  }
  
  mat4Translate(m, x, y, z) {
    m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  }
  
  mat4Scale(m, x, y, z) {
    m[0] *= x;
    m[1] *= x;
    m[2] *= x;
    m[3] *= x;
    m[4] *= y;
    m[5] *= y;
    m[6] *= y;
    m[7] *= y;
    m[8] *= z;
    m[9] *= z;
    m[10] *= z;
    m[11] *= z;
  }
  
  mat4RotateX(m, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    
    const a10 = m[4];
    const a11 = m[5];
    const a12 = m[6];
    const a13 = m[7];
    const a20 = m[8];
    const a21 = m[9];
    const a22 = m[10];
    const a23 = m[11];
    
    // Perform axis-specific matrix multiplication
    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a20 * c - a10 * s;
    m[9] = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s;
    m[11] = a23 * c - a13 * s;
  }
  
  mat4RotateY(m, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    
    const a00 = m[0];
    const a01 = m[1];
    const a02 = m[2];
    const a03 = m[3];
    const a20 = m[8];
    const a21 = m[9];
    const a22 = m[10];
    const a23 = m[11];
    
    // Perform axis-specific matrix multiplication
    m[0] = a00 * c - a20 * s;
    m[1] = a01 * c - a21 * s;
    m[2] = a02 * c - a22 * s;
    m[3] = a03 * c - a23 * s;
    m[8] = a00 * s + a20 * c;
    m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c;
    m[11] = a03 * s + a23 * c;
  }
  
  mat4Ortho(m, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    
    m[0] = -2 * lr;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = -2 * bt;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 2 * nf;
    m[11] = 0;
    m[12] = (left + right) * lr;
    m[13] = (top + bottom) * bt;
    m[14] = (far + near) * nf;
    m[15] = 1;
  }
  
  mat4Perspective(m, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * far * near * nf;
    m[15] = 0;
  }
  
  // Set graph data for visualization
  setData(graphData) {
    if (!this.initialized) return;
    
    this.nodes = graphData.nodes;
    this.edges = graphData.edges;
    
    // Generate positions
    this.generateLayout();
    
    // Update colors
    this.updateColors();
    
    // Create buffers
    this.createBuffers();
    
    // Update view matrix
    this.updateViewMatrix();
    
    // Draw
    this.draw();
  }
  
  generateLayout() {
    if (this.layout === 'force-directed') {
      this.generateForceDirectedLayout();
    } else if (this.layout === 'circular') {
      this.generateCircularLayout();
    } else if (this.layout === 'grid') {
      this.generateGridLayout();
    }
  }
  
  generateForceDirectedLayout() {
    const nodeCount = this.nodes.length;
    const positions = {};
    
    // Initialize random positions
    for (const node of this.nodes) {
      positions[node.id] = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: this.dimensions === 3 ? Math.random() * 2 - 1 : 0,
        vx: 0,
        vy: 0,
        vz: 0
      };
    }
    
    // Run force-directed layout
    for (let i = 0; i < this.forceParams.iterations; i++) {
      // Reset forces
      for (const node of this.nodes) {
        positions[node.id].fx = 0;
        positions[node.id].fy = 0;
        positions[node.id].fz = 0;
      }
      
      // Apply repulsive forces
      for (let i = 0; i < nodeCount; i++) {
        const nodeA = this.nodes[i];
        const posA = positions[nodeA.id];
        
        for (let j = i + 1; j < nodeCount; j++) {
          const nodeB = this.nodes[j];
          const posB = positions[nodeB.id];
          
          const dx = posB.x - posA.x;
          const dy = posB.y - posA.y;
          const dz = this.dimensions === 3 ? posB.z - posA.z : 0;
          
          let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          distance = Math.max(distance, this.forceParams.minDistance);
          
          const force = this.forceParams.repulsion / (distance * distance);
          
          const fx = dx / distance * force;
          const fy = dy / distance * force;
          const fz = this.dimensions === 3 ? dz / distance * force : 0;
          
          posA.fx -= fx;
          posA.fy -= fy;
          posA.fz -= fz;
          
          posB.fx += fx;
          posB.fy += fy;
          posB.fz += fz;
        }
      }
      
      // Apply attractive forces (edges)
      for (const edge of this.edges) {
        const posA = positions[edge.source];
        const posB = positions[edge.target];
        
        if (!posA || !posB) continue;
        
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dz = this.dimensions === 3 ? posB.z - posA.z : 0;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const force = this.forceParams.attraction * distance;
        
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        const fz = this.dimensions === 3 ? dz / distance * force : 0;
        
        posA.fx += fx;
        posA.fy += fy;
        posA.fz += fz;
        
        posB.fx -= fx;
        posB.fy -= fy;
        posB.fz -= fz;
      }
      
      // Update positions
      for (const node of this.nodes) {
        const pos = positions[node.id];
        
        pos.vx = (pos.vx + pos.fx) * this.forceParams.damping;
        pos.vy = (pos.vy + pos.fy) * this.forceParams.damping;
        pos.vz = (pos.vz + pos.fz) * this.forceParams.damping;
        
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.z += pos.vz;
      }
    }
    
    // Normalize positions
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (const node of this.nodes) {
      const pos = positions[node.id];
      
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y);
      
      if (this.dimensions === 3) {
        minZ = Math.min(minZ, pos.z);
        maxZ = Math.max(maxZ, pos.z);
      }
    }
    
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = this.dimensions === 3 ? maxZ - minZ || 1 : 1;
    
    for (const node of this.nodes) {
      const pos = positions[node.id];
      
      pos.x = ((pos.x - minX) / rangeX) * 1.8 - 0.9;
      pos.y = ((pos.y - minY) / rangeY) * 1.8 - 0.9;
      
      if (this.dimensions === 3) {
        pos.z = ((pos.z - minZ) / rangeZ) * 1.8 - 0.9;
      }
    }
    
    // Save positions
    this.nodePositions = positions;
    
    // Save entity positions
    this.entityPositions = new Map();
    for (const node of this.nodes) {
      this.entityPositions.set(node.id, {
        x: positions[node.id].x,
        y: positions[node.id].y,
        z: positions[node.id].z
      });
    }
  }
  
  generateCircularLayout() {
    const nodeCount = this.nodes.length;
    const positions = {};
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const node = this.nodes[i];
      
      positions[node.id] = {
        x: Math.cos(angle) * 0.8,
        y: Math.sin(angle) * 0.8,
        z: this.dimensions === 3 ? 0 : 0
      };
    }
    
    // Save positions
    this.nodePositions = positions;
    
    // Save entity positions
    this.entityPositions = new Map();
    for (const node of this.nodes) {
      this.entityPositions.set(node.id, {
        x: positions[node.id].x,
        y: positions[node.id].y,
        z: positions[node.id].z
      });
    }
  }
  
  generateGridLayout() {
    const nodeCount = this.nodes.length;
    const positions = {};
    
    // Calculate grid dimensions
    const cols = Math.ceil(Math.sqrt(nodeCount));
    const rows = Math.ceil(nodeCount / cols);
    
    for (let i = 0; i < nodeCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const node = this.nodes[i];
      
      const x = (col / (cols - 1 || 1)) * 1.6 - 0.8;
      const y = (row / (rows - 1 || 1)) * 1.6 - 0.8;
      
      positions[node.id] = {
        x,
        y,
        z: this.dimensions === 3 ? 0 : 0
      };
    }
    
    // Save positions
    this.nodePositions = positions;
    
    // Save entity positions
    this.entityPositions = new Map();
    for (const node of this.nodes) {
      this.entityPositions.set(node.id, {
        x: positions[node.id].x,
        y: positions[node.id].y,
        z: positions[node.id].z
      });
    }
  }
  
  updateColors() {
    const nodeColors = {};
    
    // Set node colors
    for (const node of this.nodes) {
      // Base color - light blue
      const baseColor = [0.4, 0.7, 0.9, 1.0];
      
      // Selected node - highlight in yellow
      if (this.selectedEntity === node.id) {
        nodeColors[node.id] = [1.0, 0.8, 0.2, 1.0];
      } else {
        nodeColors[node.id] = baseColor;
      }
    }
    
    // Create color data for visualization
    this.colors = [];
    
    // Node colors
    for (const node of this.nodes) {
      this.colors.push(...nodeColors[node.id]);
    }
    
    // Edge colors
    for (const edge of this.edges) {
      let color;
      
      if (edge.value === 1) {
        // Positive - green
        color = [0.2, 0.8, 0.4, 0.7];
      } else if (edge.value === 0) {
        // Neutral - gray
        color = [0.6, 0.6, 0.6, 0.5];
      } else {
        // Negative - red
        color = [0.8, 0.3, 0.3, 0.7];
      }
      
      this.colors.push(...color);
      this.colors.push(...color);
    }
  }
  
  createBuffers() {
    if (!this.initialized) return;
    
    // Create positions
    this.positions = [];
    
    // Node positions
    for (const node of this.nodes) {
      const pos = this.nodePositions[node.id];
      if (this.dimensions === 2) {
        this.positions.push(pos.x, pos.y);
      } else {
        this.positions.push(pos.x, pos.y, pos.z);
      }
    }
    
    // Edge positions
    for (const edge of this.edges) {
      const posA = this.nodePositions[edge.source];
      const posB = this.nodePositions[edge.target];
      
      if (!posA || !posB) continue;
      
      if (this.dimensions === 2) {
        this.positions.push(posA.x, posA.y);
        this.positions.push(posB.x, posB.y);
      } else {
        this.positions.push(posA.x, posA.y, posA.z);
        this.positions.push(posB.x, posB.y, posB.z);
      }
    }
    
    // Create buffers
    if (this.vertexBuffer) {
      this.vertexBuffer.destroy();
    }
    
    this.vertexBuffer = this.device.createBuffer({
      size: this.positions.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.positions);
    this.vertexBuffer.unmap();
    
    if (this.colorBuffer) {
      this.colorBuffer.destroy();
    }
    
    this.colorBuffer = this.device.createBuffer({
      size: this.colors.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    
    new Float32Array(this.colorBuffer.getMappedRange()).set(this.colors);
    this.colorBuffer.unmap();
  }
  
  draw() {
    if (!this.initialized || !this.vertexBuffer || !this.colorBuffer) return;
    
    // Get current texture
    const textureView = this.context.getCurrentTexture().createView();
    
    // Create command encoder
    const commandEncoder = this.device.createCommandEncoder();
    
    // Create render pass descriptor
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.15, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        }
      ]
    };
    
    // Start render pass
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.setVertexBuffer(1, this.colorBuffer);
    
    // Draw nodes
    const nodeCount = this.nodes.length;
    passEncoder.draw(1, nodeCount, 0, 0);
    
    // Draw edges
    const edgeCount = this.edges.length;
    passEncoder.draw(2, edgeCount, 0, nodeCount);
    
    // End render pass
    passEncoder.end();
    
    // Submit command buffer
    this.device.queue.submit([commandEncoder.finish()]);
  }
  
  animate() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    const animate = () => {
      this.rotation += 0.005;
      this.updateViewMatrix();
      this.draw();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  setDimensions(dimensions) {
    if (dimensions !== 2 && dimensions !== 3) {
      console.error('Invalid dimensions:', dimensions);
      return;
    }
    
    if (this.dimensions === dimensions) {
      return;
    }
    
    this.dimensions = dimensions;
    
    // Re-initialize with new dimensions
    this.initialized = false;
    this.initialize();
    
    // If we have data already, re-render
    if (this.nodes.length > 0) {
      this.setData({ nodes: this.nodes, edges: this.edges });
    }
  }
  
  setLayout(layout) {
    if (this.layout === layout) {
      return;
    }
    
    this.layout = layout;
    
    // If we have data already, re-render
    if (this.nodes.length > 0) {
      this.generateLayout();
      this.createBuffers();
      this.draw();
    }
  }
}`;

  // Client application script
  const appJsContent = `// TeglonLabs/topOS Trust Visualizer Client

import { loadTrustNetwork } from './trust-network.js';
import { WebGPUVisualizer } from './webgpu-visualizer.js';

// DOM Elements
const layoutTypeSelect = document.getElementById('layout-type');
const dimensionCountInput = document.getElementById('dimension-count');
const dimensionDisplay = document.getElementById('dimension-display');
const trustThresholdInput = document.getElementById('trust-threshold');
const thresholdDisplay = document.getElementById('threshold-display');
const regenerateButton = document.getElementById('regenerate-btn');
const networkInfo = document.getElementById('network-info');
const entityList = document.getElementById('entity-list');
const detailContent = document.getElementById('detail-content');
const loadingIndicator = document.getElementById('loading-indicator');
const webgpuCanvas = document.getElementById('webgpu-canvas');

// State
let trustNetwork = null;
let webgpuVisualizer = null;
let selectedEntity = null;
let currentLayout = 'force-directed';
let currentDimensions = 2;
let currentThreshold = 0;

// Initialize
async function initialize() {
  try {
    showLoading(true);
    
    // Initialize WebGPU visualizer
    webgpuVisualizer = new WebGPUVisualizer(webgpuCanvas);
    
    // Load trust network
    trustNetwork = await loadTrustNetwork();
    
    // Update UI
    updateNetworkInfo();
    updateEntityList();
    
    // Set initial trust threshold
    trustThresholdInput.value = currentThreshold;
    thresholdDisplay.textContent = formatThreshold(currentThreshold);
    
    // Set initial dimensions
    dimensionCountInput.value = currentDimensions;
    dimensionDisplay.textContent = \`\${currentDimensions}D\`;
    
    // Set initial layout
    layoutTypeSelect.value = currentLayout;
    
    // Initialize visualization
    updateVisualization();
    
    // Setup event listeners
    setupEventListeners();
    
    showLoading(false);
  } catch (err) {
    console.error('Initialization error:', err);
    showLoading(false);
    networkInfo.innerHTML = \`<div class="error">Error loading trust network: \${err.message}</div>\`;
  }
}

// Format threshold display
function formatThreshold(value) {
  if (value === -1) return 'Negative';
  if (value === 0) return 'Non-neutral';
  if (value === 1) return 'Positive';
  return value.toString();
}

// Update network information
function updateNetworkInfo() {
  if (!trustNetwork) {
    networkInfo.innerHTML = '<div class="loading">Loading...</div>';
    return;
  }
  
  const stats = trustNetwork.getNetworkStats();
  
  networkInfo.innerHTML = \`
    <div class="network-stat">
      <span class="stat-label">World:</span>
      <span class="stat-value">\${trustNetwork.worldId}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Entities:</span>
      <span class="stat-value">\${stats.entities}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Relationships:</span>
      <span class="stat-value">\${stats.relationships}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Positive:</span>
      <span class="stat-value">\${stats.positive}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Neutral:</span>
      <span class="stat-value">\${stats.neutral}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Negative:</span>
      <span class="stat-value">\${stats.negative}</span>
    </div>
    <div class="network-stat">
      <span class="stat-label">Density:</span>
      <span class="stat-value">\${(stats.density * 100).toFixed(1)}%</span>
    </div>
  \`;
}

// Update entity list
function updateEntityList() {
  if (!trustNetwork) {
    entityList.innerHTML = '<div class="loading">Loading...</div>';
    return;
  }
  
  const entities = trustNetwork.getEntities();
  
  entityList.innerHTML = '';
  
  for (const entity of entities) {
    const entityItem = document.createElement('div');
    entityItem.className = 'entity-item';
    
    // Add entity color
    const entityColor = document.createElement('div');
    entityColor.className = 'entity-color';
    entityColor.style.backgroundColor = entity === selectedEntity ? '#f39c12' : '#3498db';
    entityItem.appendChild(entityColor);
    
    // Add entity name
    const entityName = document.createTextNode(entity);
    entityItem.appendChild(entityName);
    
    // Add click handler
    entityItem.addEventListener('click', () => {
      selectEntity(entity);
    });
    
    entityList.appendChild(entityItem);
  }
}

// Update entity details
function updateEntityDetails() {
  if (!trustNetwork || !selectedEntity) {
    detailContent.innerHTML = '<div>Select an entity to view details</div>';
    return;
  }
  
  // Get outgoing trust relationships
  const outgoingTrust = trustNetwork.getEntityTrust(selectedEntity);
  
  // Get incoming trust relationships
  const incomingTrust = trustNetwork.getIncomingTrust(selectedEntity);
  
  detailContent.innerHTML = \`
    <div class="detail-section">
      <h4>Entity: \${selectedEntity}</h4>
    </div>
    
    <div class="detail-section">
      <h4>Outgoing Trust</h4>
      <div class="trust-matrix">
        \${Object.entries(outgoingTrust).map(([target, value]) => \`
          <div class="trust-relationship">
            <span class="trust-target">\${target}</span>
            <span class="trust-value \${value === 1 ? 'trust-positive' : value === 0 ? 'trust-neutral' : 'trust-negative'}">\${value}</span>
          </div>
        \`).join('')}
      </div>
    </div>
    
    <div class="detail-section">
      <h4>Incoming Trust</h4>
      <div class="trust-matrix">
        \${Object.entries(incomingTrust).map(([source, value]) => \`
          <div class="trust-relationship">
            <span class="trust-target">\${source}</span>
            <span class="trust-value \${value === 1 ? 'trust-positive' : value === 0 ? 'trust-neutral' : 'trust-negative'}">\${value}</span>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;
}

// Update visualization
function updateVisualization() {
  if (!trustNetwork || !webgpuVisualizer) return;
  
  showLoading(true);
  
  // Apply threshold filter
  const filteredNetwork = trustNetwork.filterByThreshold(currentThreshold);
  
  // Get graph data
  const graphData = filteredNetwork.getGraphData();
  
  // Set data
  webgpuVisualizer.setData(graphData);
  
  showLoading(false);
}

// Select entity
function selectEntity(entity) {
  selectedEntity = entity;
  
  // Update entity list
  updateEntityList();
  
  // Update entity details
  updateEntityDetails();
  
  // Update visualization
  webgpuVisualizer.selectEntity(entity);
}

// Setup event listeners
function setupEventListeners() {
  // Layout type change
  layoutTypeSelect.addEventListener('change', () => {
    currentLayout = layoutTypeSelect.value;
    webgpuVisualizer.setLayout(currentLayout);
  });
  
  // Dimension count change
  dimensionCountInput.addEventListener('input', () => {
    currentDimensions = parseInt(dimensionCountInput.value, 10);
    dimensionDisplay.textContent = \`\${currentDimensions}D\`;
    webgpuVisualizer.setDimensions(currentDimensions);
  });
  
  // Trust threshold change
  trustThresholdInput.addEventListener('input', () => {
    currentThreshold = parseInt(trustThresholdInput.value, 10);
    thresholdDisplay.textContent = formatThreshold(currentThreshold);
    updateVisualization();
  });
  
  // Regenerate button
  regenerateButton.addEventListener('click', () => {
    updateVisualization();
  });
  
  // Entity selection from canvas
  webgpuCanvas.addEventListener('entity-selected', (e) => {
    selectEntity(e.detail.entity);
  });
}

// Show/hide loading indicator
function showLoading(show) {
  loadingIndicator.classList.toggle('visible', show);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);`;

  // Write the files
  await fs.writeFile(path.join(PUBLIC_DIR, 'index.html'), indexHtml);
  await fs.writeFile(path.join(PUBLIC_DIR, 'style.css'), cssContent);
  await fs.writeFile(path.join(PUBLIC_DIR, 'trust-network.js'), trustNetworkJs);
  await fs.writeFile(path.join(PUBLIC_DIR, 'webgpu-visualizer.js'), webgpuVisualizerJs);
  await fs.writeFile(path.join(PUBLIC_DIR, 'app.js'), appJsContent);
  
  console.log('Generated client-side files for trust visualization');
}

// Configure Express and start server
async function configureServer() {
  // Serve trust network data
  app.get('/api/trust-network', async (req, res) => {
    try {
      const data = await fs.readFile(TRUST_NETWORK_PATH, 'utf8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to load trust network: ' + err.message });
    }
  });
  
  // Serve static files
  app.use(express.static(PUBLIC_DIR));
  
  // Handle all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

// Main function
async function main() {
  try {
    console.log('Setting up WebGPU Trust Visualizer...');
    
    // Setup directories and files
    await setupDirectories();
    await generateClientCode();
    await configureServer();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`
┌─────────────────────────────────────────────────────────┐
│                   TeglonLabs/topOS                      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│ world://    │ worm://     │ diagram://  │ vibe://      │
│ Entity Space│ Flow Logic  │ Visual Maps │ Trust Network│
├─────────────┴─────────────┴─────────────┴──────────────┤
│         WebGPU Trust Visualizer v1.0.0                 │
└─────────────────────────────────────────────────────────┘
      `);
      console.log(`Trust Visualizer running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT} in a WebGPU-capable browser`);
    });
  } catch (err) {
    console.error('Error starting trust visualizer:', err);
    process.exit(1);
  }
}

// Run the main function
main();