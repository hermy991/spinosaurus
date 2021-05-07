export function between(column: string, value1: string|number|Date, value2: string|number|Date) {
    let f1:string|number = "NULL";
    let f2:string|number = "NULL";
    if(typeof(value1) == "number"){
        f1 = value1;
    }
    if(typeof(value1) == "string"){
        f1 = `'${value1}'`;
    }
    if(typeof(value1) == "object" && new Date() instanceof Date){
        f1 = `TO_DATE('${value1.getFullYear()}-${((value1.getMonth() + 1) + "").padStart(2, "0")}-${(value1.getDate() + "").padStart(2, "0")}', 'YYYY-MM-DD')`;
    }
    if(typeof(value2) == "number"){
        f2 = value2;
    }
    if(typeof(value2) == "string"){
        f2 = `'${value2}'`;
    }
    if(typeof(value2) == "object" && value2 instanceof Date){
        f2 = `TO_DATE('${value2.getFullYear()}-${((value2.getMonth() + 1) + "").padStart(2, "0")}-${(value2.getDate() + "").padStart(2, "0")}', 'YYYY-MM-DD')`;
    }
    return `${column} BETWEEN ${f1} AND ${f2}`;
}