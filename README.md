# Repro for issue 7775

## Versions

firebase-tools: v13.20.2<br>
node: v18.20.4<br>
npm ls:

```
├── firebase-admin@11.11.1
├── firebase-functions@4.3.1
└── googleapis@144.0.0
```

## Steps to reproduce

1. Populate `functions/credentials.json`
2. Run `cd functions/ && npm i`
3. Run `cd ../`
4. Run `firebase emulators:start --only functions --project PROJECT_ID`
