import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import assert from "node:assert";
import { z } from "zod";

Then(
  "valido con IA que la vista actual cumple con las siguientes reglas:",
  async function (this: CustomWorld, docstring: string) {
    const validationSchema = z.object({
      ok: z
        .boolean()
        .describe(
          "Es 'true' si la regla se cumple en la pantalla actual, de lo contrario es 'false'.",
        ),
      reason: z
        .string()
        .describe(
          "Explica brevemente tu razonamiento, mencionando qué viste para confirmar o negar la regla.",
        ),
    });

    // Divide el DocString en reglas individuales, eliminando líneas vacías y espacios.
    const rules = docstring
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    for (const rule of rules) {
      console.log(`\n🤖 Validando regla: "${rule}"`);

      const { ok, reason } = await this.stagehand.extract(
        `Analiza la vista actual de la pantalla y dime si la siguiente regla se cumple de forma estricta: '${rule}' `,
        validationSchema,
        { page: this.page },
      );

      assert(
        ok,
        `La validación de IA para la regla '${rule}' falló porque: ${reason}`,
      );
    }
  },
);
