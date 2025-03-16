import {
  isTransformationDecidable,
  WorldTransformation,
  exampleDecidableTransformation,
  exampleNonDecidableTransformation
} from './index';

describe('Decidability Framework', () => {
  describe('isTransformationDecidable', () => {
    it('should correctly identify decidable transformations', () => {
      const result = isTransformationDecidable(exampleDecidableTransformation);
      expect(result.isDecidable).toBe(true);
    });

    it('should correctly identify non-decidable transformations', () => {
      const result = isTransformationDecidable(exampleNonDecidableTransformation);
      expect(result.isDecidable).toBe(false);
    });

    it('should require structure preservation for decidability', () => {
      const nonStructurePreservingTransformation: WorldTransformation = {
        ...exampleDecidableTransformation,
        functorType: 'partial'
      };
      const result = isTransformationDecidable(nonStructurePreservingTransformation);
      expect(result.isDecidable).toBe(false);
      expect(result.reason).toContain('not structure-preserving');
    });

    it('should require subobject classifier preservation for decidability', () => {
      const nonSubobjectPreservingTransformation: WorldTransformation = {
        ...exampleDecidableTransformation,
        subobjectPreserving: false
      };
      const result = isTransformationDecidable(nonSubobjectPreservingTransformation);
      expect(result.isDecidable).toBe(false);
      expect(result.reason).toContain('subobject classifiers');
    });

    it('should require either limit or colimit preservation for decidability', () => {
      const noLimitsOrColimitsTransformation: WorldTransformation = {
        ...exampleDecidableTransformation,
        preservesLimits: false,
        preservesColimits: false
      };
      const result = isTransformationDecidable(noLimitsOrColimitsTransformation);
      expect(result.isDecidable).toBe(false);
      expect(result.reason).toContain('neither limits nor colimits');
    });

    it('should include adjoint information in the explanation when available', () => {
      const bothAdjointsTransformation: WorldTransformation = {
        ...exampleDecidableTransformation,
        hasLeftAdjoint: true,
        hasRightAdjoint: true
      };
      const result = isTransformationDecidable(bothAdjointsTransformation);
      expect(result.isDecidable).toBe(true);
      expect(result.reason).toContain('a left and a right adjoint');
    });
  });
});