import { Rule, Tree } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from 'schematics-utilities';
import { getWorkspace } from '@schematics/angular/utility/config';

import ISchema, { IEnv } from './schema.interface';


function generateEnvironmentValues(host: Tree, options: ISchema) {
  const content: Buffer | null = host.read('/environments/environment.ts');
  const envDummy: IEnv = {
    locale: options.locale,
    authIdField: options.authIdField,
    authPwdField: options.authPwdField,
    devServerUrl: options.devServerUrl,
  };

  if (content) {
    const strContent = content.toString();
    const updatedContent = strContent.replace(
      /(export const environment = {\n\s*production:\s*false)/,
      '$1,\n' + JSON.stringify(envDummy) + '\n'
      );
    host.overwrite('/environments/environment.ts', updatedContent);
  }
}

function addModuleImport(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('@NgModule({');
    const content2Append = `
    //@next-adv/angular-core auto-generated code
    import { environment } from '../environments/environment';
    import { AngularCoreModule } from '@next-adv/angular-core';
    //@next-adv/angular-core auto-generated code end\n`;
    const updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);
    host.overwrite(path + '/app.module.ts', updatedContent);
  }
}

function addModuleEntry(host: Tree, path: string): void {
  // inject our module into the current main module of the selected project
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('imports: [') + ('imports: [').length;
    const content2Append = `
    //@next-adv/angular-core auto-generated code
    AngularCoreModule.setConfig(
        {
          auth: {
            idField: environment.authIdField,
            pwdField: environment.authPwdField,
          },
          restApi: {
            restEndpoint: environment.devServerUrl,
          },
          locale: environment.locale
        }
    ),
    //@next-adv/angular-core auto-generated code end
    \n`;
    const updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);
    host.overwrite(path + '/app.module.ts', updatedContent);
  }
}

export function ngAdd(options: ISchema): Rule {
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
    const projectType = project.projectType === 'application' ? 'app' : 'lib';
    const path = (options.path === undefined) ? `${project.sourceRoot}/${projectType}` : options.path;

    generateEnvironmentValues(host, options);
    addModuleImport(host, path);
    addModuleEntry(host, path);

    // return updated tree
    return host;
  };
}
