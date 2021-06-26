#Run
```bash
deno run --unstable --import-map=importmap.json --config=tsconfig.json --allow-net --allow-read --allow-env=SPINOSAURUS_TEST_CON_HOST,SPINOSAURUS_TEST_CON_PORT,SPINOSAURUS_TEST_CON_USERNAME,SPINOSAURUS_TEST_CON_PASSWORD all_test.ts
```
#Test
```bash
deno test --unstable --import-map=importmap.json --config=tsconfig.json --allow-net --allow-read --allow-env=SPINOSAURUS_TEST_CON_HOST,SPINOSAURUS_TEST_CON_PORT,SPINOSAURUS_TEST_CON_USERNAME,SPINOSAURUS_TEST_CON_PASSWORD all_test.ts
```