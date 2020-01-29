# AngularCore

A set of common libraries used in angular and ionic/angular projects.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Usage of this library in development

### Setup

1. Clone the library in your workspace, **NOT inside your main project!**
2. In the library folder run `npm i`, then `ng build`
3. In the library *'/dist/PACKAGE_NAME'* folder run `npm link` 
4. In your main project root folder run `npm link PACKAGE_NAME`
5. In your main project *angular.json* set *projects.app.architect.build.options.preserveSymlinks=true*
Now the main project will be sym-linked to the library

### Run

1. In the library folder run `ng build --watch`
2. In your main project root folder run `ng serve` or `ionic serve`, depending on which framework you are using
When you make some change in the library, the main project will naturally reaload itself!

If your developments in the library are terminated and **you want to publish them to NPM**

1. Version your software by using `npm version patch|minor|major`. This will create a *tag* in your git repo.
2. Run `npm publish`.
If you miss this, production software won't get the updated library!

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
