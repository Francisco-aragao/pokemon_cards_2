describe('User Login Flow', () => {
  it('should create a user and add a Pokémon', () => {
    cy.visit('/create');
    cy.contains('Create User').click();

    cy.intercept('POST', '/api/createUser', {
      statusCode: 200,
      body: true,
    }).as('createUser');

    cy.get('input[type="text"]').type('newUser');
    cy.get('input[type="password"]').type('newPassword');
    cy.get('form').submit();

    cy.wait('@createUser');

    cy.contains('Add Pokémon').click();

    let pokemonName = 'pikachu';

    // Corrected intercept
    cy.intercept('POST', `/api/addPokemon/${pokemonName}`, {
      statusCode: 200,
      body: true,
    }).as('addPokemon');

    cy.get('input[type="text"]').type(pokemonName);
    cy.get('button[type="submit"]').click();

    cy.wait('@addPokemon');

    cy.contains(`Success! Pokémon "${pokemonName}" has been added.`).should('exist');
  });
  
  it('should return an error when creating an invalid pokemon', () => {
    cy.visit('/create');
    cy.contains('Create User').click();

    cy.intercept('POST', '/api/createUser', {
      statusCode: 200,
      body: true,
    }).as('createUser');

    cy.get('input[type="text"]').type('newUser');
    cy.get('input[type="password"]').type('newPassword');
    cy.get('form').submit();

    cy.wait('@createUser');

    cy.contains('Add Pokémon').click();

    let pokemonName = 'invalid_pokemon';

    // Corrected intercept
    cy.intercept('POST', `/api/addPokemon/${pokemonName}`, {
      statusCode: 500,
      body: true,
    }).as('addPokemon');

    cy.get('input[type="text"]').type(pokemonName);
    cy.get('button[type="submit"]').click();

    cy.wait('@addPokemon');

    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains('Error fetching Pokémon data:');
    });
  });
});