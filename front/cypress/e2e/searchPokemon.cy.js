describe('Search Pokemon Navigation and Display', () => {
    it('should return the pokemon data for a valid pokemon', () => {
        cy.visit('/');
        
        cy.get('input[type="text"]').type('pikachu');
      
        cy.get('form').submit();

        cy.wait(1500);
      
        cy.contains('electric').should('exist');
        cy.contains('static, lightning-rod').should('exist');
      });
      it('should show an error for a non-existing pokemon', () => {
        cy.visit('/');
        
        cy.get('input[type="text"]').type('nopokemon');
      
        cy.get('form').submit();

        cy.wait(1500);
      
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.contains('Error fetching Pokémon dataFailed to fetch Pokémon.');
          });
      });
  });