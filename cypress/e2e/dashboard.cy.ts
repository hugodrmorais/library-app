describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the dashboard with navigation links', () => {
    // Check if the page loads correctly
    cy.get('h1').should('contain', 'Digital Library')

    // Check if navigation links are present
    cy.get('a[href="/books"]').should('exist').and('contain', 'Books')
    cy.get('a[href="/users"]').should('exist').and('contain', 'Users')
    cy.get('a[href="/loans"]').should('exist').and('contain', 'Loans')
  })

  it('should navigate to books page', () => {
    cy.get('a[href="/books"]').click()
    cy.url().should('include', '/books')
    cy.get('header').should('contain', 'Books')
  })

  it('should navigate to users page', () => {
    cy.get('a[href="/users"]').click()
    cy.url().should('include', '/users')
    cy.get('header').should('contain', 'Users')
  })

  it('should navigate to loans page', () => {
    cy.get('a[href="/loans"]').click()
    cy.url().should('include', '/loans')
    cy.get('header').should('contain', 'Loans')
  })
})
