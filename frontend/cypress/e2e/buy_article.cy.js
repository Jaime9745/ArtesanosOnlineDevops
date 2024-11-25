function generateRandomUser() {
    const randomString = Math.random().toString(36).substring(2, 8); // Genera una cadena aleatoria de 6 caracteres
    const username = `tester_${randomString}`;
    const email = `${randomString}@tester.com`;
    return { username, email };
}

describe('Add to Cart and Purchase Tests', () => {
    let username;
    let email;

    beforeEach(() => {
        cy.visit('/');
    });

    it('should add a product to the cart and verify the cart', () => {
        // Assuming the first product in the FoodDisplay is the one we want to add
        cy.get('.food-display-list .food-item').first().within(() => {
            cy.get('.add').click();
        });

        // Verify the cart icon shows the correct number of items
        cy.get('.navbar-search-icon .dot').should('exist');

        // Navigate to the cart page
        cy.get('.navbar-search-icon').click();

        // Verify the product is in the cart
        cy.get('.cart-items-item').should('have.length', 1);
        cy.get('.cart-items-item').first().within(() => {
            cy.get('p').contains('Ceramica'); // Replace with actual product title
            cy.get('p').contains('$40'); // Replace with actual product price
        });

        // Verify the cart totals
        cy.get('.cart-total-details').each($div => {
            cy.get('p').contains('Subtotal').parent().should('contain', '$40'); // Replace with actual subtotal
            cy.get('p').contains('Delivery Fee').parent().should('contain', '$50'); // Replace with actual delivery fee
            cy.get('b').contains('Total').parent().should('contain', '$90'); // Replace with actual total
        });

        // Try to proceed to checkout without being logged in
        cy.get('button').contains('PROCEED TO CHECKOUT').click();
        cy.contains('to place an order sign in first').should('be.visible'); // Replace with actual message

        cy.get('.Toastify__close-button').click();

        // Register a new user
        const user = generateRandomUser();
        username = user.username;
        email = user.email;

        cy.get('button').contains('sign in').click();
        cy.get('input[name=name]').type(username);
        cy.get('input[name=email]').type(email);
        cy.get('input[name=password]').type('passtest132');
        cy.get('input[type=checkbox]').check();
        cy.get('button').contains('Create account').click();

        // Wait for the registration to complete

        // Navigate back to the cart page
        cy.get('.navbar-search-icon').click();

        // Proceed to checkout
        cy.get('button').contains('ROCEED TO CHECKOUT').click();

    });
});