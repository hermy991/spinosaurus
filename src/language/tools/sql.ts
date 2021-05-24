export function stringify(value: string | number | Date): string {
  let sql: string = "NULL";
  if(typeof(value) == "number"){
    sql = `${value}`;
  }
  if(typeof(value) == "string"){
    sql = `'${(value ? value.replace(/'/ig, "''") : "")}'`;
  }
  if(typeof(value) == "object" && new Date() instanceof Date){
    sql = `TO_DATE('${value.getFullYear()}-${((value.getMonth() + 1) + "").padStart(2, "0")}-${(value.getDate() + "").padStart(2, "0")}', 'YYYY-MM-DD')`;
  }
  return sql;
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

export function clearNames(req: {left: string, identifiers: Array<string> | string, right: string}){
  let {left, identifiers, right} = req;
  identifiers = typeof identifiers == "string" ? [identifiers] : identifiers;
  identifiers.forEach(identifier => (identifier).replace(new RegExp(`[\\${left}\\${right}]`, 'ig'), ``));
  return identifiers.join(".");
}