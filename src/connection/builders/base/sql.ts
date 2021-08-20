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
  } else if (typeof (value) == "object" && value instanceof Date) {
    return `TO_DATE('${value.getFullYear()}-${
      ((value.getMonth() + 1) + "").padStart(2, "0")
    }-${(value.getDate() + "").padStart(2, "0")}', 'YYYY-MM-DD')`;
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
  params?: { [x: string]: string | number | Date },
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
          const reg = new RegExp(`(^|(?<=[\\s])):${key}((?=[\\s])|$)`, "ig");
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
