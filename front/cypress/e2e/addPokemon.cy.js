it('should create a user and add a Pokémon', () => {
    cy.visit('/create');
  
    cy.contains('Create User').click();
  
    cy.intercept('POST', '/api/createUser', {
      statusCode: 200,
      body: true, // Simulate a successful user creation
    }).as('createUser');
  
    cy.get('input[type="text"]').type('newUser');
    cy.get('input[type="password"]').type('newPassword');
    cy.get('form').submit();
  
    cy.wait('@createUser');
  
    cy.contains('Add Pokémon').click();
    
    let pokemonName = 'Pikachu';

    cy.intercept('POST', `/api/addPokemon/${pokemonName}`, (req) => {
        req.body = { username: 'newUser' }; // Mock the username that would be sent
        req.reply({
          statusCode: 200,
          body: true, // Simulate a successful Pokémon addition
        });
    }).as('addPokemon');
    

    cy.get('input[type="text"]').type(pokemonName);
    cy.get('button[type="submit"]').click(); // Trigger form submission
    
    cy.wait('@pokeApiCall');
    
    cy.contains('Success! Pokémon "Pikachu" has been added.').should('exist');
  
    cy.contains('Pikachu').should('exist'); // If the Pokémon name is displayed on the page */
});
