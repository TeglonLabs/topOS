"""
Decidability Proof for Categorical Transformations in topOS

This module implements a decidability checker for transformations between computational
worlds represented in category-theoretic terms. It provides mathematical criteria
to determine if a given transformation preserves enough structure to be decidable.
"""

from typing import Dict, List, Optional, Tuple, Union, TypedDict
from dataclasses import dataclass
from enum import Enum


class FunctorType(str, Enum):
    """Types of functors that can represent transformations between worlds"""
    STRUCTURE_PRESERVING = "structure-preserving"
    PARTIAL = "partial"
    MULTIVALUED = "multivalued"


@dataclass
class WorldTransformation:
    """Represents a transformation between computational worlds"""
    id: str
    source: str  # Source world URI
    target: str  # Target world URI
    functor_type: FunctorType
    subobject_preserving: bool
    preserves_colimits: bool
    preserves_limits: bool
    has_right_adjoint: bool
    has_left_adjoint: bool
    properties: Dict[str, bool]


class CriterionResult(TypedDict):
    """Result of evaluating a single decidability criterion"""
    name: str
    satisfied: bool
    explanation: str


class DecidabilityResult(TypedDict):
    """Complete result of a decidability check"""
    is_decidable: bool
    reason: str
    criteria: List[CriterionResult]


@dataclass
class WorldRegistry:
    """Registry of known worlds for context"""
    worlds: Dict[str, Dict[str, bool]]


@dataclass
class MorphismRegistry:
    """Registry of known morphisms for context"""
    morphisms: Dict[str, Dict[str, Union[str, bool]]]


@dataclass
class DecidabilityContext:
    """Context for decidability checking"""
    world_registry: WorldRegistry
    morphism_registry: MorphismRegistry


# Core decidability criteria
def structure_preservation_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation preserves categorical structure"""
    satisfied = t.functor_type == FunctorType.STRUCTURE_PRESERVING
    
    if satisfied:
        explanation = "The transformation preserves categorical structure through a well-defined functor"
    else:
        explanation = "The transformation does not fully preserve categorical structure"
        
    return {
        "name": "Structure Preservation",
        "satisfied": satisfied,
        "explanation": explanation
    }


def subobject_classifier_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation preserves subobject classifiers"""
    satisfied = t.subobject_preserving
    
    if satisfied:
        explanation = "The transformation preserves subobject classifiers, maintaining logical structure"
    else:
        explanation = "The transformation does not preserve subobject classifiers, potentially losing logical decidability"
        
    return {
        "name": "Subobject Classifier Preservation",
        "satisfied": satisfied,
        "explanation": explanation
    }


def limit_preservation_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation preserves limits"""
    satisfied = t.preserves_limits
    
    if satisfied:
        explanation = "The transformation preserves limits, maintaining structural invariants"
    else:
        explanation = "The transformation does not preserve limits, which may affect decidability of certain properties"
        
    return {
        "name": "Limit Preservation",
        "satisfied": satisfied,
        "explanation": explanation
    }


def colimit_preservation_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation preserves colimits"""
    satisfied = t.preserves_colimits
    
    if satisfied:
        explanation = "The transformation preserves colimits, maintaining compositional structure"
    else:
        explanation = "The transformation does not preserve colimits, which may affect decidability of composed properties"
        
    return {
        "name": "Colimit Preservation",
        "satisfied": satisfied,
        "explanation": explanation
    }


def adjoint_existence_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation has adjoints for regularity"""
    satisfied = t.has_left_adjoint or t.has_right_adjoint
    
    if satisfied:
        adjoint_type = ""
        if t.has_left_adjoint:
            adjoint_type += "a left"
        if t.has_left_adjoint and t.has_right_adjoint:
            adjoint_type += " and"
        if t.has_right_adjoint:
            adjoint_type += " a right"
        explanation = f"The transformation has {adjoint_type} adjoint, providing computational regularity"
    else:
        explanation = "The transformation lacks adjoints, reducing computational regularity"
        
    return {
        "name": "Adjoint Existence",
        "satisfied": satisfied,
        "explanation": explanation
    }


# Extended decidability criteria
def path_invariance_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation exhibits path invariance"""
    satisfied = t.properties.get("path_invariant", False)
    
    if satisfied:
        explanation = "The transformation exhibits path invariance, ensuring consistent results regardless of evaluation path"
    else:
        explanation = "The transformation lacks path invariance, which may lead to non-deterministic evaluation"
        
    return {
        "name": "Path Invariance",
        "satisfied": satisfied,
        "explanation": explanation
    }


