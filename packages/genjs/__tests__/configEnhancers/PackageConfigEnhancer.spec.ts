import PackageConfigEnhancer from "../../src/configEnhancers/PackageConfigEnhancer";
import {readFileSync} from 'fs';
import YAML from 'yaml';

beforeEach(() => {
    jest.resetAllMocks();
});

describe('PackageConfigEnhancer', () => {
    [
        'empty',
        'no-mixins',
        'one-mixin',
        'two-mixins',
    ]
        .forEach(name => it(`enrich '${name}'`, async () => {
            const getCaseFileContent = x => readFileSync(`${__dirname}/../../__fixtures__/configEnhancers/${name}/${x}`, 'utf8');
            const getAsset = (x, y) => YAML.parse(getCaseFileContent(`assets/${x}/${y}.yml`));
            const configEnhancer = new PackageConfigEnhancer(getAsset);
            expect(configEnhancer.enrich(YAML.parse(getCaseFileContent('cfg.yml')))).toStrictEqual(YAML.parse(getCaseFileContent('expected.yml')))
        }))
    ;
});