describe('Add to Cart Tests', () => {
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
            cy.get('p').contains('Subtotal').next().should('contain', '$40'); // Replace with actual subtotal
            cy.get('p').contains('Delivery Fee').next().should('contain', '$50'); // Replace with actual delivery fee
            cy.get('b').contains('Total').next().should('contain', '$90'); // Replace with actual total
        });
    });
});