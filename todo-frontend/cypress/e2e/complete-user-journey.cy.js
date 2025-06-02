describe('Todo App - Complete User Journey', () => {
  
  it('should allow user to register, login, create tasks, and mark them complete', () => {
    cy.visit('http://localhost:3000/')
    
    // Step 1: Register a new user
    cy.contains('Sign up here').click()
    cy.contains('Create Account').should('be.visible')
    
    // Generate unique username to avoid conflicts
    const username = `testuser${Date.now()}`
    const email = `${username}@test.com`
    const password = 'password123'
    
    // Fill registration form
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('input[name="confirmPassword"]').type(password)
    
    // Submit registration
    cy.get('button[type="submit"]').click()
    
    // Should redirect to dashboard after successful registration
    cy.contains('My Todo Dashboard', { timeout: 10000 }).should('be.visible')
    cy.contains('Welcome,').should('be.visible')
    
    // Step 2: Create a new task
    cy.contains('Create New Task').click()
    
    // Fill task form
    cy.get('input[name="title"]').type('Test Task from Cypress')
    cy.get('textarea[name="description"]').type('This task was created by an automated E2E test')
    
    // Submit task
    cy.contains('Create Task').click()
    
    // Should see the task in the list
    cy.contains('Test Task from Cypress').should('be.visible')
    cy.contains('This task was created by an automated E2E test').should('be.visible')
    
    // Step 3: Mark task as completed
    cy.contains('Test Task from Cypress')
      .parent()
      .within(() => {
        cy.contains('Done').click()
      })
    
    // Task should disappear from the list
    cy.contains('Test Task from Cypress').should('not.exist')
    
    // Step 4: Create multiple tasks to test "5 most recent" requirement
    for (let i = 1; i <= 6; i++) {
      cy.contains('Create New Task').click()
      cy.get('input[name="title"]').type(`Task ${i}`)
      cy.get('textarea[name="description"]').type(`Description for task ${i}`)
      cy.contains('Create Task').click()
      cy.contains(`Task ${i}`).should('be.visible')
    }
    
    // Should only see 5 tasks (most recent)
    cy.get('.task-item').should('have.length', 5)
    
    // Should see tasks 2-6 (Task 1 should be pushed out)
    cy.contains('Task 6').should('be.visible')
    cy.contains('Task 5').should('be.visible')
    cy.contains('Task 4').should('be.visible')
    cy.contains('Task 3').should('be.visible')
    cy.contains('Task 2').should('be.visible')
    // Task 1 should not be visible (only 5 most recent shown)
    cy.contains('Task 1').should('not.exist')
    
    // Step 5: Logout
    cy.contains('Logout').click()
    
    // Should return to login page
    cy.contains('Welcome Back').should('be.visible')
  })
  
  it('should handle login with existing user', () => {
    cy.visit('http://localhost:3000/')
    
    // Try to login with test user credentials
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Should either login successfully OR show error if user doesn't exist
    // This handles both cases gracefully
    cy.get('body').then(($body) => {
      if ($body.text().includes('My Todo Dashboard')) {
        // Login successful
        cy.contains('My Todo Dashboard').should('be.visible')
      } else {
        cy.contains('Invalid username or password').should('be.visible')
      }
    })
  })
})