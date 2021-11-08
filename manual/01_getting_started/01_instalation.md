# Instalation

1. Import source code
   - Via import from on a file:
     ```typescript
     import { Connection } from "https://deno.land/x/spinosaurus/mod.ts"
     const connOpts = {
         name: "myconn1",
         type: "postgres",
         host: "localhost",
         port: 5432,
         database: "db"
         user: "myuser",
         password: "????????"
     }
     const conn = new Connection(connOpts);
     const users = await conn.from("users").getMany();
     ```

   - Via import file from deno option `deno run --import-file=importfile.json`

     importfile.json

     ```json
     {
       "imports": {
         "spinosaurus/": "https://deno.land/spinosaurus/"
       }
     }
     ```

     TypeScript file

     ```typescript
     import { Connection } from "spinosaurus/mod.ts"
     const connOpts = {
         name: "myconn1",
         type: "postgres",
         host: "localhost",
         port: 5432,
         database: "db"
         user: "myuser",
         password: "????????"
     }
     const conn = new Connection(connOpts);
     const users = await conn.from("users").getMany();
     ```

2. TypeScript configuration

   Make sure you are enabled the following settings in `config.json` via
   `deno run --config=config.json`:

   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```
