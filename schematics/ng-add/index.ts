import {
  Rule, Tree/*, SchematicContext*/
} from '@angular-devkit/schematics';
import { addModuleImportToRootModule, getProjectFromWorkspace } from 'schematics-utilities';
import { getWorkspace } from '@schematics/angular/utility/config';

export function ngAdd(options: any): Rule {
  return (host: Tree/*, context: SchematicContext*/) => {
      // get the workspace config of the consuming project
      // i.e. angular.json file
      const workspace = getWorkspace(host);

      // identify the project config which is using our library
      // or default to the default project in consumer workspace
      const project = getProjectFromWorkspace(
        workspace,
        options.project || workspace.defaultProject
      );
      // inject our module into the current main module of the selected project
      addModuleImportToRootModule(
        // tree to modify
        host,
        // Module name to insert
        'AngularCoreModule',
        // project name for import statement
        '@next-adv/angular-core',
        // project to be modified
        project
      );

      // return updated tree
      return host;
  };
}
