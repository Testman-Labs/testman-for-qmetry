import { file_import, testcase_import, validate_upload } from '../utils/request';
import { generate_blob, procesar_field, procesar_field_qmetry, procesar_testcase, validar_existencias } from '../utils';
import { FeatureToJSON, IFeatureToJSON } from '@testmanlabs/testman-feature';
import { IImportTestcase } from '../types';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { join, resolve, sep } from 'path';
export { import_testcase, getFeaturePaths };

async function import_testcase({ jwt, featurePath, project, validate }: IImportTestcase) {
    try {
        console.log({ featurePath, project, validate });

        const featurePaths = getFeaturePaths(featurePath);

        console.log("✅ Archivos .feature válidos. Procesando...");
        const projectId = project.split(":")[0];

        for (const path of featurePaths) {
            await processFeatureFile(jwt, path, projectId, validate);
        }
    } catch (error) {
        console.error("❌ Error al importar el caso de prueba:", error);
        throw error;
    }
}

function getFeaturePaths(featurePath: string): string[] {
    featurePath = featurePath.split(/[\\/]/).join(sep);
    const paths: string[] = [];

    if (featurePath.includes(',')) {
        const pathArray = featurePath.split(',').map(p => p.trim());

        for (const path of pathArray) {
            const resolvedPath = resolve(path);
            if (existsSync(resolvedPath)) {
                if (lstatSync(resolvedPath).isDirectory()) {
                    const files = readdirSync(resolvedPath)
                        .filter(file => file.endsWith('.feature'))
                        .map(file => join(resolvedPath, file));
                    paths.push(...files);
                } else if (resolvedPath.endsWith('.feature')) {
                    paths.push(resolvedPath);
                } else {
                    throw new Error(`❌ La ruta no es un archivo .feature ni un directorio válido: ${resolvedPath}`);
                }
            } else {
                throw new Error(`❌ La ruta especificada no existe: ${resolvedPath}`);
            }
        }
    } else {
        // Validar si featurePath es un directorio o un archivo .feature
        const resolvedPath = resolve(featurePath);

        if (existsSync(resolvedPath)) {
            if (lstatSync(resolvedPath).isDirectory()) {
                // Extraer los archivos .feature del directorio
                const files = readdirSync(resolvedPath)
                    .filter(file => file.endsWith('.feature'))
                    .map(file => join(resolvedPath, file));
                paths.push(...files);
            } else if (resolvedPath.endsWith('.feature')) {
                // Es un archivo .feature individual
                paths.push(resolvedPath);
            } else {
                throw new Error(`❌ La ruta no es un archivo .feature ni un directorio válido: ${resolvedPath}`);
            }
        } else {
            throw new Error(`❌ La ruta especificada no existe: ${resolvedPath}`);
        }
    }

    return paths;
}

async function processFeatureFile(jwt: string, path: string, projectId: string, validate: boolean) {
    if (validate) {
        const total_test = await procesar_testcase(jwt, projectId);

        let document = FeatureToJSON(path);
        document = await validar_existencias(document, total_test);

        if (document.elements.length > 0) {
            await procesar_import(jwt, projectId, document);
        } else {
            throw new Error("❌ No se encontraron testcases para importar en el archivo: " + path);
        }
    } else {
        let document = FeatureToJSON(path);
        await procesar_import(jwt, projectId, document);
    }
}

async function procesar_import(jwt: string, projectId: string, document: IFeatureToJSON) {
    document = await procesar_field(document);
    const fileBlob = await generate_blob(document, false);

    const fileImport = await file_import(jwt, projectId, fileBlob!);
    const fields = await procesar_field_qmetry(jwt, projectId, fileImport);
    const importTC = await testcase_import(jwt, fileImport?.data.fileId, projectId, fields);

    let validateUpdload = await validate_upload(jwt, importTC);
    
    if (validateUpdload.status === "Completed") {
        console.log(validateUpdload);
        console.log("✅ Importación completada con éxito.");

    } else if (validateUpdload.status === "Failed") {
        throw new Error("❌ Error al importar los casos de prueba");

    } else {
        let attempts = 0;
        const maxAttempts = 5;

        do {
            await new Promise(resolve => setTimeout(resolve, 5000));
            validateUpdload = await validate_upload(jwt, importTC);
            attempts++;
        } while (attempts < maxAttempts);

        if (validateUpdload.status === "Completed") {
            console.log(validateUpdload);
            console.log("✅ Importación completada con éxito.");

        } else {
            throw new Error("❌ Error al importar los casos de prueba");
        }
    }
} 
