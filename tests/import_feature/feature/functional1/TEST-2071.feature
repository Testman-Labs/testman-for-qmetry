#[estimated]=00:10:05
Feature: TEST-2271: Consultas Polizas
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
    
    Scenario: 4. Happy Path - Login NO ACTIVADO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app


    Scenario: 5. Happy Path - Login VENCIDO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app

    Scenario Outline: 6. Registro de Usuario Unico
        Given el usuario identificado como <username>,
        When se identifica en el portal,
        Then se acceso al recurso-<id>.
        Examples:
            | id | username |
            | 4  | user4    |
            | 5  | user5    |

    Scenario Outline: <id> Registro de Usuario
        Given el usuario identificado como <username>,
        When se identifica en el portal,
        Then se acceso al recurso-<id>.
        Examples:
            | id | username |
            | 1  | user1    |
            | 2  | user2    |
            | 3  | user3    |