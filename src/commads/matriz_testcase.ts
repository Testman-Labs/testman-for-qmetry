import { FeatureToJSON, IFeatureToJSON } from "@testmanlabs/testman-feature";
import { existsSync } from "fs";
import { resolve, sep } from "path";
import { generate_blob, procesar_field } from "../utils";

export async function matriz_testcase({ featurePath }:{featurePath: string}) {
    try {
        console.log({ featurePath });

        const featurePaths = getFeaturePaths(featurePath);
        console.log("✅ Archivos .feature válidos. Procesando...");

        await processFeatureFile(featurePaths);
    } catch (error) {
        console.error("❌ Error al importar el caso de prueba:", error);
        throw error;
    }
}

function getFeaturePaths(featurePath: string) {
    featurePath = featurePath.split(/[\\/]/).join(sep);
    const resolvedPath = resolve(featurePath);

    if (existsSync(resolvedPath)) {
        if (resolvedPath.endsWith('.feature')) {
            return resolvedPath;
        } else {
            throw new Error(`❌ La ruta no es un archivo .feature ni un directorio válido: ${resolvedPath}`);
        }
    } else {
        throw new Error(`❌ La ruta especificada no existe: ${resolvedPath}`);
    }
}


async function processFeatureFile(path: string) {
    let document = FeatureToJSON(path);
    await procesar_import(document);
}

async function procesar_import(document: IFeatureToJSON) {
    document = await procesar_field(document);
    await generate_blob(document, true);
} 