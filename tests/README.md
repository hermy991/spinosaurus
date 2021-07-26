#Run

```bash
deno run --unstable --import-map=importmap.json --config=tsconfig.json --allow-net --allow-read --allow-env=SPINOSAURUS_TEST_CONN_HOST,SPINOSAURUS_TEST_CONN_PORT,SPINOSAURUS_TEST_CONN_USERNAME,SPINOSAURUS_TEST_CONN_PASSWORD all_test.ts
```

#Test

```bash
deno test --unstable --import-map=importmap.json --config=tsconfig.json --allow-net --allow-read --allow-env=SPINOSAURUS_TEST_CONN_HOST,SPINOSAURUS_TEST_CONN_PORT,SPINOSAURUS_TEST_CONN_USERNAME,SPINOSAURUS_TEST_CONN_PASSWORD all_test.ts
```
