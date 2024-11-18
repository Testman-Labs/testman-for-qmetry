import { IImportTestcase } from '../types';
export { import_testcase, getFeaturePaths };
declare function import_testcase({ jwt, featurePath, project, validate }: IImportTestcase): Promise<void>;
declare function getFeaturePaths(featurePath: string): string[];
//# sourceMappingURL=import_testcase.d.ts.map