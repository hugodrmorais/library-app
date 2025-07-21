# Cypress E2E Testing Guide

## 📋 Passo a Passo para Configurar Cypress

### 1. Instalação
```bash
npm install --save-dev cypress
```

### 2. Configuração Inicial
```bash
npx cypress open
```
- Isso abre o Cypress pela primeira vez e cria a estrutura de pastas
- Escolha "E2E Testing" quando perguntado

### 3. Estrutura de Pastas Criada
```
cypress/
├── e2e/           # Testes E2E
├── fixtures/      # Dados de teste
├── support/       # Comandos customizados
└── downloads/     # Downloads dos testes
```

### 4. Configuração do Cypress (cypress.config.ts)
```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
})
```

### 5. Scripts no package.json
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

## 🚀 Como Executar os Testes

### Modo Interativo (com interface gráfica)
```bash
npm run test:e2e:open
# ou
npx cypress open
```

### Modo Headless (linha de comando)
```bash
npm run test:e2e
# ou
npx cypress run
```

### Executar um teste específico
```bash
npx cypress run --spec "cypress/e2e/books.cy.ts"
```

## 📝 Estrutura dos Testes

### Exemplo de Teste Básico
```typescript
describe('Books Management', () => {
  beforeEach(() => {
    cy.visit('/books')
  })

  it('should add a new book', () => {
    cy.get('button').contains('Add Book').click()
    cy.get('input[placeholder*="title"]').type('Test Book')
    cy.get('input[placeholder*="author"]').type('Test Author')
    cy.get('button').contains('Save').click()
    cy.contains('Test Book').should('exist')
  })
})
```

## 🛠️ Comandos Cypress Mais Usados

### Navegação
```typescript
cy.visit('/books')           // Visitar página
cy.url().should('include', '/books')  // Verificar URL
cy.go('back')               // Voltar página
cy.reload()                 // Recarregar página
```

### Seletores
```typescript
cy.get('button')                    // Por tag
cy.get('.class-name')              // Por classe
cy.get('#id-name')                 // Por ID
cy.get('[data-testid="btn"]')      // Por data-testid
cy.contains('texto')               // Por texto
cy.get('button').contains('Save')  // Combinação
```

### Interações
```typescript
cy.get('input').type('texto')      // Digitar
cy.get('button').click()           // Clicar
cy.get('select').select('option')  // Selecionar
cy.get('input').clear()            // Limpar
cy.get('input').focus()            // Focar
```

### Assertions
```typescript
cy.get('h1').should('contain', 'Books')     // Conter texto
cy.get('button').should('exist')            // Existir
cy.get('input').should('be.visible')        // Estar visível
cy.get('button').should('be.disabled')      // Estar desabilitado
cy.contains('texto').should('not.exist')    // Não existir
```

### Esperas
```typescript
cy.wait(1000)                     // Esperar tempo fixo
cy.get('button').should('exist')  // Esperar elemento existir
cy.intercept('GET', '/api/books').as('getBooks')  // Interceptar API
cy.wait('@getBooks')              // Esperar requisição
```

## 📊 Testes Criados

### 1. Dashboard (cypress/e2e/dashboard.cy.ts)
- ✅ Verificar navegação entre páginas
- ✅ Verificar links do menu

### 2. Books (cypress/e2e/books.cy.ts)
- ✅ Adicionar livro
- ✅ Editar livro
- ✅ Deletar livro
- ✅ Validação de campos
- ✅ Fechar modal

### 3. Users (cypress/e2e/users.cy.ts)
- ✅ Adicionar usuário
- ✅ Editar usuário
- ✅ Deletar usuário
- ✅ Validação de email
- ✅ Fechar modal

### 4. Loans (cypress/e2e/loans.cy.ts)
- ✅ Adicionar empréstimo
- ✅ Editar empréstimo
- ✅ Deletar empréstimo
- ✅ Validação de campos
- ✅ Fechar modal

## 🔧 Comandos Customizados

### Adicionados em cypress/support/commands.ts
```typescript
cy.addBook('Title', 'Author')           // Adicionar livro
cy.addUser('Name', 'email@test.com')    // Adicionar usuário
cy.addLoan('Book', 'User', '2025-01-15') // Adicionar empréstimo
cy.deleteItem('books', 'Title')         // Deletar item
```

## 📱 Configurações de Viewport

### Desktop
```typescript
cy.viewport(1280, 720)
```

### Mobile
```typescript
cy.viewport('iphone-x')
cy.viewport('samsung-s10')
```

## 🎯 Boas Práticas

### 1. Usar data-testid
```html
<button data-testid="add-book-btn">Add Book</button>
```
```typescript
cy.get('[data-testid="add-book-btn"]').click()
```

### 2. Organizar testes
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup comum
  })

  it('should do something', () => {
    // Teste específico
  })
})
```

### 3. Limpar dados entre testes
```typescript
beforeEach(() => {
  // Limpar banco de dados ou localStorage
  cy.clearLocalStorage()
})
```

### 4. Usar fixtures para dados
```typescript
// cypress/fixtures/books.json
{
  "book": {
    "title": "Test Book",
    "author": "Test Author"
  }
}

// No teste
cy.fixture('books').then((data) => {
  cy.get('input[name="title"]').type(data.book.title)
})
```

## 🚨 Troubleshooting

### Problema: Teste falha por timing
```typescript
// Solução: Aumentar timeout
cy.get('button', { timeout: 10000 }).click()
```

### Problema: Elemento não encontrado
```typescript
// Solução: Verificar se elemento existe antes
cy.get('button').should('exist').then(($btn) => {
  if ($btn.length) {
    cy.wrap($btn).click()
  }
})
```

### Problema: Teste flaky (inconsistente)
```typescript
// Solução: Usar retry-ability
cy.get('button').should('be.visible').click()
```

## 📈 Relatórios

### Gerar relatório HTML
```bash
npx cypress run --reporter mochawesome
```

### Screenshots automáticos
```typescript
// Configurado em cypress.config.ts
screenshotOnRunFailure: true
```

## 🔄 CI/CD

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npm run build
    npm run start &
    npm run test:e2e
```

### Vercel
```json
{
  "scripts": {
    "test:e2e": "start-server-and-test dev http://localhost:3000 cypress:run"
  }
}
```

## 📚 Recursos Adicionais

- [Documentação Oficial Cypress](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Testing Strategies](https://docs.cypress.io/guides/core-concepts/testing-strategies)
