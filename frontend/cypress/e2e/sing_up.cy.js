function generateRandomUser() {
    const randomString = Math.random().toString(36).substring(2, 8); // Genera una cadena aleatoria de 6 caracteres
    const username = `tester_${randomString}`;
    const email = `${randomString}@tester.com`;
    return { username, email };
  }
  
  describe('User Registration Tests', () => {
    let username;
    let email;
  
    beforeEach(() => {
      cy.visit('/');
      cy.get('button').contains('sign in').click();
    });
  
    it('should sign up a new user', () => {
      const user = generateRandomUser();
      username = user.username;
      email = user.email;
  
      cy.get('input[name=name]').type(username);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type('passtest132');
      cy.get('input[type=checkbox]').check();
      cy.get('button').contains('Create account').click();
  
      // Assuming a successful registration redirects to the home page
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    it('should show an error for existing user', () => {
      // Use the same email generated in the previous test
      cy.get('input[name=name]').type(username);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type('passtest132');
      cy.get('input[type=checkbox]').check();
      cy.get('button').contains('Create account').click();
  
      // Assuming the application shows an error message for existing email
      cy.contains('User already exists').should('be.visible');
    });
  });