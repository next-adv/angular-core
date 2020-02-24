# AngularCore

A set of common libraries used in angular and ionic/angular projects.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Usage of this library in development

### Setup

1. Clone the library in your workspace, **NOT inside your main project!**
2. In the library root folder run `npm i`, then `ng build COMPANY/PACKAGE_NAME` (e.g. '@next-adv/package')
3. In the library */dist/company/PACKAGE_NAME* run `npm link`. This will create a scoped package (e.g. '@next-adv/package')
4. In your main project root folder run `npm link COMPANY/PACKAGE_NAME`
5. In your main project *angular.json* set *projects.app.architect.build.options.preserveSymlinks=true*
Now the main project will be sym-linked to the library

### Run

1. In the library root folder run `ng build  COMPANY/PACKAGE_NAME --watch`, or in the project folder `ng build --watch`
2. In your main project root folder run `ng serve` or `ionic serve`, depending on which framework you are using
When you make some change in the library, the main project will naturally reaload itself!

### Module configuration

This module has an high level of customizability through the *forRoot* static method:

* **auth**: it contains a map to determine what kind of object the *login* API expects
* **restApi**: it contains a map to determine REST-API endpoints
* **locale**: locale header (it, en etc)

For any further infos please consult the **ICoreConfig** interface

## Usage of this library in production

If your developments in the library are terminated and **you want to publish them to NPM**

1. In your */projects/@company/package* folder, commit your code and version your software using `npm version patch|minor|major`. This will create a *tagged commit* in your git repo
2. Push as usual (`git push && git push --tags`)
3. Run `npm run build-publish` to generate a new compiled package in the */dist* folder and publish it to the registry
4. In the main app folder run install and build task as usual
5. Enjoy

P.S. **If you published the wrong package**, run `npm unpublish <@company/package>`

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
