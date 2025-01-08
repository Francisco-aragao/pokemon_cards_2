// cypress/e2e/login.cy.js
describe('Login Page Tests', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/login');
    });
  
    it('should display the login form', () => {
      cy.get('form').should('exist');
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });
  
    it('should login with valid credentials', () => {
      // Fill in the login form
      cy.get('input[name="username"]').type('testUser');
      cy.get('input[name="password"]').type('testPassword');
      
      // Submit the form
      cy.get('form').submit();
  
      // Verify navigation to the dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome, testUser').should('exist');
    });
  
    it('should display an error with invalid credentials', () => {
      cy.get('input[name="username"]').type('wrongUser');
      cy.get('input[name="password"]').type('wrongPassword');
      
      cy.get('form').submit();
      
      // Assuming your app shows an error message on failed login
      cy.contains('Invalid username or password').should('exist');
    });
  });
  