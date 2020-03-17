import { Rule, apply, url, move, Source, chain, mergeWith, template } from '@angular-devkit/schematics';
import { exec } from 'child_process';

import ISchema from './schema.interface';


function mockServerPkgInstall(): void {
  exec('npm i node-mock-server -D');
}

function addTplFiles(path: string, options: ISchema): Source {
  return apply(url('./files'), [
    template({
      mockPath: options.mockPath,
      port: options.port,
    }),
    move(path as string)
  ]);
}

// TODO implementare options:
// 1. mock path

export function mockServer(options: ISchema): Rule {
  exec('npm i --package-lock-only');
  mockServerPkgInstall();
  return (/*host: Tree, context: SchematicContext*/) => {
    const templateSource = addTplFiles('', options);

    // return updated tree
    return chain([
      mergeWith(templateSource)
    ]);
  };
}
