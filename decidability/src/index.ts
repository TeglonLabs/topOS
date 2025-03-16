/**
 * topOS - A category-theoretic operating system for topoi and sheaves
 * 
 * Main entry point that exports all modules
 */

// Export core modules
export * from './topos-categories';
export * from './topos-classifier';

// Export decidability framework
export * from './decidability';

// Export version information
export const VERSION = '0.1.0';

/**
 * Initialize the topOS system with default configuration
 */
export function initialize() {
  return {
    version: VERSION,
    start: () => console.log('topOS initialized with version', VERSION),
    computation: function<T>(handler: (continuation: { resume: (value: T) => void }) => void) {
      return {
        runToResult: (): T => {
          let result: T;
          handler({
            resume: (value: T) => {
              result = value;
            }
          });
          return result!;
        }
      };
    },
    workflow: function() {
      const steps: Function[] = [];
      const api = {
        step: function(fn: Function) {
          steps.push(fn);
          return api;
        },
        finalize: function(fn: Function) {
          steps.push(fn);
          return {
            run: function(input: any) {
              return steps.reduce((acc, step) => step(acc), input);
            }
          };
        }
      };
      return api;
    }
  };
}