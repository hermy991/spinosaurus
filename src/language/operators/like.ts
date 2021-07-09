export function like(column: string, pattern: string) {
  return `${column} LIKE '${pattern}'`;
}

export function notLike(column: string, pattern: string) {
  return `${column} NOT LIKE '${pattern}'`;
}

export function andLike(column: string, pattern: string) {
  return `AND ${like(column, pattern)}`;
}

export function orLike(column: string, pattern: string) {
  return `OR ${like(column, pattern)}`;
}

export function andNotLike(column: string, pattern: string) {
  return `AND ${notLike(column, pattern)}`;
}

export function orNotLike(column: string, pattern: string) {
  return `OR ${notLike(column, pattern)}`;
}
