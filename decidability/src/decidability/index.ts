/**
 * topos-decidability.ts
 * 
 * Implements decidability criteria for categorical transformations in topOS
 * using principles from category theory and topos theory.
 */

import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import {
  Category,
  ElementaryTopos,
  Functor,
  NaturalTransformation,
  Presheaf,
  Site,
  Sheaf
} from '../topos-categories'
import {
  Partition,
  Subobject,
  PartitionClassifier,
  partitionOps,
  classifierOps
} from '../topos-classifier'

// --- Type Definitions ---

/**
 * WorldTransformation describes a transformation between world structures
 */
export interface WorldTransformation {
  id: string;
  source: string; // URI of source world
  target: string; // URI of target world
  functorType: 'structure-preserving' | 'partial' | 'multivalued';
  subobjectPreserving: boolean;
  preservesColimits: boolean;
  preservesLimits: boolean;
  hasRightAdjoint: boolean;
  hasLeftAdjoint: boolean;
  properties: Record<string, boolean>;
}

/**
 * DecidabilityResult contains the result of a decidability check
 */
export interface DecidabilityResult {
  isDecidable: boolean;
  reason: string;
  criteria: Array<{
    name: string;
    satisfied: boolean;
    explanation: string;
  }>;
}

/**
 * DecidabilityContext provides context for decidability checking
 */
export interface DecidabilityContext {
  worldRegistry: Record<string, {
    subobjectClassifier: boolean;
    hasPowerObject: boolean;
    isCartesianClosed: boolean;
    hasNaturalNumberObject: boolean;
  }>;
  morphismRegistry: Record<string, {
    source: string;
    target: string;
    isMonomorphism: boolean;
    isEpimorphism: boolean;
    isIsomorphism: boolean;
  }>;
}

// --- Decidability Criteria ---

/**
 * Core criteria for determining decidability of world transformations
 */
const decidabilityCriteria = [
  {
    name: "Structure Preservation",
    check: (t: WorldTransformation) => t.functorType === 'structure-preserving',
    explanation: (t: WorldTransformation) => 
      t.functorType === 'structure-preserving' 
        ? "The transformation preserves categorical structure through a well-defined functor"
        : "The transformation does not fully preserve categorical structure"
  },
  {
    name: "Subobject Classifier Preservation",
    check: (t: WorldTransformation) => t.subobjectPreserving,
    explanation: (t: WorldTransformation) => 
      t.subobjectPreserving
        ? "The transformation preserves subobject classifiers, maintaining logical structure"
        : "The transformation does not preserve subobject classifiers, potentially losing logical decidability"
  },
  {
    name: "Limit Preservation",
    check: (t: WorldTransformation) => t.preservesLimits,
    explanation: (t: WorldTransformation) => 
      t.preservesLimits
        ? "The transformation preserves limits, maintaining structural invariants"
        : "The transformation does not preserve limits, which may affect decidability of certain properties"
  },
  {
    name: "Colimit Preservation",
    check: (t: WorldTransformation) => t.preservesColimits,
    explanation: (t: WorldTransformation) => 
      t.preservesColimits
        ? "The transformation preserves colimits, maintaining compositional structure"
        : "The transformation does not preserve colimits, which may affect decidability of composed properties"
  },
  {
    name: "Adjoint Existence",
    check: (t: WorldTransformation) => t.hasLeftAdjoint || t.hasRightAdjoint,
    explanation: (t: WorldTransformation) => 
      (t.hasLeftAdjoint || t.hasRightAdjoint)
        ? `The transformation has ${t.hasLeftAdjoint ? 'a left' : ''}${t.hasLeftAdjoint && t.hasRightAdjoint ? ' and' : ''}${t.hasRightAdjoint ? ' a right' : ''} adjoint, providing computational regularity`
        : "The transformation lacks adjoints, reducing computational regularity"
  }
];

/**
 * Extended criteria for more specific decidability properties
 */
const extendedCriteria = [
  {
    name: "Path Invariance",
    check: (t: WorldTransformation) => t.properties?.pathInvariant === true,
    explanation: (t: WorldTransformation) => 
      t.properties?.pathInvariant === true
        ? "The transformation exhibits path invariance, ensuring consistent results regardless of evaluation path"
        : "The transformation lacks path invariance, which may lead to non-deterministic evaluation"
  },
  {
    name: "Finite Representation",
    check: (t: WorldTransformation) => t.properties?.hasFiniteRepresentation === true,
    explanation: (t: WorldTransformation) => 
      t.properties?.hasFiniteRepresentation === true
        ? "The transformation has a finite representation, enabling algorithmic processing"
        : "The transformation lacks a finite representation, potentially making algorithmic processing impossible"
  },
  {
    name: "Lawvere-Tierney Topology",
    check: (t: WorldTransformation) => t.properties?.preservesLawvereTierney === true,
    explanation: (t: WorldTransformation) => 
      t.properties?.preservesLawvereTierney === true
        ? "The transformation preserves Lawvere-Tierney topologies, maintaining internal logic consistency"
        : "The transformation does not preserve Lawvere-Tierney topologies, potentially compromising internal logic"
  }
];

