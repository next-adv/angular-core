import { Rule, Tree, apply, url, move, Source, chain, mergeWith } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from 'schematics-utilities';
import { getWorkspace } from '@schematics/angular/utility/config';

import ISchema, {IEnv} from './schema.interface';


function addTplFiles(path: string): Source {
  // copy templates and write routes
  return apply(url('./files'), [
    move(path as string)
  ]);
}


function generateEnvironmentValues(host: Tree, sourceRoot: string, options: ISchema): void {
  const devContent: Buffer | null = host.read(sourceRoot + '/environments/environment.ts');
  const prodContent: Buffer | null = host.read(sourceRoot + '/environments/environment.prod.ts');
  const envObj: IEnv = {
    locale: options.locale,
    'ngc:authIdField': options.authIdField,
    'ngc:authPwdField': options.authPwdField,
    'ngc:restEndpointList': [
      {
        prefix: 'main-api',
        url: options.devServerUrl
      },
      {
        prefix: 'wp-api',
        url: options.wpServerUrl
      },
    ],
    'ngc:restPathList': [
      {
        prefix: 'main-api',
        type: 'auth',
        url: '/auth-endpoint',
      },
      {
        prefix: 'main-api',
        type: 'userMe',
        url: '/user-me-endpoint',
      },
      {
        prefix: 'main-api',
        type: 'forgotPwd',
        url: '/forgot-pwd-endpoint',
      },
      {
        prefix: 'wp-api',
        type: 'auth',
        url: '/auth-endpoint',
      },
    ],
  };
  const envDummy = JSON.stringify(envObj, null, 2)
  .replace(/\"([^(\")"]+)\":/g, `$1:`) // strips " (doublequotes)
  .replace(/([a-zA-Z0-9]+:[a-zA-Z0-9]+):/g, `'$1':`) // wraps properties with : with '
  .replace(/"/g, `'`); // not sure about its usefullness, but it's free

  if (devContent && prodContent) {
    const strDevContent = devContent.toString();
    const strProdContent = prodContent.toString();
    const envStr = envDummy.slice(1, envDummy.length - 2) + ',\n';
    const updatedDevContent = strDevContent.replace(
      /(export const environment = {\n\s*production:\s*false)/,
      '$1,\n// @next-adv/angular-core auto-generated code' + envStr + '// @next-adv/angular-core auto-generated code end'
      );
    const updatedProdContent = strProdContent.replace(
      /(export const environment = {\n\s*production:\s*true)/,
      '$1,\n// @next-adv/angular-core auto-generated code' + envStr + '// @next-adv/angular-core auto-generated code end'
      );
    host.overwrite(sourceRoot + '/environments/environment.ts', updatedDevContent);
    host.overwrite(sourceRoot + '/environments/environment.prod.ts', updatedProdContent);
  }
}

function addModuleImport(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('@NgModule({');
    const content2Append = `// @next-adv/angular-core auto-generated code
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { AngularCoreModule } from '@next-adv/angular-core';
// @next-adv/angular-core auto-generated code end\n\n\n`;
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
    // @next-adv/angular-core auto-generated code
    AngularCoreModule.setConfig(
      {
        auth: {
          idField: environment['ngc:authIdField'],
          pwdField: environment['ngc:authPwdField'],
        },
        restApi: {
          restPathList: environment['ngc:restPathList'],
          restEndpointList: environment['ngc:restEndpointList'],
        },
        locale: environment.locale
      }
    ),
    TranslateModule.forRoot(),
    // @next-adv/angular-core auto-generated code end\n`;
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

    generateEnvironmentValues(host, project.sourceRoot || 'src', options);
    addModuleImport(host, path);
    addModuleEntry(host, path);
    const templateSource = addTplFiles(project.sourceRoot || '');

    // return updated tree
    return chain([
      mergeWith(templateSource)
    ]);
  };
}
