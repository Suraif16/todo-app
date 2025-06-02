describe('Todo App - Basic Functionality', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should load the login page', () => {
    // Check if we're on the login page
    cy.contains('Welcome Back').should('be.visible')
    cy.contains('Sign in to your account').should('be.visible')
    
    // Check if login form elements exist
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
  })

  it('should show validation errors for empty login', () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').click()
    
    // Should show validation errors
    cy.contains('Username is required').should('be.visible')
    cy.contains('Password is required').should('be.visible')
  })

  it('should navigate to register page', () => {
    // Click the register link
    cy.contains('Sign up here').click()
    
    // Should be on register page
    cy.contains('Create Account').should('be.visible')
    cy.contains('Sign up to get started').should('be.visible')
  })
})