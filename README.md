
## ℹ️️ Description

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

## 🔧 How to Install

Use the Angular CLI's install schematic to set up your project by running the following command:

```
ng add core-schematic
```

The ng add command will additionally perform the following configurations:

 - Add project dependencies to package.json and install

## 👨🏻‍🏫 How to Use

Use the Angular CLI's generate component and set in project by running the following command:

```
ng generate core-schematic:module ModuleName
```
 
or use shorted command:

```
ng g core-schematic:m ModuleName
```

The ng g command will generate element in Angular project



## ⚒ Develop

Use NPM command for re-run automatically whenever a change is made.

```
npm run build:watch
```

[8:57:54] File change detected. Starting incremental compilation...
[8:57:54] Found 0 errors. Watching for file changes.

### Importantly 

When compilation contains some errors building will not be completed and all changes will not working. You must fix all of errors and continue developing
