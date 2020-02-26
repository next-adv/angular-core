import {
  Rule, Tree/*, SchematicContext*/
} from '@angular-devkit/schematics';
import { addModuleImportToRootModule, getProjectFromWorkspace, getAppModulePath } from 'schematics-utilities';
import { getWorkspace } from '@schematics/angular/utility/config';
import { addModuleImportToModule } from '@schematics/angular';

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
      const targets = project.targets || project.architect;
      const modulePath = getAppModulePath(host, targets.build.options.main);
      addModuleImportToModule(host, modulePath, 'AngularCoreModule', '@next-adv/angular-core');
      // return updated tree
      return host;
  };
}
