
class SelectOperations {
  public static getQuery(... columns: Array<string|Array<string>>){
    if(!columns.length){
      return ` SELECT * `;
    }
    let query = "";
    for(let i = 0; i < columns.length; i++){
      const tempColumn = columns[i];
      if(Array.isArray(tempColumn) && tempColumn.length == 2){
        query += `${tempColumn[0]} AS ${tempColumn[1]}`;
      }
      if(Array.isArray(tempColumn) && tempColumn.length == 1){
        query += `${tempColumn[0]}`;
      }
      if(typeof tempColumn === "string"){
        query += `${tempColumn}`;
      }
      if(i + 1 !== columns.length){
        query = ",\n"
      }
    }
    return `SELECT ${query} `;
  }
}

export {SelectOperations}