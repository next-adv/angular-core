# AngularCore

A set of common libraries used in angular and ionic/angular projects.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

# Usage of this library in developmentng build
1. Clone the library in your workspace, NOT inside your main project!
2. In the library folder run `npm link` inside the '/dist/PACKAGE_NAME' folder
3. In your main project root folder run `npm link PACKAGE_NAME`
4. In the library folder run `ng build --watch`
5. In your main project root folder run `ng serve` or `ionic serve`

Now the main project will be sym-linked to the library, and when you make some change inn the library, the main project will naturally reaload itself!

When your developing in the library is terminated and you want to publish to _npm_, do `npm publish`.
If you miss this, production software won't get the updated library!

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
