Feature: Validación de Carrito de Compras

  Scenario Outline: Agregar producto y validar beneficios visuales con IA
    Given navego a la tienda
    When agrego el producto "<product_name>" al carrito
    And me dirijo a la pantalla de checkout
    Then valido con IA que la vista actual cumple con las siguientes reglas:
      """
      1. Confirma que el subtotal sea mayor a 0.
      2. Hay al menos 1 producto en el carrito.
      3. La divisa es dólares.
      """

    Examples:
      | product_name |
      | Grey jacket  |
