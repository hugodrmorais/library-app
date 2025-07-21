// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a book
       * @example cy.addBook('Book Title', 'Author Name')
       */
      addBook(title: string, author: string): Chainable<void>

      /**
       * Custom command to add a user
       * @example cy.addUser('John Doe', 'john@example.com')
       */
      addUser(name: string, email: string): Chainable<void>

      /**
       * Custom command to add a loan
       * @example cy.addLoan('Book Title', 'User Name', '2025-01-15')
       */
      addLoan(bookTitle: string, userName: string, dueDate: string): Chainable<void>

      /**
       * Custom command to delete an item
       * @example cy.deleteItem('books', 'Book Title')
       */
      deleteItem(type: 'books' | 'users' | 'loans', title: string): Chainable<void>
    }
  }
}

// Custom command to add a book
Cypress.Commands.add('addBook', (title: string, author: string) => {
  cy.visit('/books')
  cy.get('[data-testid="add-book-btn"]').click()
  cy.get('[data-testid="book-title-input"]').type(title)
  cy.get('[data-testid="book-author-input"]').type(author)
  cy.get('[data-testid="save-book-btn"]').click()
  cy.get('[data-testid="modal"]').should('not.exist')
})

// Custom command to add a user
Cypress.Commands.add('addUser', (name: string, email: string) => {
  cy.visit('/users')
  cy.get('[data-testid="add-user-btn"]').click()
  cy.get('[data-testid="user-name-input"]').type(name)
  cy.get('[data-testid="user-email-input"]').type(email)
  cy.get('[data-testid="save-user-btn"]').click()
  cy.get('[data-testid="modal"]').should('not.exist')
})

// Custom command to add a loan
Cypress.Commands.add('addLoan', (bookTitle: string, userName: string, dueDate: string) => {
  cy.visit('/loans')
  cy.get('[data-testid="add-loan-btn"]').click()
  cy.get('[data-testid="loan-book-select"]').select(bookTitle)
  cy.get('[data-testid="loan-user-select"]').select(userName)
  cy.get('[data-testid="loan-due-date-input"]').type(dueDate)
  cy.get('[data-testid="save-loan-btn"]').click()
  cy.get('[data-testid="modal"]').should('not.exist')
})

// Custom command to delete an item
Cypress.Commands.add('deleteItem', (type: 'books' | 'users' | 'loans', title: string) => {
  cy.visit(`/${type}`)
  cy.contains(title).parent().find('[data-testid="delete-btn"]').click()
  cy.get('[data-testid="confirm-delete-btn"]').click()
  cy.contains(title).should('not.exist')
})

export {}
