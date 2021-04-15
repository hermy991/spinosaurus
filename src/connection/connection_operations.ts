function filterConnectionProps(keyConf: any, values: any){
/**
 *  { keyFrom1: "keyTo1", keyFrom2: "keyTo2", ...}
 *  return { keyTo1: "value1", keyTo2: "value2", ... }
 */
  const currValue: {[x:string]: string | number} = {};
  Object.keys(keyConf).forEach(key => values[key] ? currValue[keyConf[key]] = values[key]: "" );
  return currValue;
}

export {filterConnectionProps};