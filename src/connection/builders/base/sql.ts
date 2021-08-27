export function stringify(
  value: string | number | boolean | Date | Function | null | undefined,
): string {
  if (value === undefined) {
    return "NULL";
  } else if (value === null) {
    return "NULL";
  } else if (typeof (value) == "boolean") {
    return `'${value ? 1 : 0}'`;
  } else if (typeof (value) == "number") {
    return `${value}`;
  } else if (typeof (value) == "string") {
    return `'${(value ? value.replace(/'/ig, "''") : "")}'`;
    // } else if (typeof (value) == "object" && value instanceof Date) {
    //   const yyyy = value.getFullYear();
    //   const mm = ((value.getMonth() + 1) + "").padStart(2, "0");
    //   const dd = (value.getDate() + "").padStart(2, "0");
    //   const hh24 = (value.getHours() + "").padStart(2, "0");
    //   const mi = (value.getMinutes() + "").padStart(2, "0");
    //   const ss = (value.getSeconds() + "").padStart(2, "0");
    //   return `TO_TIMESTAMP('${yyyy}-${mm}-${dd} ${hh24}:${mi}:${ss}', 'YYYY-MM-DD HH24:MI:SS')`;
  } else if (typeof (value) == "function" && value instanceof Function) {
    let str = value();
    for (const char of [`"`, `'`]) {
      str = str.split(char).map((x: string, i: number) =>
        (x && i % 2 === 0) ? x.replaceAll(`;`, ``) : x
      ).join(char);
    }
    return str;
  }
  return `NULL`;
}

export function interpolate(
  conditions: [string, ...string[]],
  params?: { [x: string]: string },
): Array<string> {
  const data = [];
  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const chunks = [];
    for (let y = 0; y < condition.split(`"`).length; y++) {
      let chunk = condition.split(`"`)[y];
      if (y % 2 == 0) {
        for (let x = 0; x < Object.keys(params || {}).length; x++) {
          const key = Object.keys(params || {})[x];
          if (key.indexOf(";") >= 0) continue;
          const reg = new RegExp(`(^|(?<=[\\s])):${key}((?=[\\s])|$)`, "ig");
          const value = params ? params[key] : "";
          chunk = chunk.replace(reg, value);
        }
      }
      chunks.push(chunk);
    }
    data.push(chunks.join(`"`));
  }
  return data;
}

export function clearNames(
  req: {
    left: string;
    identifiers?: Array<string | undefined> | string | undefined;
    right: string;
  },
) {
  let { left, identifiers, right } = req;
  identifiers = Array.isArray(identifiers) ? identifiers : [identifiers];
  const tempIdentifiers: string[] = [];
  identifiers.filter((x) => x).forEach((x) =>
    tempIdentifiers.push(
      `${left}${
        (x || "").replace(new RegExp(`[\\${left}\\${right}]`, "ig"), ``)
      }${right}`,
    )
  );
  return tempIdentifiers.join(".");
}
