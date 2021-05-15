import {stringify} from "../tools/sql.ts"

export function between(column: string, value1: string | number | Date, value2: string | number | Date) {
    let f1 = stringify(value1);
    let f2 = stringify(value2);
    return `${column} BETWEEN ${f1} AND ${f2}`;
}