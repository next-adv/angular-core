import {apply, chain, FileEntry, forEach, mergeWith, move, Rule, Source, Tree, url} from '@angular-devkit/schematics';
import {getProjectFromWorkspace} from 'schematics-utilities';
import {getWorkspace} from '@schematics/angular/utility/config';
import {exec} from 'child_process';
import ISchema, {IEnv} from './schema.interface';

function addTplFiles(path: string, host: Tree): Source {
  // copy templates and write routes
  return apply(url('./files'), [
    forEach((fileEntry: FileEntry) => {
      if (host.exists(path + fileEntry.path)) {
        console.log(fileEntry.path + ' already exists, but it\'s ok');
        return null;
      }
      return fileEntry;
    }),
    move(path)
  ]);
}

function addMoreFunctions(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('@NgModule({');
    const content2Append = `
// @next-adv/angular-core auto-generated code
function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/internal/assets/i18n/', '.json');
}
// @next-adv/angular-core auto-generated code end\n\n\n`;
    const updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);

    host.overwrite(path + '/app.module.ts', updatedContent);
  }
}

function addTranslationFunc(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.component.ts');

  if (content) {
    const strContent = content.toString();

    let appendIndex = 0;
    let content2Append = `
// @next-adv/angular-core auto-generated code
import {TranslateService} from '@ngx-translate/core';
// @next-adv/angular-core auto-generated code end\n\n\n`;
    let updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);


    appendIndex = updatedContent.indexOf('constructor(');
    content2Append = `
// @next-adv/angular-core auto-generated code
\nprivate translateService: TranslateService,
// @next-adv/angular-core auto-generated code end\n\n\n`;
    updatedContent = updatedContent.slice(0, appendIndex) + content2Append + updatedContent.slice(appendIndex);


    appendIndex = updatedContent.indexOf('this.platform.ready().then(() => {');
    content2Append = `
// @next-adv/angular-core auto-generated code
\nthis.initTranslate();
// @next-adv/angular-core auto-generated code end\n\n\n`;
    updatedContent = updatedContent.slice(0, appendIndex) + content2Append + updatedContent.slice(appendIndex);


    appendIndex = updatedContent.lastIndexOf('}') - 1;
    content2Append = `
// @next-adv/angular-core auto-generated code
initTranslate() {
        this.translateService.setDefaultLang('en');
        const browserLang = this.translateService.getBrowserLang();

        if (browserLang) {
            if (browserLang === 'zh') {
                const browserCultureLang = this.translateService.getBrowserCultureLang();

                if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
                    this.translateService.use('zh-cmn-Hans');
                } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
                    this.translateService.use('zh-cmn-Hant');
                }
            } else {
                this.translateService.use(this.translateService.getBrowserLang());
            }
        } else {
            this.translateService.use('en'); // Set your language here
        }
    }
// @next-adv/angular-core auto-generated code end\n\n\n`;
    updatedContent = updatedContent.slice(0, appendIndex) + content2Append + updatedContent.slice(appendIndex);


    host.overwrite(path + '/app.module.ts', updatedContent);
  }
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
      {
        prefix: 'internal',
        url: ''
      },
    ],
    'ngc:restPathList': [
      {
        prefix: 'main-api',
        type: 'auth',
        url: 'auth-endpoint',
      },
      {
        prefix: 'main-api',
        type: 'userMe',
        url: 'user-me-endpoint',
      },
      {
        prefix: 'main-api',
        type: 'forgotPwd',
        url: 'forgot-pwd-endpoint',
      },
      {
        prefix: 'wp-api',
        type: 'auth',
        url: 'auth-endpoint',
      },
    ],
  };
  const envDummy = JSON.stringify(envObj, null, 2)
    .replace('"window.location.origin"', 'window.location.origin')
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
    if (host.exists(sourceRoot + '/environments/environment.stage.ts')) {
      host.overwrite(sourceRoot + '/environments/environment.stage.ts', updatedDevContent);
    } else {
      host.create(sourceRoot + '/environments/environment.stage.ts', updatedDevContent);
    }
    host.overwrite(sourceRoot + '/environments/environment.prod.ts', updatedProdContent);
  }
}

function addModuleImport(host: Tree, path: string): void {
  const content: Buffer | null = host.read(path + '/app.module.ts');

  if (content) {
    const strContent = content.toString();
    const appendIndex = strContent.indexOf('@NgModule({');
    const content2Append = `// @next-adv/angular-core auto-generated code
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { GenericInterceptors } from './core/services/interceptor.service';
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
    let appendIndex = strContent.indexOf('imports: [') + ('imports: [').length;
    let content2Append = `
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
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    // @next-adv/angular-core auto-generated code end
    // [@next-adv/ionic-core]\n`; // <- ionic-core injection token! DO NOT TOUCH IT!
    let updatedContent = strContent.slice(0, appendIndex) + content2Append + strContent.slice(appendIndex);
    appendIndex = updatedContent.indexOf('providers: [') + ('providers: [').length;
    content2Append = `{
        provide: HTTP_INTERCEPTORS,
        useClass: GenericInterceptors,
        multi: true
    },`;
    updatedContent = updatedContent.slice(0, appendIndex) + content2Append + updatedContent.slice(appendIndex);
    host.overwrite(path + '/app.module.ts', updatedContent);
  }
}

export function ngAdd(options: ISchema): Rule {
  exec('npm i --package-lock-only');
  exec('npm i @ngx-translate/http-loader @ngx-translate/core @ionic/storage');
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
    addMoreFunctions(host, path);
    addTranslationFunc(host, path);
    addModuleEntry(host, path);
    const templateSource = addTplFiles(project.sourceRoot || '', host);

    // return updated tree
    return chain([
      mergeWith(templateSource)
    ]);
  };
}
