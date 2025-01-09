describe('User Login Flow', () => {
    it('should give an error when trying to login with an invalid user', () => {
        cy.visit('/');
      
        cy.contains('Login').click();
        
        cy.get('input[type="text"]').type('newUser');
        cy.get('input[type="password"]').type('newPassword');

        cy.intercept('POST', '/api/login', {
          statusCode: 401, 
          body: { error: 'Invalid username or password' },
        }).as('loginUser');
      
        cy.get('form').submit();
      
        cy.wait('@loginUser');
      
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.contains('Invalid username or password');
          });
      });
      it('should create a user and log in with valid credentials', () => {
        cy.visit('/');
      
        cy.contains('Create User').click();
      
        cy.intercept('POST', '/api/createUser', {
          statusCode: 200,
          body: true, 
        }).as('createUser');
      
        cy.get('input[type="text"]').type('newUser');
        cy.get('input[type="password"]').type('newPassword');
        cy.get('form').submit();
      
        cy.wait('@createUser');
      
        cy.contains('Logout').click();

        cy.contains('Login').click();
      
        
        cy.get('input[type="text"]').type('newUser');
        cy.get('input[type="password"]').type('newPassword');
        
        cy.intercept('POST', '/api/login', {
          statusCode: 200,
          body: { username: 'newUser', token: 'fakeToken' },
        }).as('loginUser');
        
        cy.get('form').submit();
      
        cy.wait('@loginUser');
      
        cy.url().should('include', '/dashboard');
        cy.contains('Welcome, newUser').should('exist');
      });
  });