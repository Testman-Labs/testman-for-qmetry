import { IFeatureToJSON } from "@testmanlabs/testman-feature";
export declare function procesar_field(doc: IFeatureToJSON): Promise<IFeatureToJSON>;
export declare function procesar_field_qmetry(jwt: string, projectId: string, fileImport: any): Promise<any>;
export declare function generate_blob(document: IFeatureToJSON, generateFile: boolean): Promise<Blob | null>;
export declare function procesar_testcase(jwt: string, projectId: string): Promise<any[]>;
export declare function validar_existencias(document: IFeatureToJSON, total_test: any[]): Promise<IFeatureToJSON>;
export declare function newDate(dateString: string): string;
declare const estadoMap: {
    Blocked: string;
    Fail: string;
    "Work In Progress": string;
    "Not Executed": string;
    Pass: string;
};
export declare function newEstado(estado: keyof typeof estadoMap): string;
export {};
//# sourceMappingURL=index.d.ts.map