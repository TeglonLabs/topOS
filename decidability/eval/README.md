# topOS Decidability Evaluation Framework

This directory contains the implementation and evaluation tools for the topOS Decidability Framework, which provides mathematical guarantees about which world transformations can be algorithmically resolved.

## Overview

The Decidability Framework enables formal verification of transformation properties in category-theoretic terms. It helps determine which paths through computational space are guaranteed to terminate and produce consistent results.

## Files

- **topos-decidability.ts**: TypeScript implementation of the decidability framework
- **decidability_example.py**: Python implementation for MCP evaluation
- **decidability_example.js**: JavaScript implementation compatible with Node.js and browsers
- **decidability-test.toml**: Test configuration for validating decidability properties

## Usage

### TypeScript/JavaScript

```typescript
import { isTransformationDecidable, WorldTransformation } from './topos-decidability';

const transformation = new WorldTransformation({
  id: "cognitive_to_execution",
  source: "world://systems/cognition",
  target: "world://systems/execution",
  functorType: "structure-preserving",
  subobjectPreserving: true,
  preservesLimits: true,
  preservesColimits: true,
  hasRightAdjoint: true,
  hasLeftAdjoint: false,
  properties: {
    pathInvariant: true,
    hasFiniteRepresentation: true,
    preservesLawvereTierney: true
  }
});

const result = isTransformationDecidable(transformation);
console.log(`Is decidable: ${result.isDecidable}`);
console.log(`Reason: ${result.reason}`);
```

### Python

```python
from decidability_example import is_transformation_decidable, WorldTransformation, FunctorType

transformation = WorldTransformation(
    id="cognitive_to_execution",
    source="world://systems/cognition",
    target="world://systems/execution",
    functor_type=FunctorType.STRUCTURE_PRESERVING,
    subobject_preserving=True,
    preserves_limits=True,
    preserves_colimits=True,
    has_right_adjoint=True,
    has_left_adjoint=False,
    properties={
        "path_invariant": True,
        "has_finite_representation": True,
        "preserves_lawvere_tierney": True
    }
)

result = is_transformation_decidable(transformation)
print(f"Is decidable: {result['is_decidable']}")
print(f"Reason: {result['reason']}")
```

## MCPX Evaluation

To run the decidability tests with mcpx-eval:

```bash
cd /path/to/mcpx-eval
mcpx-eval test --model claude-3-5-sonnet-latest --config ./tests/decidability-test.toml
```

## Core Decidability Criteria

A transformation is considered decidable if it meets these core criteria:

1. **Structure Preservation**: Functor type must preserve categorical structure
2. **Subobject Classifier Preservation**: Must maintain logical expressivity
3. **Limit/Colimit Preservation**: Must preserve at least one of these structural operations
4. **Adjoint Existence**: Should ideally have left or right adjoints for computational regularity
5. **Path Invariance**: Results should be independent of evaluation paths

## Integration with topOS

This framework integrates with the broader topOS system to provide formal guarantees about transformation behavior between computational worlds, enabling safe composition of world transformations.