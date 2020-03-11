# Angular-Core Node Library

A set of common codes used in angular and ionic/angular projects.

## APIs

It exposes:

1. **NavService**: to store data while navigating between two pages
2. **UIHelperService**: helper to manage loaders and toasts
3. **AuthWordpressService**: service to manage authentication with Wordpress
4. **AuthPlainService**: service to manage internal authentication with back-end

It supplies also an _interceptor_ that applies common http headers `locale` and `authorization`

## How to develop this library

### Setup

1. Clone the library workpace [**ng-node-library**](https://github.com/next-adv/ng-node-libraries.git) in your working dir, **NOT inside your main project!**; This repo contains _angular-core_ and _ionic-core_ repos
2. In the library workspace root folder run `npm i`, then `npm run build:ang-lib` to create the _dist_ folder
3. In the library */dist/PACKAGE_NAME* run `npm link`. **This will create a symlink to the global node folder**
4. In your main project root folder run `ng add @next-adv/angular-core`. This will:
    1. Create an entry in the _package.json_
    2. Guide you through the library installation with the wizard
    3. Copy the library inside your _node_modules_, **which is not what we want (node modules are read-only)**
5. **Delete the library from node_modules folder**
6. In your main project root folder run `npm link @next-adv/angular-core`. This will create a symlink inside the *node_modules* folder to the global node folder, that points to the library repo _/dist_ folder (p.2)
7. In your main project *angular.json* set *projects.app.architect.build.options.preserveSymlinks=true*

Now the main project will be sym-linked to the library

### Run and develop

1. In the library root folder run `npm run build-watch:ang-lib`. This command will re-build each time you save a modification to the project.
2. In your main project root folder run `ng serve` or `ionic serve`, depending on which framework you are using

When you make some change in the library, the main project will naturally reaload itself!

### Publishing to NPM Registry

If your developments to the library are terminated and **you want to publish them to NPM registry**

1. Commit your code and version your software using `npm run version:ang-lib patch|minor|major`. This will create a *tagged commit* in your git repo
2. Optional: push as usual **with tags**(`git push && git push --tags`)
3. Run `npm run build-publish:ang-lib` to generate a new compiled package and publish it to the npm registry

P.S. **If you published the wrong package**, run `npm unpublish <@company/package>`

## Using the library

### Inject the library inside your main app

If you **don't want to develop the library**, just using it inside your project

1. Run `ng add @next-adv/angular-core` inside your main project
2. Follow the installation wizard

### Module configuration

This module has an high level of customizability through the *setConfig()* static method.
All settings are configurable through the installation wizard too.

* **auth**: it contains a map to determine what kind of object the *login* API expects
* **restApi**: it contains a map to determine REST-API endpoints
* **locale**: locale header (it, en etc)

For any further infos please consult the **ICoreConfig** interface

## Schematics

In order to develop schematics:

1. Develop inside the _schematics_ folder
2. Version using `npm run version:ang-lib patch|minor|major`
3. Run `npm run build:ang-schem` in order to build the schematic inside the _dist/angolar-core/_ folder
4. Run `npm run publish:ang-lib`
5. In your main project folder, run `ng add @next-adv/angular-core`

If you want to do all of this in only 2 commands:

1. Version using `npm run version:ang-lib patch|minor|major`
2. Run `npm run build-publish:ang-pkg`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
