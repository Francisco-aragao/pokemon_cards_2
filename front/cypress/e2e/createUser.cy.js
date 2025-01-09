// cypress/e2e/createUser.cy.js
describe('Create User Page Tests', () => {
  beforeEach(() => {
      // Visit the create user page before each test
      cy.visit('/create');
  });

  it('should display the create user form', () => {
      cy.get('form').should('exist');
      cy.get('input[type="text"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Create User');
  });

  it('should create a new user with valid credentials', () => {
    cy.get('input[type="text"]').type('newUser');
    cy.get('input[type="password"]').type('newPassword');
  
    cy.intercept('POST', '/api/createUser', {
      statusCode: 200, 
      body: true, 
    }).as('createUser');
  
    cy.get('form').submit();
  
    cy.wait('@createUser');
  
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, newUser').should('exist');
  });

  it('should show an error with short password', () => {

      cy.get('input[type="text"]').type('invalidUser');
      cy.get('input[type="password"]').type('short');

      cy.intercept('POST', '/api/createUser', {
          statusCode: 400,
          body: { message: 'Password too short"' },
      }).as('createUserFail');

      cy.get('form').submit();

      cy.wait('@createUserFail');

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.contains('Error Create User: Password too short');
      });
  });
});
