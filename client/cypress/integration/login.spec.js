describe('Login', () => {
    const loginAndSubmit = (username, password) => {
        cy.visit('/');
        cy.wait(3000);
        cy.get('[data-cy=username]').click();
        cy.get('[data-cy=username]').type(username);
        cy.get('[data-cy=password]').click();
        cy.get('[data-cy=password]').type(password);
        cy.get('[data-cy=submit]').click();
      };

      it("should render the container in the dom", () => {
        cy.visit('/');
        cy.get("#container").should('exist');
      });

      it('should error with fake credentials', () => {
        loginAndSubmit('fakeusername@in.ibm.com', 'fake password');
        cy.get('[data-cy=InlineNotification]').should('be.visible');
      });

      it('should succeed with legit credentials', () => {
        //This will only work until we have fake login
        const realUsername = 'admin\\test';
        const realPassword = 'test';
        cy.intercept('POST', '/login', {fixture: 'Login.json'}).as('Login')
        cy.intercept('GET', '/api/credentials', {fixture: 'credentials.json'}).as('Credentials')
        loginAndSubmit(realUsername, realPassword);
        cy.get('[data-cy=Credentials-InlineNotification]').should('be.visible');
        cy.url().should('contain', `${Cypress.config().baseUrl}`);
      });

      it('should open user profile', () => {
        cy.get("#user-profile").click();
      })


});