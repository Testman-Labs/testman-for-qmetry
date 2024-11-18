import { existsSync } from "fs";
import { resolve } from "path";
import { ISettigns } from "../../src/types";
import { describe, expect, test } from "@jest/globals";

function loadSettings(inputSettings: string) {
    const resolveSetting = resolve(inputSettings);

    if (inputSettings && existsSync(resolveSetting)) {
        const settingsData: ISettigns = require(resolveSetting);
        return settingsData;
    } else {
        throw new Error(`❌ El archivo de configuración no existe en la ruta: ${resolveSetting}`);
    }
}

describe('loadSettings', () => { 

    test('Validar la carga de archivo', () => {
        const settings = loadSettings('./tests/loader_settings/settings.json');
        console.log(settings);
        expect(settings).toBeDefined();
    });

    test('Lanzar error si el archivo no existe', async () => {
        expect(() => loadSettings('./invalidSettings.json')).toThrowError('❌ El archivo de configuración no existe en la ruta:');
    });

    test('Lanzar error si la ruta está vacía', async () => {
        expect(() => loadSettings('')).toThrowError('❌ El archivo de configuración no existe en la ruta:');
    });
});