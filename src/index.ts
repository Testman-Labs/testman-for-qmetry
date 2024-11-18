import { getInput, setFailed, setOutput } from '@actions/core';
import { import_testcase } from './commads/import_testcase';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { IFieldTestcase, IFieldTestCycle, IJira, IReportTestCycle, ISettigns } from './types';
import { report_cycle } from './commads/report_cycle';
import { oauth_context } from './commads/validate_auth';
import { generatePDF } from './utils/pdf';
import { matriz_testcase } from './commads/matriz_testcase';

export let const_jirabase_url = "";
export let const_fields_testcase: IFieldTestcase[] = [];
export let const_fields_testcycle: IFieldTestCycle[] = [];
export let const_reports_testcycle: IReportTestCycle = {
    headerColor: "", headerLogo: ""
};
export let const_auth_jira: IJira = {
    email: "",
    token: "",
    host: ""
}

async function runs() {
    try {
        const settingsData = await loadSettings();
        if (settingsData) {
            const_jirabase_url = settingsData.constanst.jirabase_url;
            const_fields_testcase = settingsData.fields.testcase;
            const_fields_testcycle = settingsData.fields.testcycle;
            const_reports_testcycle = settingsData.reports.testcycle;
        }

        if ('report-cycle-pdf' === getInput('execute') || 'matriz-testcase' === getInput('execute')) {
            await executeCommand("");
        } else {
            const jwt = await authenticate();
            await executeCommand(jwt);
        }
    } catch (error) {
        setFailed(error as string | Error);
    }
}

async function loadSettings() {
    const inputSettings = getInput('settings');
    const resolveSetting = resolve(inputSettings);

    if (inputSettings && existsSync(resolveSetting)) {
        const settingsData: ISettigns = require(resolveSetting);
        return settingsData;
    } else {
        throw new Error(`❌ El archivo de configuración no existe en la ruta: ${resolveSetting}`);
    }
}

async function authenticate() {
    const jira_email = getInput('username');
    const jira_token = getInput('secretkey');
    if (!jira_email || !jira_token) {
        throw new Error("❌ Las credenciales de Jira no están completas");
    }

    const_auth_jira = {
        email: jira_email,
        token: jira_token,
        host: const_jirabase_url
    }

    const response = await oauth_context(const_auth_jira);
    if (!response) {
        throw new Error("❌ Error al obtener el token de autenticación");
    }
    return response!;
}

async function executeCommand(jwt: string = "") {
    const execute = getInput('execute');

    switch (execute) {
        case 'import-testcase':
            await import_testcase({
                jwt,
                featurePath: getInput('filepath'),
                project: getInput('project'),
                validate: getInput('exists') === 'true'
            });
            break;
        case 'matriz-testcase':
            await matriz_testcase({
                featurePath: getInput('filepath'),
            });
        case 'report-cycle':
            const report_cycle_data = await report_cycle({
                jwt,
                project: getInput('project'),
                testCycleId: getInput('testCycleId')
            })
            const escapedReportCycleData = encodeURIComponent(JSON.stringify(report_cycle_data));
            setOutput('report-cycle', escapedReportCycleData);
            break;
        case 'report-cycle-pdf':
            await generatePDF(
                getInput('template'),
                getInput('data')
            );
            break;
        default:
            throw new Error("❌ Comando no encontrado");
    }
}

if (require.main === module) {
    runs();
}