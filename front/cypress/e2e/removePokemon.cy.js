describe('Remove Pokemon From a User', () => {
    it('should create a user and add a Pokémon then remove it', () => {
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
    
        // Remove
        cy.go('back');

        cy.contains('Remove Pokémon').click();

        // Corrected intercept
        cy.intercept('DELETE', `/api/removePokemon/${pokemonName}`, {
            statusCode: 200,
            body: {username: 'newUser'}
        }).as('removePokemon');
    
        cy.get('input[type="text"]').type(pokemonName);
        cy.get('button[type="submit"]').click();
    
        cy.wait('@removePokemon');

        cy.contains(`Success! Pokémon "${pokemonName}" has been removed.`).should('exist');
    });
    it('should create a user then try to remove a non-existing Pokemon', () => {
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

        let pokemonName = 'nopokemon';

        cy.contains('Remove Pokémon').click();

        cy.intercept('DELETE', `/api/removePokemon/${pokemonName}`, {
            statusCode: 400, // Not found
            body: {username: 'newUser'}
        }).as('removePokemon');

        cy.get('input[type="text"]').type(pokemonName);
        cy.get('button[type="submit"]').click();

        cy.wait('@removePokemon');
  
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.contains('Error Remove Pokémon');
      });
    });
  });