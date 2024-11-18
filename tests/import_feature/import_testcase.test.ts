import { describe, test, expect } from "@jest/globals"
import { getFeaturePaths } from '../../src/commads/import_testcase';
import { procesar_field } from "../../src/utils";
import { FeatureToJSON } from "@testmanlabs/testman-feature";

describe('getFeaturePaths', () => {

    test('Validar el procesamiento de feature file', async () => {
        let document = FeatureToJSON('tests/import_feature/feature/functional1/TEST-2071.feature');
        expect(document).toBeDefined();
    });

    test('Validar el procesamiento de campos', async () => {
        let document = FeatureToJSON('tests/import_feature/feature/functional1/TEST-2071.feature');
        const field = await procesar_field(document);
        expect(field).toBeDefined();
        expect(field.fields).toEqual({"assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327", "components": "API-TEST1,API-TEST2", "description": "Lorem ipsum description", "fix": "SQT-Sprint01,SQR-Sprint01", "folder": "/FolderTest", "key": "", "labels": "Manual,Regression,Smoke", "precondition": "Lorem ipsum precondition", "priority": "High", "reporter": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327", "sprint": "Board Pruebas/Board Sprint 1", "status": "To Do", "story": "TEST-2208"});
    }); 

    test('Verificar que debería devolver un array de rutas cuando se proporciona una cadena con rutas separadas por comas', () => {
        const path = 'tests/import_feature/feature/functional1/TEST-2071.feature,tests/import_feature/feature/functional1/TEST-2072.feature';
        const result = getFeaturePaths(path);
        expect(result.length).toBe(2);
        expect(result[0]).toContain('tests/import_feature/feature/functional1/TEST-2071.feature');
        expect(result[1]).toContain('tests/import_feature/feature/functional1/TEST-2072.feature');
    });

    test('Verificar que debería devolver un array de rutas cuando se proporciona un directorio', () => {
        const path = 'tests/import_feature/feature/functional1,tests/import_feature/feature/functional2';
        const result = getFeaturePaths(path);
        expect(result.length).toBeGreaterThan(0);  
        expect(result.length).toBe(4);
    });

    test('Verificar que debería devolver un array con una sola ruta cuando se proporciona una ruta a un archivo .feature', () => {
        const path = "tests\\import_feature\\feature\\functional1\\TEST-2071.feature";
        const result = getFeaturePaths(path);
        expect(result.length).toBe(1);
        expect(result[0]).toContain('tests/import_feature/feature/functional1/TEST-2071.feature');
    });

    test('Verificar que debería devolver un array de rutas cuando se proporciona un directorio con archivos .feature', () => {
        const path = 'tests/import_feature/feature/functional1';
        const result = getFeaturePaths(path);
        expect(result.length).toBeGreaterThan(0);
        expect(result.length).toBe(3);
    });

    test('Verificar que se debe lanzar un error cuando se proporciona un parámetro no válido', () => {
        const path = 123;
        expect(() => getFeaturePaths(path as any)).toThrow('featurePath.split is not a function');
    });

    test('Verificar que se debe lanzar un error cuando la ruta especificada no existe', () => {
        const path = 'tests/import_feature/feature/functional1/TEST-207x.feature';
        expect(() => getFeaturePaths(path)).toThrow('❌ La ruta especificada no existe');
    });
});