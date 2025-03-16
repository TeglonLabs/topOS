/**
 * topos-categories.ts
 * 
 * Defines core category-theoretical concepts used in topOS
 */

/**
 * Represents a category with objects and morphisms
 */
export interface Category {
  objects: string[];
  morphisms: Array<{
    source: string;
    target: string;
    id: string;
  }>;
  composition: Array<{
    f: string;
    g: string;
    result: string;
  }>;
}

/**
 * Represents a functor between categories
 */
export interface Functor {
  sourceCategory: Category;
  targetCategory: Category;
  objectMap: Record<string, string>;
  morphismMap: Record<string, string>;
}

/**
 * Represents a natural transformation between functors
 */
export interface NaturalTransformation {
  sourceFunctor: Functor;
  targetFunctor: Functor;
  components: Record<string, string>;
}

/**
 * Represents a site (a category with a Grothendieck topology)
 */
export interface Site {
  category: Category;
  coveringFamilies: Record<string, string[][]>;
}

/**
 * Represents a presheaf on a category
 */
export interface Presheaf {
  domain: Category;
  values: Record<string, any>;
  restrictions: Record<string, Record<string, (val: any) => any>>;
}

/**
 * Represents a sheaf on a site
 */
export interface Sheaf extends Presheaf {
  site: Site;
  gluing: (sections: any[], morphisms: any[]) => any;
}

/**
 * Represents an elementary topos (category with finite limits, power objects, etc.)
 */
export interface ElementaryTopos extends Category {
  terminal: string;
  initialObject: string;
  subobjectClassifier: {
    object: string;
    true: string;  // The morphism 1 -> Ω
    classify: (mono: any) => any;
  };
  exponentials: Record<string, Record<string, string>>;
  products: (a: string, b: string) => string;
  equalizers: (f: string, g: string) => string;
  powerObjects: Record<string, string>;
}

/**
 * Creates a category from objects and morphisms
 */
export function createCategory(
  objects: string[],
  morphisms: Array<{
    source: string;
    target: string;
    id: string;
  }>
): Category {
  // Create identity morphisms if they don't exist
  const hasIdentities = new Set(morphisms.map(m => m.id));
  const identities = objects.map(obj => {
    const id = `id_${obj}`;
    return hasIdentities.has(id) ? null : { source: obj, target: obj, id };
  }).filter(Boolean);

  const allMorphisms = [...morphisms, ...identities];

  // Generate compositions
  const composition = [];
  for (const f of allMorphisms) {
    for (const g of allMorphisms) {
      if (f.target === g.source) {
        composition.push({
          f: f.id,
          g: g.id,
          result: morphisms.find(m => 
            m.source === f.source && m.target === g.target
          )?.id || `${f.source}_to_${g.target}`
        });
      }
    }
  }

  return {
    objects,
    morphisms: allMorphisms,
    composition
  };
}

/**
 * Creates a functor between categories
 */
export function createFunctor(
  sourceCategory: Category,
  targetCategory: Category,
  objectMap: Record<string, string>,
  morphismMap?: Record<string, string>
): Functor {
  const computedMorphismMap: Record<string, string> = {};
  
  // If morphism map is not provided, compute it
  if (!morphismMap) {
    for (const m of sourceCategory.morphisms) {
      const sourceObj = objectMap[m.source];
      const targetObj = objectMap[m.target];
      
      // Find morphism in target category
      const targetMorphism = targetCategory.morphisms.find(
        tm => tm.source === sourceObj && tm.target === targetObj
      );
      
      if (targetMorphism) {
        computedMorphismMap[m.id] = targetMorphism.id;
      } else {
        // If we can't find a direct match, create a placeholder
        computedMorphismMap[m.id] = `${sourceObj}_to_${targetObj}`;
      }
    }
  }
  
  return {
    sourceCategory,
    targetCategory,
    objectMap,
    morphismMap: morphismMap || computedMorphismMap
  };
}

export function createNaturalTransformation(
  sourceFunctor: Functor,
  targetFunctor: Functor,
  components: Record<string, string>
): NaturalTransformation {
  return {
    sourceFunctor,
    targetFunctor,
    components
  };
}