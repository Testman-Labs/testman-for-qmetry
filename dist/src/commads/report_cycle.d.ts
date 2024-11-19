import { IReportCycle } from "../types";
export { report_cycle };
declare const report_cycle: ({ jwt, project, testCycleId }: IReportCycle) => Promise<{
    testCycleId: string;
    headerColor: string;
    headerLogo: string;
    summary: any;
    customField: any;
    fechaInicio: string;
    fechaFin: string;
    ejecutado: any;
    componentes: any;
    historia: any[];
    pruebas: any[];
    imagenTotal: number;
    ambiente: any;
    estado: string;
}>;
//# sourceMappingURL=report_cycle.d.ts.map