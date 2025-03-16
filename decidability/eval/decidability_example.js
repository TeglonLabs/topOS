/**
 * Decidability Proof for Categorical Transformations in topOS
 * 
 * This module implements a decidability checker for transformations between computational
 * worlds represented in category-theoretic terms. It provides mathematical criteria
 * to determine if a given transformation preserves enough structure to be decidable.
 */

// --- FunctorType Enum ---
const FunctorType = {
  STRUCTURE_PRESERVING: 'structure-preserving',
  PARTIAL: 'partial',
  MULTIVALUED: 'multivalued'
};

/**
 * Represents a transformation between computational worlds
 */
class WorldTransformation {
  /**
   * Create a world transformation
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.id = config.id;
    this.source = config.source; // Source world URI
    this.target = config.target; // Target world URI
    this.functorType = config.functorType;
    this.subobjectPreserving = config.subobjectPreserving;
    this.preservesColimits = config.preservesColimits;
    this.preservesLimits = config.preservesLimits;
    this.hasRightAdjoint = config.hasRightAdjoint;
    this.hasLeftAdjoint = config.hasLeftAdjoint;
    this.properties = config.properties || {};
  }
}

// --- Core decidability criteria ---

/**
 * Checks if transformation preserves categorical structure
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function structurePreservationCriterion(t) {
  const satisfied = t.functorType === FunctorType.STRUCTURE_PRESERVING;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation preserves categorical structure through a well-defined functor";
  } else {
    explanation = "The transformation does not fully preserve categorical structure";
  }
  
  return {
    name: "Structure Preservation",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation preserves subobject classifiers
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function subobjectClassifierCriterion(t) {
  const satisfied = t.subobjectPreserving;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation preserves subobject classifiers, maintaining logical structure";
  } else {
    explanation = "The transformation does not preserve subobject classifiers, potentially losing logical decidability";
  }
  
  return {
    name: "Subobject Classifier Preservation",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation preserves limits
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function limitPreservationCriterion(t) {
  const satisfied = t.preservesLimits;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation preserves limits, maintaining structural invariants";
  } else {
    explanation = "The transformation does not preserve limits, which may affect decidability of certain properties";
  }
  
  return {
    name: "Limit Preservation",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation preserves colimits
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function colimitPreservationCriterion(t) {
  const satisfied = t.preservesColimits;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation preserves colimits, maintaining compositional structure";
  } else {
    explanation = "The transformation does not preserve colimits, which may affect decidability of composed properties";
  }
  
  return {
    name: "Colimit Preservation",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation has adjoints for regularity
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function adjointExistenceCriterion(t) {
  const satisfied = t.hasLeftAdjoint || t.hasRightAdjoint;
  
  let explanation;
  if (satisfied) {
    let adjointType = "";
    if (t.hasLeftAdjoint) {
      adjointType += "a left";
    }
    if (t.hasLeftAdjoint && t.hasRightAdjoint) {
      adjointType += " and";
    }
    if (t.hasRightAdjoint) {
      adjointType += " a right";
    }
    explanation = `The transformation has ${adjointType} adjoint, providing computational regularity`;
  } else {
    explanation = "The transformation lacks adjoints, reducing computational regularity";
  }
  
  return {
    name: "Adjoint Existence",
    satisfied,
    explanation
  };
}

// --- Extended decidability criteria ---

/**
 * Checks if transformation exhibits path invariance
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function pathInvarianceCriterion(t) {
  const satisfied = t.properties.pathInvariant === true;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation exhibits path invariance, ensuring consistent results regardless of evaluation path";
  } else {
    explanation = "The transformation lacks path invariance, which may lead to non-deterministic evaluation";
  }
  
  return {
    name: "Path Invariance",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation has finite representation
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function finiteRepresentationCriterion(t) {
  const satisfied = t.properties.hasFiniteRepresentation === true;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation has a finite representation, enabling algorithmic processing";
  } else {
    explanation = "The transformation lacks a finite representation, potentially making algorithmic processing impossible";
  }
  
  return {
    name: "Finite Representation",
    satisfied,
    explanation
  };
}

/**
 * Checks if transformation preserves Lawvere-Tierney topologies
 * @param {WorldTransformation} t - The transformation to check
 * @returns {Object} Criterion result
 */
function lawvereTierneyCriterion(t) {
  const satisfied = t.properties.preservesLawvereTierney === true;
  
  let explanation;
  if (satisfied) {
    explanation = "The transformation preserves Lawvere-Tierney topologies, maintaining internal logic consistency";
  } else {
    explanation = "The transformation does not preserve Lawvere-Tierney topologies, potentially compromising internal logic";
  }
  
  return {
    name: "Lawvere-Tierney Topology",
    satisfied,
    explanation
  };
}

// --- Main decidability checking function ---

/**
 * Determines whether a world transformation is decidable
 * @param {WorldTransformation} transformation - The transformation to check
 * @param {Object} [context] - Optional context with additional information
 * @returns {Object} DecidabilityResult with determination and reasoning
 */
function isTransformationDecidable(transformation, context = null) {
  // Apply core criteria
  const coreCriteriaResults = [
    structurePreservationCriterion(transformation),
    subobjectClassifierCriterion(transformation),
    limitPreservationCriterion(transformation),
    colimitPreservationCriterion(transformation),
    adjointExistenceCriterion(transformation)
  ];
  
  // Apply extended criteria
  const extendedCriteriaResults = [
    pathInvarianceCriterion(transformation),
    finiteRepresentationCriterion(transformation),
    lawvereTierneyCriterion(transformation)
  ];
  
  // Combine all criteria
  const allCriteria = [...coreCriteriaResults, ...extendedCriteriaResults];
  
  // A transformation is decidable if it meets the core structural criteria
  // 1. Must be structure-preserving
  // 2. Must preserve subobject classifiers
  // 3. Must either preserve limits or colimits
  // 4. Should ideally have at least one adjoint
  
  const structurePreserving = coreCriteriaResults[0].satisfied;
  const subobjectPreserving = coreCriteriaResults[1].satisfied;
  const preservesLimitsOrColimits = coreCriteriaResults[2].satisfied || coreCriteriaResults[3].satisfied;
  const hasAdjoint = coreCriteriaResults[4].satisfied;
  
  // Primary decidability determination
  const isDecidable = structurePreserving && subobjectPreserving && preservesLimitsOrColimits;
  
  // Generate explanation
  let reason = "";
  if (isDecidable) {
    reason = "This transformation is decidable because it preserves essential categorical structure: ";
    reason += "it is structure-preserving, maintains subobject classifiers, ";
    
    const preserved = [];
    if (coreCriteriaResults[2].satisfied) {
      preserved.push("limits");
    }
    if (coreCriteriaResults[3].satisfied) {
      preserved.push("colimits");
    }
    
    reason += `and preserves ${preserved.join(' and ')}.`;
    
    if (hasAdjoint) {
      const adjointType = [];
      if (transformation.hasLeftAdjoint) {
        adjointType.push("a left");
      }
      if (transformation.hasRightAdjoint) {
        adjointType.push("a right");
      }
      reason += ` Additionally, it has ${adjointType.join(' and ')} adjoint, providing computational regularity.`;
    }
  } else {
    reason = "This transformation is not decidable because it fails to preserve essential categorical structure: ";
    const failures = [];
    if (!structurePreserving) {
      failures.push("it is not structure-preserving");
    }
    if (!subobjectPreserving) {
      failures.push("it does not maintain subobject classifiers");
    }
    if (!preservesLimitsOrColimits) {
      failures.push("it preserves neither limits nor colimits");
    }
    
    reason += failures.join("; ") + ".";
  }
  
  return {
    isDecidable,
    reason,
    criteria: allCriteria
  };
}

/**
 * Example function demonstrating decidability checking for a transformation
 * @param {string} sourceWorld - URI of the source world
 * @param {string} targetWorld - URI of the target world
 * @param {Object} properties - Properties of the transformation
 * @returns {Object} DecidabilityResult with determination and reasoning
 */
function checkWorldTransformationDecidability(sourceWorld, targetWorld, properties = {}) {
  // Create a WorldTransformation object
  const transformation = new WorldTransformation({
    id: properties.id || `${sourceWorld}_to_${targetWorld}`,
    source: sourceWorld,
    target: targetWorld,
    functorType: properties.functorType || FunctorType.STRUCTURE_PRESERVING,
    subobjectPreserving: properties.subobjectPreserving ?? false,
    preservesColimits: properties.preservesColimits ?? false,
    preservesLimits: properties.preservesLimits ?? false,
    hasRightAdjoint: properties.hasRightAdjoint ?? false,
    hasLeftAdjoint: properties.hasLeftAdjoint ?? false,
    properties: properties.properties || {}
  });
  
  // Check decidability
  return isTransformationDecidable(transformation);
}

// --- Example transformations ---

/**
 * Creates an example decidable transformation between worlds
 * @returns {WorldTransformation} A decidable transformation
 */
function getExampleDecidableTransformation() {
  return new WorldTransformation({
    id: "cognitive_to_execution",
    source: "world://systems/cognition",
    target: "world://systems/execution",
    functorType: FunctorType.STRUCTURE_PRESERVING,
    subobjectPreserving: true,
    preservesColimits: true,
    preservesLimits: true,
    hasRightAdjoint: true,
    hasLeftAdjoint: false,
    properties: {
      pathInvariant: true,
      hasFiniteRepresentation: true,
      preservesLawvereTierney: true
    }
  });
}

/**
 * Creates an example non-decidable transformation between worlds
 * @returns {WorldTransformation} A non-decidable transformation
 */
function getExampleNonDecidableTransformation() {
  return new WorldTransformation({
    id: "perception_to_cognition",
    source: "world://systems/perception",
    target: "world://systems/cognition",
    functorType: FunctorType.PARTIAL,
    subobjectPreserving: false,
    preservesColimits: false,
    preservesLimits: true,
    hasRightAdjoint: false,
    hasLeftAdjoint: false,
    properties: {
      pathInvariant: false,
      hasFiniteRepresentation: false,
      preservesLawvereTierney: false
    }
  });
}

/**
 * Demonstrates checking decidability of transformations
 */
function demonstrateDecidabilityCheck() {
  // Decidable example
  const decidableTransformation = getExampleDecidableTransformation();
  const decidableResult = isTransformationDecidable(decidableTransformation);
  
  console.log(`Decidable transformation: ${decidableTransformation.id}`);
  console.log(`Result: ${decidableResult.isDecidable ? 'Decidable' : 'Not decidable'}`);
  console.log(`Reason: ${decidableResult.reason}`);
  console.log("\nCriteria:");
  for (const criterion of decidableResult.criteria) {
    console.log(`- ${criterion.name}: ${criterion.satisfied ? '✓' : '✗'}`);
    console.log(`  ${criterion.explanation}`);
  }
  
  console.log("\n" + "-".repeat(80) + "\n");
  
  // Non-decidable example
  const nonDecidableTransformation = getExampleNonDecidableTransformation();
  const nonDecidableResult = isTransformationDecidable(nonDecidableTransformation);
  
  console.log(`Non-decidable transformation: ${nonDecidableTransformation.id}`);
  console.log(`Result: ${nonDecidableResult.isDecidable ? 'Decidable' : 'Not decidable'}`);
  console.log(`Reason: ${nonDecidableResult.reason}`);
  console.log("\nCriteria:");
  for (const criterion of nonDecidableResult.criteria) {
    console.log(`- ${criterion.name}: ${criterion.satisfied ? '✓' : '✗'}`);
    console.log(`  ${criterion.explanation}`);
  }
  
  return {
    decidableResult,
    nonDecidableResult
  };
}

// Export functions for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FunctorType,
    WorldTransformation,
    isTransformationDecidable,
    checkWorldTransformationDecidability,
    getExampleDecidableTransformation,
    getExampleNonDecidableTransformation,
    demonstrateDecidabilityCheck
  };
}

// If running directly (not imported), demonstrate the functionality
if (typeof require !== 'undefined' && require.main === module) {
  demonstrateDecidabilityCheck();
}