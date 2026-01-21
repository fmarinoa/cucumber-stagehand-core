Feature: Validación de Carrito de Compras

  Scenario Outline: Agregar producto y validar beneficios visuales con IA
    Given navego a la tienda de demostración "https://sauce-demo.myshopify.com"
    When agrego el producto "<product_name>" al carrito usando selectores nativos
    Then verifico con IA que el carrito cumpla las siguientes reglas:
      """
      0. Abre el panel del carrito de compras.
      1. Confirma que el subtotal sea mayor a $0.
      2. Verifica si aparece algún mensaje visual sobre "CHECK OUT" o "IR A COMPRAR".
      3. Extrae el nombre exacto del producto añadido.
      """

    Examples:
      | product_name |
      | Grey jacket  |
