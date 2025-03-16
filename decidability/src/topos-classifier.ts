/**
 * topos-classifier.ts
 * 
 * Implements subobject classifiers and partition logic for topOS
 */

/**
 * Represents a partition of a set
 */
export interface Partition {
  universe: string[];
  blocks: number[][];  // Indices into the universe array
}

/**
 * Represents a subobject of a set
 */
export interface Subobject {
  universe: string[];
  elements: number[];  // Indices into the universe array
}

/**
 * A partition classifier contains partitions and refinements
 */
export interface PartitionClassifier {
  baseSet: string[];
  partitions: Partition[];
  refinements: Array<{
    coarser: Partition;
    finer: Partition;
    refinementMap: Record<number, number>;  // Maps block indices
  }>;
  truthValues: Array<{
    partition: number;
    block: number;
  }>;
}

/**
 * Operations for working with partitions
 */
export const partitionOps = {
  /**
   * Create a partition from a universe set and equivalence classes
   */
  create: (universe: string[], blocks: number[][]): Partition => {
    // Validate that each element of the universe appears exactly once
    const elementCount = new Map<number, number>();
    for (const block of blocks) {
      for (const element of block) {
        elementCount.set(element, (elementCount.get(element) || 0) + 1);
      }
    }
    
    // Check for missing or duplicate elements
    for (let i = 0; i < universe.length; i++) {
      const count = elementCount.get(i) || 0;
      if (count !== 1) {
        throw new Error(`Invalid partition: element ${i} appears ${count} times`);
      }
    }
    
    return { universe, blocks };
  },
  
  /**
   * Get the block containing a specific element
   */
  blockOf: (partition: Partition, element: number): number => {
    for (let i = 0; i < partition.blocks.length; i++) {
      if (partition.blocks[i].includes(element)) {
        return i;
      }
    }
    throw new Error(`Element ${element} not found in partition`);
  },
  
  /**
   * Check if one partition refines another
   */
  refines: (finer: Partition, coarser: Partition): boolean => {
    if (finer.universe !== coarser.universe) {
      return false;
    }
    
    // For each block in the finer partition
    for (const finerBlock of finer.blocks) {
      // Find the block in the coarser partition that contains the first element
      const element = finerBlock[0];
      const coarserBlockIndex = partitionOps.blockOf(coarser, element);
      const coarserBlock = coarser.blocks[coarserBlockIndex];
      
      // Check if all elements in the finer block are in the same coarser block
      for (const e of finerBlock) {
        if (!coarserBlock.includes(e)) {
          return false;
        }
      }
    }
    
    return true;
  },
  
  /**
   * Compute the meet (greatest lower bound) of two partitions
   */
  meet: (p1: Partition, p2: Partition): Partition => {
    if (p1.universe !== p2.universe) {
      throw new Error("Cannot compute meet of partitions with different universes");
    }
    
    const universe = p1.universe;
    const n = universe.length;
    
    // Start with discrete partition
    const blocks: number[][] = Array(n).fill(0).map((_, i) => [i]);
    
    // For each pair of elements
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // If they're in the same block in both partitions
        const p1BlockI = partitionOps.blockOf(p1, i);
        const p1BlockJ = partitionOps.blockOf(p1, j);
        const p2BlockI = partitionOps.blockOf(p2, i);
        const p2BlockJ = partitionOps.blockOf(p2, j);
        
        if (p1BlockI === p1BlockJ && p2BlockI === p2BlockJ) {
          // Merge blocks
          const blockI = blocks.findIndex(block => block.includes(i));
          const blockJ = blocks.findIndex(block => block.includes(j));
          
          if (blockI !== blockJ) {
            blocks[blockI] = [...blocks[blockI], ...blocks[blockJ]];
            blocks.splice(blockJ, 1);
          }
        }
      }
    }
    
    return { universe, blocks };
  },
  
  /**
   * Compute the join (least upper bound) of two partitions
   */
  join: (p1: Partition, p2: Partition): Partition => {
    if (p1.universe !== p2.universe) {
      throw new Error("Cannot compute join of partitions with different universes");
    }
    
    const universe = p1.universe;
    const n = universe.length;
    
    // Construct equivalence relation graph
    const edges: [number, number][] = [];
    
    // Add edges from p1
    for (const block of p1.blocks) {
      for (let i = 0; i < block.length; i++) {
        for (let j = i + 1; j < block.length; j++) {
          edges.push([block[i], block[j]]);
        }
      }
    }
    
    // Add edges from p2
    for (const block of p2.blocks) {
      for (let i = 0; i < block.length; i++) {
        for (let j = i + 1; j < block.length; j++) {
          edges.push([block[i], block[j]]);
        }
      }
    }
    
    // Compute connected components using Union-Find
    const parent = Array(n).fill(0).map((_, i) => i);
    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };
    const union = (x: number, y: number) => {
      parent[find(x)] = find(y);
    };
    
    // Process all edges
    for (const [a, b] of edges) {
      union(a, b);
    }
    
    // Collect connected components
    const componentMap = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!componentMap.has(root)) {
        componentMap.set(root, []);
      }
      componentMap.get(root)!.push(i);
    }
    
    const blocks = Array.from(componentMap.values());
    
    return { universe, blocks };
  }
};

/**
 * Operations for working with subobject classifiers
 */
export const classifierOps = {
  /**
   * Create a subobject from a universe set and a subset
   */
  createSubobject: (universe: string[], elements: number[]): Subobject => {
    // Validate that elements are valid indices
    for (const e of elements) {
      if (e < 0 || e >= universe.length) {
        throw new Error(`Invalid element index ${e}`);
      }
    }
    
    return { universe, elements };
  },
  
  /**
   * Check if an element is in a subobject
   */
  contains: (subobject: Subobject, element: number): boolean => {
    return subobject.elements.includes(element);
  },
  
  /**
   * Create the characteristic function for a subobject
   */
  characterize: (subobject: Subobject, classifier: PartitionClassifier): number => {
    // Use the subobject to determine which truth value to return
    // We use a simple mapping: if the subobject is the empty set, return false, otherwise true
    return subobject.elements.length > 0 ? 1 : 0;
  },
  
  /**
   * Compute the intersection of two subobjects
   */
  intersection: (s1: Subobject, s2: Subobject): Subobject => {
    if (s1.universe !== s2.universe) {
      throw new Error("Cannot intersect subobjects with different universes");
    }
    
    const elements = s1.elements.filter(e => s2.elements.includes(e));
    return { universe: s1.universe, elements };
  },
  
  /**
   * Compute the union of two subobjects
   */
  union: (s1: Subobject, s2: Subobject): Subobject => {
    if (s1.universe !== s2.universe) {
      throw new Error("Cannot union subobjects with different universes");
    }
    
    const elements = [...new Set([...s1.elements, ...s2.elements])];
    return { universe: s1.universe, elements };
  },
  
  /**
   * Compute the complement of a subobject
   */
  complement: (s: Subobject): Subobject => {
    const universe = s.universe;
    const elements = [];
    
    for (let i = 0; i < universe.length; i++) {
      if (!s.elements.includes(i)) {
        elements.push(i);
      }
    }
    
    return { universe, elements };
  }
};