// --- Decision Procedure ---

/**
 * Determines whether a world transformation is decidable
 * 
 * @param transformation The world transformation to check
 * @param context Additional context for the decidability check
 * @returns DecidabilityResult with determination and reasoning
 */
export function isTransformationDecidable(
  transformation: WorldTransformation,
  context?: DecidabilityContext
): DecidabilityResult {
  // Apply core criteria
  const coreCriteriaResults = decidabilityCriteria.map(criterion => ({
    name: criterion.name,
    satisfied: criterion.check(transformation),
    explanation: criterion.explanation(transformation)
  }));
  
  // Apply extended criteria if available
  const extendedCriteriaResults = extendedCriteria.map(criterion => ({
    name: criterion.name,
    satisfied: criterion.check(transformation),
    explanation: criterion.explanation(transformation)
  }));
  
  // Combine all criteria results
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
    reason += `and preserves ${coreCriteriaResults[2].satisfied ? 'limits' : ''}${coreCriteriaResults[2].satisfied && coreCriteriaResults[3].satisfied ? ' and ' : ''}${coreCriteriaResults[3].satisfied ? 'colimits' : ''}.`;
    
    if (hasAdjoint) {
      reason += ` Additionally, it has ${transformation.hasLeftAdjoint ? 'a left' : ''}${transformation.hasLeftAdjoint && transformation.hasRightAdjoint ? ' and' : ''}${transformation.hasRightAdjoint ? ' a right' : ''} adjoint, providing computational regularity.`;
    }
  } else {
    reason = "This transformation is not decidable because it fails to preserve essential categorical structure: ";
    if (!structurePreserving) reason += "it is not structure-preserving; ";
    if (!subobjectPreserving) reason += "it does not maintain subobject classifiers; ";
    if (!preservesLimitsOrColimits) reason += "it preserves neither limits nor colimits; ";
    reason = reason.slice(0, -2) + ".";
  }
  
  return {
    isDecidable,
    reason,
    criteria: allCriteria
  };
}

/**
 * Checks if a morphism between worlds is decidable
 * Used for path-specific decidability checks
 */
export function isMorphismDecidable(
  source: string,
  target: string,
  morphismId: string,
  context: DecidabilityContext
): E.Either<string, boolean> {
  // Look up the morphism in the registry
  const morphism = pipe(
    O.fromNullable(context.morphismRegistry[morphismId]),
    O.chain(m => m.source === source && m.target === target ? O.some(m) : O.none),
    E.fromOption(() => `Morphism ${morphismId} not found or doesn't connect ${source} to ${target}`)
  );
  
  // Isomorphisms and monomorphisms that are also epimorphisms are decidable
  return pipe(
    morphism,
    E.map(m => m.isIsomorphism || (m.isMonomorphism && m.isEpimorphism))
  );
}

/**
 * Example function demonstrating decidability checking for a transformation
 */
export function checkWorldTransformationDecidability(
  sourceWorld: string,
  targetWorld: string,
  transformationProperties: Partial<WorldTransformation>
): DecidabilityResult {
  // Create a complete transformation object
  const transformation: WorldTransformation = {
    id: transformationProperties.id || `${sourceWorld}_to_${targetWorld}`,
    source: sourceWorld,
    target: targetWorld,
    functorType: transformationProperties.functorType || 'structure-preserving',
    subobjectPreserving: transformationProperties.subobjectPreserving ?? false,
    preservesColimits: transformationProperties.preservesColimits ?? false,
    preservesLimits: transformationProperties.preservesLimits ?? false,
    hasRightAdjoint: transformationProperties.hasRightAdjoint ?? false,
    hasLeftAdjoint: transformationProperties.hasLeftAdjoint ?? false,
    properties: transformationProperties.properties || {}
  };
  
  // Check decidability
  return isTransformationDecidable(transformation);
}

// --- Example Usage ---

/**
 * Example decidable transformation between cognitive worlds
 */
export const exampleDecidableTransformation: WorldTransformation = {
  id: 'cognitive_to_execution',
  source: 'world://systems/cognition',
  target: 'world://systems/execution',
  functorType: 'structure-preserving',
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
};

/**
 * Example non-decidable transformation between perceptual worlds
 */
export const exampleNonDecidableTransformation: WorldTransformation = {
  id: 'perception_to_cognition',
  source: 'world://systems/perception',
  target: 'world://systems/cognition',
  functorType: 'partial',
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
};