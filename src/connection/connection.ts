
import {ConnectionPostgres} from './postgres/connection_postgres.ts';
import {ConnectionPostgresOptions} from './postgres/connection_postgres_options.ts';
class Connection {
  private defIndex: number;
  public connectionDefinitions: Array<ConnectionPostgres>;

  public constructor(conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>, def: number | string = 0 ) {

    this.connectionDefinitions = [];
    if(conn instanceof ConnectionPostgresOptions){
      if(Array.isArray(conn)){
        this.connectionDefinitions = conn as Array<ConnectionPostgres>;
      }
      else if(typeof conn == "object"){
        this.connectionDefinitions = [conn as ConnectionPostgres];
      }
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

  public getQuery() {
    const defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    return defConnectionDefinition.getQuery();
  }

  public getRaw() {
    const defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    return defConnectionDefinition.getRow();
  }

  public select() {
    const defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    defConnectionDefinition.select();
    return this;
  }

  public addSelect(column: Array<string> | string, as?: string) {
    const defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    defConnectionDefinition.addSelect(column);
    return this;
  }

  public from(entity: string, as: string, ons: Array<string> | string) {
    const defConnectionDefinition = this.connectionDefinitions[this.defIndex];
    defConnectionDefinition.from(entity, as, ons);
    return this;
  }

}

export {Connection}