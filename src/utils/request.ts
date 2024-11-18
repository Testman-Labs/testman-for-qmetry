export { search_import_tc, file_import, field_qmetry, testcase_import, validate_upload, list_testcase };

// TESTCASE
async function file_import(jwt: string, projectId: string, fileBlob: Blob) {
    console.log('🌐 Subiendo archivo...');
    const host = `https://qtmcloud.qmetry.com/rest/api/ui/projects/${projectId}/import`;
    const url = new URL(host);

    const formData = new FormData();
    formData.append('file', fileBlob, 'data.xlsx');
    formData.append('separator', ',');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': jwt as string
        },
        body: formData
    });

    if (!response.ok) {
        console.error("❌ Error al subir el archivo");
        return;
    }

    const json = await response.json();
    return json;
}

async function field_qmetry(jwt: string, projectId: string) {
    const url = new URL('https://qtmcloud.qmetry.com/rest/api/ui/ai/config');
    const data = {
        project: {
            jiraProjectId: projectId,
            configurations: ["testcaseCustomFields"]
        }
    };

    const request = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': jwt as string
        },
        body: JSON.stringify(data)
    });

    if (!request.ok) {
        console.error("❌ Error al obtener los campos personalizados");
        return;
    }

    const responseJson = await request.json();
    return responseJson;
}

async function testcase_import(jwt: string, fileId: string, projectId: string, fields: []) {
    console.log('🚀 Importando Casos de Prueba...');
    const data = {
        uploadedFile: {},
        fileId: fileId,
        folderId: -1,
        sheetName: "Datos",
        createMetaData: true,
        updateExistingIssues: false,
        mapping: fields,
        projectId: projectId
    };

    const url = new URL('https://qtmcloud.qmetry.com/rest/api/ui/testcases/import');
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': jwt as string
        },
        body: JSON.stringify(data)
    });

    if (!request.ok) {
        console.error("❌ Error al importar los casos de prueba");
        return;
    }

    const responseJson = await request.json();
    return responseJson;
}

async function validate_upload(jwt: string, importTC: any) {
    console.log("🔎 Validando Subida:", importTC.status);

    const response = await fetch(importTC.progressUrl, {
        method: 'GET',
        headers: {
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

async function search_import_tc(jwt: string, taskId: string) {
    console.log('🔍 Buscando Task...');
    const response = await fetch('https://qtmcloud.qmetry.com/rest/api/ui/tasks/' + taskId, {
        method: 'GET',
        headers: {
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

async function list_testcase(jwt: string, startAt: number, projectId: string) {
    console.log('📚 Obteniendo Casos de Prueba...');
    const data = {
        filter: {
            projectId: projectId,
            folderId: '-1',
            withChild: true
        }
    }

    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcases/search?startAt=${startAt}&maxResults=100&fields=summary`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

// CYCLE
export async function field_cycle(jwt: string, projectId: string) {
    const url = new URL('https://qtmcloud.qmetry.com/rest/api/ui/ai/config');
    const data = {
        project: {
            jiraProjectId: projectId,
            configurations: ["testcycleCustomFields"]
        }
    };

    const request = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': jwt as string
        },
        body: JSON.stringify(data)
    });

    if (!request.ok) {
        console.error("❌ Error al obtener los campos personalizados");
        return;
    }

    const responseJson = await request.json();
    return responseJson;
}

export async function cycle_detail(jwt: string, key: string, fields: string="") {
    console.log('📒 Obteniendo Cycle Detail...');
    const param = "startAt=0&maxResults=100&fields=summary,priority,status,reporter,plannedStartDate,plannedEndDate,sprint,components";
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcycles/${key}?${param}${fields}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

export async function cycle_story(jwt: string, key: string) {
    console.log('✅ Obteniendo Cycle Story...');
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcycles/${key}/requirements?startAt=0&maxResults=100&sort=key:DESC`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

export async function cycle_executions(jwt: string, startAt: number, key: string) {
    console.log('⏰ Obteniendo Cycle Execution...');
    const param = `startAt=${startAt}&maxResults=100&fields=id,summary,testCaseExecutionId,executionResult,hasDefect`;
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcycles/${key}/testcases/search?${param}`;
    
    const data = {
        "filter": {
            "testCaseStatus":"all"
        }
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

export async function cycle_execetion_detail(jwt: string, key: string, tctcmID: string) {
    console.log('🗂️ Obteniendo CyCle Execution Detail...');
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcycles/${key}/testcases/${tctcmID}/executions?startAt=0&maxResults=100`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}

export async function cycle_execution_attach(jwt: string, key: string, keyRun: string) {
    console.log('📎 Obteniendo Cycle Attach...');
    const param = `startAt=0&maxResults=100`;
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcycles/${key}/testcase-executions/${keyRun}/attachments?${param}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });

    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }

    const json = await response.json();
    return json;
}