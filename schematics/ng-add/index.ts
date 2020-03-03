import { Rule, Tree } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from 'schematics-utilities';
import { getWorkspace } from '@schematics/angular/utility/config';


function addModuleImport(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('@NgModule({');
    const content2Append = `import { AngularCoreModule } from '@next-adv/angular-core';\n\n`;
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
    AngularCoreModule.setConfig(
        {
          auth: {
            idField: 'email',
            pwdField: 'password',
          },
          restApi: {
            restEndpoint: 'http://dev.server.com/api',
          },
          locale: 'it'
        }
    ),\n`;
    const updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);
    host.overwrite(path + '/app.module.ts', updatedContent);
  }
}

export function ngAdd(options: any): Rule {
  return (host: Tree/*, context: SchematicContext*/) => {
    // get the workspace config of the consuming project
    // i.e. angular.json file

    console.log(options);
    const workspace = getWorkspace(host);
    // identify the project config which is using our library
    // or default to the default project in consumer workspace
    const project = getProjectFromWorkspace(
      workspace,
      options.project || workspace.defaultProject
    );
    const projectType = project.projectType === 'application' ? 'app' : 'lib';
    const path = (options.path === undefined) ? `${project.sourceRoot}/${projectType}` : options.path;

    addModuleImport(host, path);
    addModuleEntry(host, path);

    // return updated tree
    return host;
  };
}
