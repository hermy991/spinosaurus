function filterConnectionProps(keyConf: any, values: any, changes?: any) {
  /**
 *  { keyFrom1: "keyTo1", keyFrom2: "keyTo2", ...}
 *  return { keyTo1: "value1", keyTo2: "value2", ... }
 */
  const currValue: { [x: string]: string | number | boolean | any } = {};
  Object.keys(keyConf).forEach((key) =>
    values[key] ? currValue[keyConf[key]] = values[key] : ""
  );
  if (!changes) {
    return currValue;
  }
  for (let key in currValue) {
    if (key in changes && changes[key]) {
      currValue[key] = changes[key];
    }
  }
  return currValue;
}

export { filterConnectionProps };
