describe('CP-06 - Módulo de Consulta de Taller', () => {
  beforeEach(() => {
    // 1. Visitar la página de Login
    cy.visit('http://localhost:5173/login'); 

    // 2. Iniciar sesión con tus credenciales locales
    cy.get('input[type="email"]').type('Pedrito@gmail.com');
    cy.get('input[type="password"]').type('pedro');
    cy.get('button').contains('Iniciar Sesión').click();

    // 3. Confirmar la entrada al home
    cy.url().should('include', '/home');

    // 4. Moverse a la pantalla de búsqueda
    cy.visit('http://localhost:5173/buscarTaller');
  });

  it('Debería consultar y desplegar los datos completos del perfil del taller', () => {
    // 5. Dar clic al botón "Ver Taller" de la tarjeta disponible
    cy.contains('Ver Taller').click();

    // 6. Validar la redirección exitosa a la vista de perfil
    cy.url().should('include', '/perfilTaller');
    
    // 7. ASARCIONES TEMPORALES: Validamos los datos estáticos que están renderizados en tu pantalla
    
    // Validar nombre del taller en la cabecera
    cy.contains('Taller el chingón').should('be.visible');

    // Validar dirección en el banner
    cy.contains('AV. constituyentes, Playa del Carmen').should('be.visible');
      
    // Validar que la sección de reseñas y estrellas esté visible
    cy.contains('4.3 estrellas').should('be.visible');
    cy.contains('Reseñas de otros talleres').should('be.visible');
    
    // Validar la existencia de un comentario de la base/ejemplo
    cy.contains('Juan Pérez').should('be.visible');
  });
});