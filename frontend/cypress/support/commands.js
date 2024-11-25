Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
});

Cypress.Commands.add('setState', (state) => {
    cy.window().then((win) => {
        win.store.dispatch({ type: 'SET_STATE', payload: state });
    });
});