describe('Users Index Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Alice',
          email: 'alice@email.com',
          role: 'USER',
          createdAt: '2024-01-01',
          _count: { loans: 2 }
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@email.com',
          role: 'ADMIN',
          createdAt: '2024-01-02',
          _count: { loans: 0 }
        }
      ]
    }).as('getUsers')
    cy.visit('/users')
  })

  it('should display the mocked user cards', () => {
    cy.wait('@getUsers')
    // Check the number of user cards
    cy.get('.grid > div.bg-white').should('have.length', 2)
    // Check Alice's card
    cy.contains('Alice')
      .parents('div.bg-white')
      .should('contain', 'alice@email.com')
      .and('contain', 'USER')
      .and('contain', 'Loans: 2')
    // Check Bob's card
    cy.contains('Bob')
      .parents('div.bg-white')
      .should('contain', 'bob@email.com')
      .and('contain', 'ADMIN')
      .and('contain', 'Loans: 0')
  })
})

// describe('Users Management', () => {
//   beforeEach(() => {
//     cy.visit('/users')
//   })

//   it('should display users page with add button', () => {
//     cy.get('header').should('contain', 'Users')
//     cy.get('button').should('contain', 'Add User')
//   })

//   it('should add a new user', () => {
//     const userName = 'Test User'
//     const userEmail = 'test@example.com'

//     // Click add button
//     cy.get('button').contains('Add User').click()

//     // Fill the form
//     cy.get('input[name="name"]').type(userName)
//     cy.get('input[name="email"]').type(userEmail)
//     cy.get('input[name="password"]').type('password123')

//     // Submit the form
//     cy.get('button').contains('Register User').click()

//     // Verify the user was added
//     cy.contains(userName).should('exist')
//     cy.contains(userEmail).should('exist')
//   })

//   it('should edit an existing user', () => {
//     // First add a user
//     const originalName = 'Original User'
//     const originalEmail = 'original@example.com'
//     const newName = 'Updated User'
//     const newEmail = 'updated@example.com'

//     // Add user
//     cy.get('button').contains('Add User').click()
//     cy.get('input[name="name"]').type(originalName)
//     cy.get('input[name="email"]').type(originalEmail)
//     cy.get('input[name="password"]').type('password123')
//     cy.get('button').contains('Register User').click()

//     // Edit the user
//     cy.contains(originalName).parent().find('button').contains('Edit').click()

//     // Update the form
//     cy.get('input[name="name"]').clear().type(newName)
//     cy.get('input[name="email"]').clear().type(newEmail)

//     // Save changes
//     cy.get('button').contains('Save Changes').click()

//     // Verify the user was updated
//     cy.contains(newName).should('exist')
//     cy.contains(newEmail).should('exist')
//     cy.contains(originalName).should('not.exist')
//   })

//   it('should delete a user', () => {
//     // First add a user
//     const userName = 'User to Delete'
//     const userEmail = 'delete@example.com'

//     // Add user
//     cy.get('button').contains('Add User').click()
//     cy.get('input[name="name"]').type(userName)
//     cy.get('input[name="email"]').type(userEmail)
//     cy.get('input[name="password"]').type('password123')
//     cy.get('button').contains('Register User').click()

//     // Verify user exists
//     cy.contains(userName).should('exist')

//     // Delete the user
//     cy.contains(userName).parent().find('button').contains('Delete').click()

//     // Confirm deletion
//     cy.get('button').contains('Confirm').click()

//     // Verify user was deleted
//     cy.contains(userName).should('not.exist')
//   })

//   it('should close modal when cancel is clicked', () => {
//     cy.get('button').contains('Add User').click()
//     cy.get('button').contains('Cancel').click()
//     cy.get('input[name="name"]').should('not.exist')
//   })

//   it('should validate email format', () => {
//     cy.get('button').contains('Add User').click()
//     cy.get('input[name="name"]').type('Test User')
//     cy.get('input[name="email"]').type('invalid-email')
//     cy.get('input[name="password"]').type('password123')
//     cy.get('button').contains('Register User').click()

//     // Should show validation error or not submit
//     cy.get('input[name="email"]').should('exist')
//   })
// })
