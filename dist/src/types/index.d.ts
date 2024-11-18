export interface IImportTestcase {
    jwt: string;
    featurePath: string;
    project: string;
    validate: boolean;
}
export interface IReportCycle {
    jwt: string;
    project: string;
    testCycleId: string;
}
export interface IJira {
    host: string;
    email: string;
    token: string;
}
export interface ISettigns {
    constanst: {
        jirabase_url: string;
    };
    fields: {
        testcase: IFieldTestcase[];
        testcycle: IFieldTestCycle[];
    };
    reports: {
        testcycle: IReportTestCycle;
    };
}
export interface IFieldTestcase {
    type: string;
    name: string;
    value: string;
    xlsHeader: string;
    qmetryHeader: string;
}
export interface IFieldTestCycle {
    name: string;
    value: string;
}
export interface IReportTestCycle {
    headerColor: string;
    headerLogo: string;
}
//# sourceMappingURL=index.d.ts.map