import { resolve } from "path";
import { const_fields_testcycle, const_reports_testcycle } from "..";
import { cycle_detail, cycle_execetion_detail, cycle_execution_attach, cycle_executions, cycle_story, field_cycle } from "../utils/request";
import { issue_detail, user_detail } from "./validate_auth";
import { readFileSync } from "fs";
import { IReportCycle } from "../types";
import { newDate, newEstado } from "../utils";

export { report_cycle };

const report_cycle = async ({ jwt, project, testCycleId }: IReportCycle) => {
    try {
        console.log({ project, testCycleId });

        const projectId = project.split(":")[0];
        const field = await field_cycle(jwt, projectId);
        const custom_fields = getCustomFields(field);

        const detail = await cycle_detail(jwt, testCycleId, custom_fields.field_id);
        const user = await user_detail(detail.data.reporter);
        const cc_story = await cycle_story(jwt, detail.data.id);

        if (cc_story.data.length === 0) {
            throw new Error("❌ No se encontraron historias asociadas al ciclo de pruebas");
        }

        const historia = await getHistorias(cc_story);

        const total_test = await getTotalTests(jwt, detail.data.id);

        await addAttachmentsAndEnvironment(jwt, detail.data.id, total_test);

        const headerLogoSrc = getHeaderLogoSrc();

        const custom_field_data = getCustomFieldData(custom_fields, detail);

        const components = detail.data.components.map((component: any) => component.name).join(", ");
        const estado = total_test.some(test => test.status === 'Exitoso') ? 'Exitoso' : 'Fallido';
        const ambiente = total_test.some(test => test.ambiente === 'No Environment') ? 'No Environment' : total_test[0].ambiente;

        const report_data = {
            headerColor: const_reports_testcycle.headerColor,
            headerLogo: headerLogoSrc,
            summary: detail.data.summary,
            customField: custom_field_data,
            fechaInicio: newDate(detail.data.plannedStartDate),
            fechaFin: newDate(detail.data.plannedEndDate),
            ejecutado: user.displayName,
            componentes: components,
            historia,
            pruebas: total_test,
            ambiente,
            estado
        };

        return report_data;
    } catch (error) {
        throw new Error(`❌ Error al importar el caso de prueba: ${error}`);
    }
};

const getCustomFields = (field: any) => {
    let field_id = "";
    const custom_fields = [];

    if (field.projectConfigurations.testcycleCustomFields.length === 0) {
        console.log("🚧 No se encontraron campos personalizados para el ciclo de pruebas");
    } else {
        const filter_field_id = field.projectConfigurations.testcycleCustomFields.map((field: any) => field.id);
        const filter_field = field.projectConfigurations.testcycleCustomFields.map((field: any) => ({ id: field.id, name: field.name }));
        field_id = filter_field_id.length > 0 ? `,${filter_field_id.join(",")}` : "";

        for (const const_field of const_fields_testcycle) {
            const matchedField = filter_field.find((field: any) => field.name === const_field.value);
            if (matchedField) {
                console.log(`⏺️ Campo personalizado: ${matchedField.name}`);
                custom_fields.push({ name: const_field.name, value: matchedField.id });
            }
        }
    }

    return { field_id, custom_fields };
};

const getHistorias = async (cc_story: any) => {
    return await Promise.all(cc_story.data.map(async (story: any) => {
        const detail_story = await issue_detail(story.key);
        return { key: story.key, summary: detail_story.fields.summary };
    }));
};

const getTotalTests = async (jwt: string, detailId: string) => {
    const cycle_execs = await cycle_executions(jwt, 0, detailId);
    const per_page = Math.ceil(cycle_execs?.total / 100);
    const total_test = [...cycle_execs?.data.map(mapTestCase)];

    for (let i = 1; i < per_page; i++) {
        const cycle_exec = await cycle_executions(jwt, cycle_execs?.startAt + i, detailId);
        total_test.push(...cycle_exec?.data.map(mapTestCase));
    }

    return total_test;
};

const addAttachmentsAndEnvironment = async (jwt: string, detailId: string, total_test: any[]) => {
    for (const test of total_test) {
        const ced = await cycle_execetion_detail(jwt, detailId, test.tctcmID);
        test.ambiente = ced.executions.data[0].environment.name;

        const attach = await cycle_execution_attach(jwt, detailId, test.tceID);
        test.attach = attach.data.length === 0 ? { url: "", name: "" } : { url: attach.data[0].url, name: attach.data[0].name };
    }
};

const getHeaderLogoSrc = () => {
    const headerLogoPath = resolve(const_reports_testcycle.headerLogo);
    const headerLogoBase64 = readFileSync(headerLogoPath).toString('base64');
    return `data:image/png;base64,${headerLogoBase64}`;
};

const getCustomFieldData = (custom_fields: any, detail: any) => {
    return custom_fields.custom_fields.map((field: any) => ({
        name: field.name,
        value: detail.data.customFields[field.value].value[0].name
    }));
};

const mapTestCase = (tc: any) => ({
    tctcmID: tc.testCycleTestCaseMapId,
    tceID: tc.testCaseExecutionId,
    key: tc.key,
    summary: tc.summary,
    status: newEstado(tc.executionResult.name),
    ambiente: ""
});