export class BaseBuilding {
  
  get left(){  return this.conf.delimiters[0];  }
  get right(){  return this.conf.delimiters[0];  }

  get delimiters(){  return this.conf.delimiters as string[]; }

  constructor(public conf : { delimiters: [string, string?]}){  
    if(conf.delimiters.length == 1){
      conf.delimiters.push(conf.delimiters[0]);
    }
  }
}