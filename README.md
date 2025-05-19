# Wordle

A clone of the popular game Wordle where you try to guess a 5 letter word in 6 tries.

## Some of the tools used in our project and how did we installed them

### NextJS

To create a NextJS project

```
npx create-next-app@latest
```

### ESLint and Prettier

NextJS comes with a defined set of rules but we installed some extra rules like the Airbnb style for best practices, we do that by running this command:

1. Install ESLint manually with Airbnb, Next, and Prettier

   ```
   npm install --save-dev
   eslint
   eslint-config-airbnb
   eslint-config-next
   eslint-plugin-import
   eslint-plugin-react
   eslint-plugin-react-hooks
   eslint-plugin-jsx-a11y
   prettier
   eslint-config-prettier
   eslint-plugin-prettier
   typescript
   ```

2. Create the .eslintrc.json file

   ```
   {
   "extends": [
       "airbnb",
       "next/core-web-vitals",
       "plugin:prettier/recommended"
   ],
   "rules": {
       "react/jsx-filename-extension": [
       1,
       { "extensions": [".js", ".jsx", ".ts", ".tsx"] }
       ],
       "camelcase": ["error", { "allow": ["Geist_Mono"] }],
       "no-underscore-dangle": ["error", { "allow": ["__dirname", "__filename"] }],
       "import/no-extraneous-dependencies": "off"
       }
   }
   ```

3. Add .prettierrc for consistent formatting
   `    {
"singleQuote": true,
"semi": true,
"trailingComma": "all"
}`
   you can use these commands

`npm run lint:all`
to check the style in all files.

`npm run lint:fix`
to automatically fix some of the problems.

`npm run format`
this will use Prettier to format the code.

`npm run format:check`
this will use Prettier to see if there is any file that's missing the correct format.

## Lighthouse

This tool is integrated within the Chrome Browser via web tools.

## SonarQube

1. Install SonarScanner

   ```
   npm install --save-dev sonarqube-scanner
   ```

2. Create sonar-project.properties at the root of your project

   ```
   # sonar-project.properties

   sonar.projectKey=wordle
   sonar.projectName=Wordle Game
   sonar.projectVersion=1.0

   # Where your source code lives
   sonar.sources=src

   # Exclude build and config folders
   sonar.exclusions=node_modules/**,.next/**,public/**

   # Encoding and server URL
   sonar.sourceEncoding=UTF-8
   sonar.host.url=http://localhost:9000
   ```

3. Create a script in package.json

   ```
   "scripts": {
       "sonar": "sonar-scanner"
   }
   ```

4. Run the scanner

   Use your SonarQube token like this:

   SONAR_TOKEN=your_token_here npm run sonar

## Vitest

1. Install the module

   ```
   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
   ```

2. Crate a vitest.config.js in the root directory

   ```
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
   plugins: [react()],
   test: {
       environment: 'jsdom',
   },
   })
   ```

3. Run the command

   ```
   npm run test
   ```

4. To check for coverage install v8

   ```
   npm install --save-dev @vitest/coverage-v8 --legacy-peer-deps
   ```

5. Then run

   ```
   npm run test:coverage
   ```
