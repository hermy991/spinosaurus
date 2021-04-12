
import {ConnectionPostgres} from './connection_postgres.ts';
class Connection {
  private defIndex: number;
  public connectionDefinitions: Array<ConnectionPostgres>;

  public constructor(conn?: ConnectionPostgres | Array<ConnectionPostgres>, def: number | string = 0 ) {

    this.connectionDefinitions = [];
    if(Array.isArray(conn)){
      this.connectionDefinitions = conn;
    }
    else if(typeof conn == "object"){
      this.connectionDefinitions = [conn];
    }

    this.defIndex = 0;
    if(typeof def == "number" ){
      this.defIndex = def;
    }
    else if (typeof def === "string"){
      this.defIndex = 0;
      for(let i = 0; i < this.connectionDefinitions.length; i++){
        if(this.connectionDefinitions[i].name === def){
          this.defIndex = i;
          break;
        }
      }
    }
  }

  public getRaw() {
    let defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    return defConnectionDefinition.getRow();
  }

}

export {Connection}