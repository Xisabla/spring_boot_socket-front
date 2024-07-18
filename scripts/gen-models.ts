import { execSync } from 'child_process';
import { cp, opendir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';

const URL_PATH = '/v3/api-docs';
const TMP_DIST = './tmp-generated';
const DIST = './src/app/core/models';

//
// HELPERS
//

// https://gist.github.com/lovasoa/8691344
async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

//
// PROCESS
//

async function getBaseUrl() {
    if (process.env['NODE_ENV'] === 'production') {
        return (await import('../src/environments/environment')).environment.apiURL;
    }

    return (await import('../src/environments/environment.development')).environment.apiURL;
}

async function getApiDocs(baseUrl: string, dist: string) {
    execSync(
        `npx @openapitools/openapi-generator-cli generate -i ${baseUrl}${URL_PATH} -g typescript-rxjs -o ${dist}`,
        {
            stdio: 'inherit',
        },
    );

    return dist;
}

async function patchModels(dist: string) {
    for await (const file of walk(dist)) {
        await removeTsLintDisable(file);

        if (file.endsWith('TokenizedUserDto.ts')) {
            await fixTokenizedUserDtoFacultativeFields(file);
        }
    }
}

async function copyModels(src: string, dist: string) {
    await cp(src, dist, { recursive: true });
}

async function cleanup(tmp: string) {
    await rm(tmp, { recursive: true, force: true, maxRetries: 5 });
}

//
// PATCHES
//

async function removeTsLintDisable(filePath: string) {
    const content = (await readFile(filePath, 'utf-8'))
        .replace('// tslint:disable\n', '')
        .replace('// tslint:disable', '');

    await writeFile(filePath, content);
}

async function fixTokenizedUserDtoFacultativeFields(filePath: string) {
    if (!filePath.endsWith('TokenizedUserDto.ts')) return;

    const content = (await readFile(filePath, 'utf-8')).replaceAll('?:', ':').replaceAll('? :', ':');

    await writeFile(filePath, content);
}

//
// MAIN
//

(async () => {
    const baseUrl = await getBaseUrl();

    const tmp = await getApiDocs(baseUrl, TMP_DIST);
    await patchModels(`${tmp}/models`);
    await copyModels(`${tmp}/models`, DIST);

    await cleanup(tmp);
})().catch(console.error);
