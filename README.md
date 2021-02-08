
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

Install all dependencies:

```
npm i
```

Use NPM command for re-run automatically whenever a change is made:

```
npm run build:watch
```
or use:
```
npm run build
```
for generation build

It is correct working status for  re-run automatically:

> [8:57:54] File change detected. Starting incremental compilation... <br>
> [8:57:54] Found 0 errors. Watching for file changes.

#### Importantly 

When compilation contains some errors building will not be completed and all changes will not working. You must fix all of errors and continue developing


## How to install 

###  Locally in Angular project

1. Use NPM command for generating .tgz file:
```
npm pack
```

Correct output:

```
npm notice === Tarball Details === 
npm notice name:          core-schematic                          
npm notice version:       1.0.0                                   
npm notice filename:      core-schematic-1.0.0.tgz                
npm notice package size:  22.9 kB                                 
npm notice unpacked size: 95.4 kB                                 
npm notice shasum:        0ac341b4fa036fd413853b5341f0dfb9b26ad117
npm notice integrity:     sha512-9T27jjTS9xiut[...]i02KJ1Dkkgzzw==
npm notice total files:   117                                     
npm notice 
core-schematic-1.0.0.tgz
```

2. Copy path to file or insert .tgz file to Angular project.
3. Add dependency to package.json file

```
 ...
 "dependencies": {
     ...
     "core-schematic": "file:/path/to/file/core-schematic-1.0.0.tgz", (e.g. file:/Users/user/Projects/schematics/core-schematic-1.0.0.tgz)
     ...
 }
 ...

```
3. Install dependencies again to install lib from local file.
4. Use lib through ng cli.





