<p align="center">
    <a href="#">
        <img alt="testman-qmetry" src="https://repository-images.githubusercontent.com/890138000/49dcedff-2763-4235-9f87-1a0bb592871e">
    </a>
</p>

<p align="center">
    <strong>Herramienta de última generación para automatizar procesos de Qmetry con soporte BDD</strong>
</p>

***

## Configuración del Repositorio

1. Cree una carpeta llamada `settings` dentro de `.github` en su repositorio de gestión de casos de prueba.
2. Copie el archivo `settings.json` desde `tests/loader_settings` al directorio `.github/settings`.
3. Configure su `jirabase_url` y los campos personalizados de casos de prueba en Qmetry.

</br>  

**Importante:** Reemplace las variables `'HERE_YOUR_*******'` en los workflows.

## Esquema de settings.json
```json
{
    "constanst": {
        "jirabase_url": "string"
    },
    "fields": {
        "testcase": [
            {
                "type": "string",         // Tipo de campo: "public" o "private"
                "name": "string",         // Nombre del campo personalizado
                "value": "string",        // Valor predeterminado del campo
                "xlsHeader": "string",    // Nombre del encabezado en Qmetry
                "qmetryHeader": "string"  // Encabezado personalizado en Qmetry (puede ser null)
            }
            // Puede agregar más objetos para otros campos personalizados
        ]
    }
}
```

**Descripción del Esquema**

- **constants**: Objeto que contiene constantes de configuración.
  - `jirabase_url`: *(string)* URL base de Jira, por ejemplo, `"https://example.atlassian.net"`.

- **fields**: Objeto que contiene la configuración de los campos personalizados.
  - `testcase`: Arreglo de objetos que definen los campos personalizados para los casos de prueba.
    - `type`: *(string)* Tipo de campo, generalmente `"public"`.
    - `name`: *(string)* Nombre del campo personalizado utilizado en los archivos `.feature`.
    - `value`: *(string)* Valor predeterminado del campo.
    - `xlsHeader`: *(string)* Nombre del encabezado en el Excel de Qmetry.
    - `qmetryHeader`: *(string|null)* Encabezado personalizado en Qmetry; puede ser `null` si no se utiliza.

## Acciones Disponibles

A continuación se detallan las acciones disponibles junto con sus configuraciones necesarias:

| Herramienta        | Descripción                         | Estado        | Enlace                                         |
| ------------------ | ----------------------------------- | ------------- | ---------------------------------------------- |
| Importar Testcase  | Carga masiva de casos de prueba     | Implementado  | [Documentación](./public/import_testcase.md)     |


## :page_facing_up: License

[MIT](/LICENSE.txt)

<p align="center">
    <a href="https://github.com/Testman-Labs/testman-qmetry">
        <img src="http://randojs.com/images/barsSmall.gif" alt="Animated footer bars" width="100%"/>
    </a>
</p>
<br/>