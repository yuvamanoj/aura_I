describe('Load Credentials ', () => {

    it('should login and load credentials', () => {
        const realUsername = 'admin\\test';
        const realPassword = 'test';
        cy.intercept('POST', '/login', {fixture: 'Login.json'}).as('Login')
        cy.intercept('GET', '/api/credentials', {fixture: 'credentials.json'}).as('Credentials')
        cy.visit('/');
        cy.get('[data-cy=username]').click();
        cy.get('[data-cy=username]').type(realUsername);
        cy.get('[data-cy=password]').click();
        cy.get('[data-cy=password]').type(realPassword);
        cy.get('[data-cy=submit]').click();
        cy.wait('@Credentials').its('response.statusCode').should('eq', 200)

      });

      it('Should open dropdown and select', () => {
        cy.wait(2000);
        cy.get("#allCustomers").click()
        cy.get("#allCustomers").type('Bane\n')
        // 4 rows should be present
        cy.get('[data-cy=row1]').should('exist')
        cy.get('[data-cy=row3]').should('exist')
        cy.get('[data-cy=row4]').should('not.exist')
      })

      it('Should type in search box and filter list', () => {
        cy.wait(1000);
        cy.get("[data-cy=tableSearch]").type("127")
        cy.get('[data-cy=row1]').should('not.exist')
        
      })

      it('Reset the list to 10 items', () => {
        cy.wait(2000);
        cy.get("[data-cy=tableSearch]").clear()
        cy.get('[data-cy=row9]').should('exist')
        cy.get('[data-cy=row10]').should('not.exist')
        
      })

      it('Should open Checkout credentials modal', () => {
        cy.get("[data-cy=checkout-modal]").should('exist')
        cy.get("[data-cy=checkout-modal]").should('not.be.visible')
        cy.get("[data-cy=checkout-btn-0]").click()
        cy.get("[data-cy=checkout-modal]").should('be.visible')
       
      })

      it('Should Checkout Modal present', () => {
        cy.get("[data-cy=checkout-modal]").should('exist')
        cy.get("[data-cy=checkout-modal]").should('be.visible')
       
      })

      it('Should Checkout a credentials', () => {
        cy.get("[data-cy=checkout-btn-0]").click()
        cy.get("[data-cy=checkout-textarea]").type("test comment");
      })


})