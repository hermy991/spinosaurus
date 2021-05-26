export function stringify(value: string | number| boolean | Date | null): string {
  if(value === null)
    return 'NULL';
  else if(typeof(value) == "boolean")
    return `'${value ? 1 : 0}'`;
  else if(typeof(value) == "number")
    return `${value}`;
  else if(typeof(value) == "string")
    return `'${(value ? value.replace(/'/ig, "''") : "")}'`;
  else if(typeof(value) == "object" && new Date() instanceof Date)
    return `TO_DATE('${value.getFullYear()}-${((value.getMonth() + 1) + "").padStart(2, "0")}-${(value.getDate() + "").padStart(2, "0")}', 'YYYY-MM-DD')`;
  return `NULL`;
}

export function interpolate(conditions: Array<string>, params?: { [x:string]: string | number | Date }): Array<string> {
  let data = [];
  for(let i = 0; i<conditions.length; i++){
    let condition = conditions[i];
    let chunks = [];
    for(let y = 0; y<condition.split(`"`).length; y++){
      let chunk = condition.split(`"`)[y];
      if(y%2 == 0){
        for(let x = 0; x<Object.keys(params || {}).length; x++){
          let key = Object.keys(params || {})[x];
          let reg = new RegExp(`(^|(?<=[\\s])):${key}((?=[\\s])|$)`, "ig");
          let value = params ? params[key] : "";
          value = stringify(value);
          chunk = chunk.replace(reg, value);
        }
      }
      chunks.push(chunk);
    }
    data.push(chunks.join(`"`));
  }
  return data;
}

export function clearNames(req: {left: string, identifiers: Array<string | undefined> | string, right: string}){
  let {left, identifiers, right} = req;
  identifiers = typeof identifiers == "string" ? [identifiers] : identifiers;
  let tempIdentifiers: string[] = []
  identifiers.filter(x => x).forEach(x => tempIdentifiers.push(`${left}${(x || "").replace(new RegExp(`[\\${left}\\${right}]`, 'ig'), ``)}${right}`));
  return tempIdentifiers.join(".");
}