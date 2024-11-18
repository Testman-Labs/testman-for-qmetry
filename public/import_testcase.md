# Import Test Case

Para usar las acciones de **import_testcase.yml**, se requieren algunas configuraciones.

## Instrucciones para Configurar el Workflow

1. **Copiar el archivo de acción**: Copie el archivo de acción desde el directorio de plantillas de workflows (`.github/workflows_template`) a su directorio de workflows (`.github/workflows`).

```sh
cp .github/workflows_template/import_testcase.yml .github/workflows/
```

2. **Configurar el archivo de configuración**: Asegúrese de que el archivo de configuración (`settings.json`) esté correctamente ubicado y configurado en su repositorio.

3. **Personalizar el archivo de acción**: Personalice el archivo de acción (`import_testcase.yml`) según sus necesidades específicas, incluyendo la configuración de las credenciales y los parámetros necesarios.

4. **Realizar commit y push**: Realice un commit y un push de los cambios a su repositorio.

```sh
git add .github/workflows/import_testcase.yml
git commit -m "Agregar workflow de importación de casos de prueba"
git push origin main
```

5. **Verificar la ejecución del workflow**: Verifique que el workflow se ejecute correctamente en la pestaña de Actions de su repositorio en GitHub.

## Actions

Valores requeridos para que las acciones funcionen.

```yaml
execute: import-testcase
settings: "./tests/loader_settings/settings.json"
username: ${{ secrets.JIRA_EMAIL }}
secretkey: ${{ secrets.JIRA_TOKEN }}
filepath: ${{ inputs.featurepath }}
project: ${{ inputs.project }}
exists: ${{ inputs.validate }}
```

### Campos Soportados

Solo los campos de tipo público pueden ser declarados como campos en el archivo .feature.

| Campo        | Predeterminado | Requerido | Tipo    |
| ------------ | -------------- | --------- | ------- |
| summary      | -              | true      | private |
| steps        | -              | true      | private |
| data         | -              | true      | private |
| expect       | -              | true      | private |
| description  | -              | false     | public  |
| precondition | -              | false     | public  |
| status       | To Do          | false     | public  |
| priority     | Medium         | false     | public  |
| assignee     | -              | true      | public  |
| reporter     | -              | true      | public  |
| labels       | -              | false     | public  |
| story        | -              | false     | public  |
| fix          | -              | false     | public  |
| components   | -              | false     | public  |
| sprint       | -              | false     | public  |

**Importante**

- Los campos de tipo privado no pueden ser declarados.
- Los campos de tipo privado se obtienen mediante funciones que usan GWT.
- Si se completa el campo assignee, el campo reporter se completará automáticamente, y viceversa.
- El campo "Estimated time" de Qmetry no es compatible debido a problemas de compatibilidad.

### Agregar un nuevo campo personalizado

Para agregar un nuevo campo personalizado registrado en Qmetry, siga unos sencillos pasos:

1. Edite el archivo settings.json que configuró en su repositorio de trabajo en .github/settings/settings.json.

2. En la propiedad fields.testcase, agregue lo siguiente:

```json
{
    "type": "public",              // Valor predeterminado
    "name": "automate",            // Nombre del campo
    "value": "No",                 // Valor predeterminado
    "xlsHeader": "Automate",       // Referencia del campo en Qmetry
    "qmetryHeader": null           // Valor predeterminado
}
```

3. Después de agregar el campo, invóquelo en el feature o scenario:

```gherkin
Feature: Example Invoce Field
    [automate] = Yes
    
    Scenario: New Fields 1
        [automate] = No

    Scenario: New Fields 2
        # Takes the default value of Yes
```
**Nota:**  Si los campos se definieron en el feature, los mismos valores se aplican a todos los escenarios.

### Ejemplo de Uso

Primero, necesita trabajar con archivos de tipo feature.

- La regla es simple y fácil: si todos los campos se definieron en el feature, se heredarán en el scenario.
- Si un campo se define en el scenario, no se hereda al feature.
- Si no se definió ningún campo en el feature o scenario, por defecto, se devolverán los valores predeterminados de status y priority.
  
#### Caso 1: Feature a Scenario

Se presenta un ejemplo práctico para este caso.

```gherkin
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña
    [description]=Lorem ipsum description
    [precondition]=Lorem ipsum precondition
    [status]=To Do
    [priority]=High
    [assignee]=818189:ed07188a-d0dd-46d9-adb7-2549rs452327
    [labels]=Manual,Regression,Smoke
    [story]=TEST-2208
    [fix]=SQT-Sprint01,SQR-Sprint01
    [components]=API-TEST1,API-TEST2
    [sprint]=Board Pruebas/Board Sprint 1
    [folder]=/FolderTest
 
    Scenario: Happy Path - Login Success
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password"
        And I click "next"
        Then the login is done successfully
        And I am redirected to the main screen of the app

    Scenario: Happy Path - Login Fail
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password2"
        And I click "next"
        Then the login is done failed
        And I am redirected to the main login of the app 
```

La salida de los campos para los escenarios sería la misma:

```json
//Scenario Out Fields
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "SQT-Sprint01,SQR-Sprint01",
    "components": "API-TEST1,API-TEST2",
    "sprint": "Board Pruebas/Board Sprint 1",
    "folder": "/FolderTest"
}
```

#### Caso 2: Scenario define Campos

Se presenta el ejemplo si agrega campos al scenario. Los campos del feature son opcionales para este caso.

```gherkin
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña
    [description]=Lorem ipsum description
    [precondition]=Lorem ipsum precondition
    [status]=To Do
    [priority]=High
    [assignee]=818189:ed07188a-d0dd-46d9-adb7-2549rs452327
    [labels]=Manual,Regression,Smoke
    [story]=TEST-2208
    [fix]=SQT-Sprint01,SQR-Sprint01
 
    Scenario: Happy Path - Login Success
        [components]=API-TEST1
        [sprint]=Board Pruebas/Board Sprint 1
        [folder]=/FolderTestSuccess
 
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password"
        And I click "next"
        Then the login is done successfully
        And I am redirected to the main screen of the app

    Scenario: Happy Path - Login Fail
        [components]=API-TEST2
        [sprint]=Board Pruebas/Board Sprint 2
        [folder]=/FolderTestFailed

        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password2"
        And I click "next"
        Then the login is done failed
        And I am redirected to the main login of the app 
```

Los campos de salida para los escenarios son diferentes:

```json
//Scenario Out Fields - Login Success
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "SQT-Sprint01,SQR-Sprint01",
    "components": "API-TEST1",
    "sprint": "Board Pruebas/Board Sprint 1",
    "folder": "/FolderTestSuccess"
}

//Scenario Out Fields - Login Failes
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "SQT-Sprint01,SQR-Sprint01",
    "components": "API-TEST2",
    "sprint": "Board Pruebas/Board Sprint 2",
    "folder": "/FolderTestFailed"
}
```

**Nota:** Puede definir los campos tanto en el feature como en el scenario para que se complementen entre sí. Solo recuerde que cada campo definido en el scenario será único para esos casos de prueba.