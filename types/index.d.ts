export as namespace CSSMatrix;
export default CSSMatrix;

export { PointTuple, JSONMatrix } from './more/types';

import { default as CSSMatrix } from 'dommatrix/src/dommatrix';

// create an alias for ESM module
declare module "dommatrix/dist/dommatrix.esm" {
  export {default as CSSMatrix} from 'dommatrix/src/dommatrix';
}
