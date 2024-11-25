describe('Home Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the home page', () => {
        cy.get('.header').should('exist');
        cy.get('.explore-menu').should('exist');
        cy.get('.food-display').should('exist');
        cy.get('.app-download').should('exist');
    });

    it('should change category when ExploreMenu is used', () => {
        cy.get('.explore-menu-list-item').first().click();
        cy.get('.food-display-list').children().should('have.length.greaterThan', 0);
    });

    it('should display food items in FoodDisplay', () => {
        cy.get('.food-display-list').children().should('have.length.greaterThan', 0);
    });

    it('should show app download section', () => {
        cy.get('.app-download').should('contain.text', 'ARTESANÍAS');
    });
});