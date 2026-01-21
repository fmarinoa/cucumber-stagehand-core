import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect } from "@playwright/test";
import { z } from "zod";

Given(
  "navego a la tienda de demostración {string}",
  async function (this: CustomWorld, url: string) {
    await this.page.goto(url);
  },
);

When(
  "agrego el producto {string} al carrito usando selectores nativos",
  async function (this: CustomWorld, productName: string) {
    await this.page.locator(`//h3[text()='${productName}']`).first().click();
    await this.page.locator('//*[@id="add"]').click();
    console.time("Checkout");
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    console.timeEnd("Checkout");
  },
);

Then(
  "verifico con IA que el carrito cumpla las siguientes reglas:",
  async function (this: CustomWorld, instruccion: string) {
    // Definimos qué esperamos recibir de la IA
    const validationSchema = z.object({
      subtotalValido: z.boolean(),
      mensajeChekoutValidado: z.boolean(),
      nombreProductoDetectado: z.string(),
      razonamiento: z
        .string()
        .describe("Explica brevemente qué viste en el carrito"),
    });

    // LLAMADA V3: Usamos 'this.stagehand.extract', NO 'page.extract'
    const resultado = await this.stagehand.extract(
      `Analiza el panel del carrito de compras visible (cart drawer) y: ${instruccion}`,
      validationSchema,
      // Opcional: pasarle la página explícita si el foco se perdió, aunque V3 suele manejarlo.
      { page: this.page },
    );

    console.log("🤖 Análisis de IA:", resultado);

    // Aserciones de Jest/Playwright sobre los datos estructurados
    expect(
      resultado.subtotalValido,
      `Error en subtotal: ${resultado.razonamiento}`,
    ).toBe(true);

    // Ejemplo de validación flexible (la IA decide si el texto 'Free Shipping' cuenta como válido)
    // Si la tienda no tiene free shipping configurado hoy, esto podría fallar, útil para detectar regresiones de negocio.
    // expect(resultado.mensajeEnvioEncontrado).toBe(true);

    expect(resultado.nombreProductoDetectado).toContain("Backpack");
  },
);
