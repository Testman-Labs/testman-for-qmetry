#[estimated]=00:10:05
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña

    Scenario: 1. Happy Path - Login NO ACTIVADO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app


    Scenario: 2. Happy Path - Login VENCIDO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app

    Scenario Outline: 3. Registro de Usuario Unico
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