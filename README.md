# cucumber-stagehand-core

Framework de automatización híbrido (Cucumber + TypeScript) que combina la velocidad de Playwright con un paso específico de validación impulsado por IA, integrado mediante Stagehand.

## Características

- Velocidad Playwright: sesiones de navegador vía CDP para navegación y acciones rápidas y estables.
- Paso con IA (Stagehand): validación inteligente de la UI usando `stagehand.extract()` y esquemas `zod`.
- BDD con Cucumber: escenarios legibles en Gherkin y reportes HTML/JSON listos para CI.
- TypeScript first: `ts-node` + `tsconfig-paths` en tiempo de ejecución.
- Docker opcional: ejecución reproducible con Chrome preinstalado.

## Requisitos

- Node.js 18+ (recomendado)
- pnpm (o npm)
- Google Chrome instalado (local) o usar Docker
- Clave de Google Generative AI para el modelo Gemini (ver `.env.example`)

## Instalación

```sh
npm install -g pnpm
pnpm install
```

## Configuración (.env)

Variables soportadas (ver `.env.example`):

- `GOOGLE_GENERATIVE_AI_API_KEY`: clave para el proveedor de IA.
- `GEMINI_MODEL`: modelo (por defecto definido en `src/index.ts`, p.ej. `google/gemini-2.5-flash`).
- `URL_BASE`: URL base de la tienda a probar.

Crear el archivo de entorno:

```sh
cp .env.example .env
```

## Scripts

- `pnpm test`: ejecuta Cucumber (usa `cucumber.yaml`).
- `pnpm test:docker`: construye y ejecuta en Docker (Chrome preinstalado) y limpia.

Notas para Windows:

- El script `test` usa `sh -c`, por lo que se recomienda ejecutarlo desde Git Bash o WSL. Alternativa directa:

```bash
npx cucumber-js
```

## Ejecución de pruebas

Local:

```sh
pnpm test
```

Con Docker (recomendado para CI):

```sh
pnpm test:docker
```

Reportes generados:

- `cucumber-report.html`
- `cucumber-report.json`

## Cómo funciona el paso con IA

En Gherkin, puedes definir reglas de validación en un DocString y validarlas con un único paso:

```gherkin
Then valido con IA que la vista actual cumple con las siguientes reglas:
	"""
	1. Confirma que el subtotal sea mayor a 0.
	2. Hay al menos 1 producto en el carrito.
	3. La divisa es dólares.
	"""
```

La implementación usa `Stagehand` para “mirar” la vista actual y evaluar cada regla contra un esquema `zod`:

```ts
// features/step_definitions/common.steps.ts
const validationSchema = z.object({
  ok: z.boolean().describe("¿Se cumple la regla?"),
  reason: z.string().describe("Explicación breve"),
});

const { ok, reason } = await this.stagehand.extract(
  `Analiza la vista actual y valida: '${rule}'`,
  validationSchema,
  { page: this.page },
);
```

Si `ok` es `false`, el escenario falla con la razón devuelta por la IA.

## Arquitectura rápida

- Sesión de navegador: `src/core/BrowserSession.ts` crea una sesión Playwright conectada al navegador de Stagehand (CDP) y la expone en el `World`.
- World + hooks: `features/support/world.ts` y `features/support/hooks.ts` inicializan `stagehand` y `page`, y capturan pantallas en fallos.
- Repositorio Stagehand: `src/repositories/index.ts` define la configuración (modelo, modo LOCAL, launch options).
- Configuración Cucumber: `cucumber.yaml` habilita `ts-node`, `tsconfig-paths` y reportes HTML/JSON.

## Estructura del proyecto

- `features/checkout.feature`: escenario de ejemplo con validación IA.
- `features/step_definitions/checkout.steps.ts`: navegación y acciones de carrito (Playwright).
- `features/step_definitions/common.steps.ts`: paso genérico de validación con IA (Stagehand + Zod).
- `features/support/hooks.ts` y `features/support/world.ts`: inicialización y utilidades de test.
- `src/core/BrowserSession.ts`: sesión Playwright conectada a Stagehand.
- `src/index.ts`: configuración por defecto (`GEMINI_MODEL`, `URL_BASE`).
- `cucumber.yaml`: configuración de Cucumber.
- `dockerfile` y `docker-compose.yml`: ejecución en contenedor con Chrome.

## Consejos y solución de problemas

- “No se abre el navegador local”: instala Google Chrome. En Docker ya viene preinstalado y se define `CHROME_PATH`.
- Windows PowerShell: si `pnpm test` no arranca, usa Git Bash/WSL o ejecuta `npx cucumber-js` directamente.
- Reportes: abre `cucumber-report.html` al finalizar para inspeccionar los resultados.

## Licencia

Apache-2.0. Ver `LICENSE`.