def finite_representation_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation has finite representation"""
    satisfied = t.properties.get("has_finite_representation", False)
    
    if satisfied:
        explanation = "The transformation has a finite representation, enabling algorithmic processing"
    else:
        explanation = "The transformation lacks a finite representation, potentially making algorithmic processing impossible"
        
    return {
        "name": "Finite Representation",
        "satisfied": satisfied,
        "explanation": explanation
    }


def lawvere_tierney_criterion(t: WorldTransformation) -> CriterionResult:
    """Check if transformation preserves Lawvere-Tierney topologies"""
    satisfied = t.properties.get("preserves_lawvere_tierney", False)
    
    if satisfied:
        explanation = "The transformation preserves Lawvere-Tierney topologies, maintaining internal logic consistency"
    else:
        explanation = "The transformation does not preserve Lawvere-Tierney topologies, potentially compromising internal logic"
        
    return {
        "name": "Lawvere-Tierney Topology",
        "satisfied": satisfied,
        "explanation": explanation
    }


# Main decidability checking function
def is_transformation_decidable(
    transformation: WorldTransformation,
    context: Optional[DecidabilityContext] = None
) -> DecidabilityResult:
    """
    Determines whether a world transformation is decidable
    
    Args:
        transformation: The transformation to check
        context: Optional context with additional information
        
    Returns:
        A DecidabilityResult with determination and reasoning
    """
    # Apply core criteria
    core_criteria_results = [
        structure_preservation_criterion(transformation),
        subobject_classifier_criterion(transformation),
        limit_preservation_criterion(transformation),
        colimit_preservation_criterion(transformation),
        adjoint_existence_criterion(transformation)
    ]
    
    # Apply extended criteria
    extended_criteria_results = [
        path_invariance_criterion(transformation),
        finite_representation_criterion(transformation),
        lawvere_tierney_criterion(transformation)
    ]
    
    # Combine all criteria
    all_criteria = core_criteria_results + extended_criteria_results
    
    # A transformation is decidable if it meets the core structural criteria
    # 1. Must be structure-preserving
    # 2. Must preserve subobject classifiers
    # 3. Must either preserve limits or colimits
    # 4. Should ideally have at least one adjoint
    
    structure_preserving = core_criteria_results[0]["satisfied"]
    subobject_preserving = core_criteria_results[1]["satisfied"]
    preserves_limits_or_colimits = core_criteria_results[2]["satisfied"] or core_criteria_results[3]["satisfied"]
    has_adjoint = core_criteria_results[4]["satisfied"]
    
    # Primary decidability determination
    is_decidable = structure_preserving and subobject_preserving and preserves_limits_or_colimits
    
    # Generate explanation
    if is_decidable:
        reason = "This transformation is decidable because it preserves essential categorical structure: "
        reason += "it is structure-preserving, maintains subobject classifiers, "
        
        preserved = []
        if core_criteria_results[2]["satisfied"]:
            preserved.append("limits")
        if core_criteria_results[3]["satisfied"]:
            preserved.append("colimits")
            
        reason += f"and preserves {' and '.join(preserved)}."
        
        if has_adjoint:
            adjoint_type = []
            if transformation.has_left_adjoint:
                adjoint_type.append("a left")
            if transformation.has_right_adjoint:
                adjoint_type.append("a right")
            reason += f" Additionally, it has {' and '.join(adjoint_type)} adjoint, providing computational regularity."
    else:
        reason = "This transformation is not decidable because it fails to preserve essential categorical structure: "
        failures = []
        if not structure_preserving:
            failures.append("it is not structure-preserving")
        if not subobject_preserving:
            failures.append("it does not maintain subobject classifiers")
        if not preserves_limits_or_colimits:
            failures.append("it preserves neither limits nor colimits")
            
        reason += "; ".join(failures) + "."
    
    return {
        "is_decidable": is_decidable,
        "reason": reason,
        "criteria": all_criteria
    }


def check_world_transformation_decidability(
    source_world: str,
    target_world: str,
    properties: Dict[str, Union[str, bool, Dict[str, bool]]]
) -> DecidabilityResult:
    """
    Example function demonstrating decidability checking for a transformation
    
    Args:
        source_world: URI of the source world
        target_world: URI of the target world
        properties: Properties of the transformation
        
    Returns:
        DecidabilityResult with determination and reasoning
    """
    # Convert the properties dict to a WorldTransformation object
    transformation = WorldTransformation(
        id=properties.get("id", f"{source_world}_to_{target_world}"),
        source=source_world,
        target=target_world,
        functor_type=properties.get("functor_type", FunctorType.STRUCTURE_PRESERVING),
        subobject_preserving=properties.get("subobject_preserving", False),
        preserves_colimits=properties.get("preserves_colimits", False),
        preserves_limits=properties.get("preserves_limits", False),
        has_right_adjoint=properties.get("has_right_adjoint", False),
        has_left_adjoint=properties.get("has_left_adjoint", False),
        properties=properties.get("properties", {})
    )
    
    # Check decidability
    return is_transformation_decidable(transformation)


# Example transformations
def get_example_decidable_transformation() -> WorldTransformation:
    """Creates an example decidable transformation between worlds"""
    return WorldTransformation(
        id="cognitive_to_execution",
        source="world://systems/cognition",
        target="world://systems/execution",
        functor_type=FunctorType.STRUCTURE_PRESERVING,
        subobject_preserving=True,
        preserves_colimits=True,
        preserves_limits=True,
        has_right_adjoint=True,
        has_left_adjoint=False,
        properties={
            "path_invariant": True,
            "has_finite_representation": True,
            "preserves_lawvere_tierney": True
        }
    )


def get_example_non_decidable_transformation() -> WorldTransformation:
    """Creates an example non-decidable transformation between worlds"""
    return WorldTransformation(
        id="perception_to_cognition",
        source="world://systems/perception",
        target="world://systems/cognition",
        functor_type=FunctorType.PARTIAL,
        subobject_preserving=False,
        preserves_colimits=False,
        preserves_limits=True,
        has_right_adjoint=False,
        has_left_adjoint=False,
        properties={
            "path_invariant": False,
            "has_finite_representation": False,
            "preserves_lawvere_tierney": False
        }
    )


# Example demonstration
def demonstrate_decidability_check():
    """Demonstrates checking decidability of transformations"""
    # Decidable example
    decidable_transformation = get_example_decidable_transformation()
    decidable_result = is_transformation_decidable(decidable_transformation)
    
    print(f"Decidable transformation: {decidable_transformation.id}")
    print(f"Result: {'Decidable' if decidable_result['is_decidable'] else 'Not decidable'}")
    print(f"Reason: {decidable_result['reason']}")
    print("\nCriteria:")
    for criterion in decidable_result["criteria"]:
        print(f"- {criterion['name']}: {'✓' if criterion['satisfied'] else '✗'}")
        print(f"  {criterion['explanation']}")
    
    print("\n" + "-"*80 + "\n")
    
    # Non-decidable example
    non_decidable_transformation = get_example_non_decidable_transformation()
    non_decidable_result = is_transformation_decidable(non_decidable_transformation)
    
    print(f"Non-decidable transformation: {non_decidable_transformation.id}")
    print(f"Result: {'Decidable' if non_decidable_result['is_decidable'] else 'Not decidable'}")
    print(f"Reason: {non_decidable_result['reason']}")
    print("\nCriteria:")
    for criterion in non_decidable_result["criteria"]:
        print(f"- {criterion['name']}: {'✓' if criterion['satisfied'] else '✗'}")
        print(f"  {criterion['explanation']}")


if __name__ == "__main__":
    demonstrate_decidability_check()