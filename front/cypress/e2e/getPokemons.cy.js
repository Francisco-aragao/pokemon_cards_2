describe('GetPokemons Navigation and Display', () => {
    it('should create a user and then get an empty list of pokemons', () => {
        cy.visit('/create');
      
        cy.contains('Create User').click();
      
        cy.intercept('POST', '/api/createUser', {
          statusCode: 200,
          body: true, 
        }).as('createUser');

        let username = 'user';
      
        cy.get('input[type="text"]').type(username);
        cy.get('input[type="password"]').type('newPassword');
        cy.get('form').submit();
      
        cy.wait('@createUser');
      
        cy.intercept('GET', `api/getPokemons/${username}`, {
            statusCode: 200,
            body: [],
        }).as('getPokemons');
        
        cy.contains('See Pokémons').click();
        cy.wait('@getPokemons');
      
        cy.contains('All Pokémon').should('exist');
      
        cy.get('[data-cy=pokemon-card]').should('have.length', 0);
      });
  
      it('should create a user, add a pokemon and then get the pokemon', () => {
        cy.visit('/create');
        cy.contains('Create User').click();
    
        cy.intercept('POST', '/api/createUser', {
          statusCode: 200,
          body: true,
        }).as('createUser');

        let username = 'user';
    
        cy.get('input[type="text"]').type(username);
        cy.get('input[type="password"]').type('newPassword');
        cy.get('form').submit();
    
        cy.wait('@createUser');
    
        cy.contains('Add Pokémon').click();
    
        let pokemonName = 'pikachu';
    
        cy.intercept('POST', `/api/addPokemon/${pokemonName}`, {
          statusCode: 200,
          body: true,
        }).as('addPokemon');
    
        cy.get('input[type="text"]').type(pokemonName);
        cy.get('button[type="submit"]').click();
    
        cy.wait('@addPokemon');
    
        cy.contains(`Success! Pokémon "${pokemonName}" has been added.`).should('exist');

        cy.go('back');

        let pokemonImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

        cy.intercept('GET', `api/getPokemons/${username}`, {
            statusCode: 200,
            body: [
                { 
                    name: pokemonName, 
                    image: pokemonImage, 
                    type: 'electric', 
                    abilities: ['static', 'lightning-rod'] }
            ],
        }).as('getPokemons');
        
        cy.contains('See Pokémons').click();
        cy.wait('@getPokemons');
      
        cy.contains('All Pokémon').should('exist');
      
        cy.get('.pokemon-card').should('have.length', 1);

      });
  });
  