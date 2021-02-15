## 👨🏻‍🏫 How to Use

```
ng g core-schematic:site-variables
or
ng g core-schematic:var
```

| Param           | Value                                   | Description                                     |
| --------------- | --------------------------------------- | ----------------------------------------------- |
| variables       | [object](/src/site-variables/schema.ts) | add new variable to app.module.ts if not exist  |
| module          | app.module.ts                           | path to app.module.ts                           |
| insertInterface | true                                    | lib wil generate model and add it to model/ dir |

### First you will need to pass a questionnaire to generate an object (variables)
