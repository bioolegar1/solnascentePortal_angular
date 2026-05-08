# 🌅 Sol Nascente — Portal do Catálogo

Este projeto é um portal institucional e catálogo digital de produtos para a **Sol Nascente Comércio e Indústria de Produtos Alimentícios**. É uma aplicação Angular estática que consome dados de arquivos JSON locais.

## 🚀 Tecnologias e Arquitetura

- **Framework:** Angular 21.2 (usando standalone components e Signals).
- **Linguagem:** TypeScript 5.9.
- **Estilização:** SCSS (SASS) com variáveis globais em `src/styles/_variables.scss`.
- **Estado:** Reatividade baseada em `Signals` do Angular.
- **Dados:** Arquivos JSON estáticos em `src/assets/data/`.
- **Hospedagem:** Vercel (deploy automático via Git).

## 📁 Estrutura do Projeto

- `src/app/core/services/`: Serviços para leitura dos dados JSON (`products.service.ts`, `categories.service.ts`).
- `src/app/pages/`: Páginas principais da aplicação (`home`, `produtos`, `historia`, `contato`).
- `src/app/shared/`: Componentes de layout (`default-layout`) e interfaces de dados.
- `src/assets/data/`: Fonte de verdade do catálogo (`products.json`, `categories.json`).
- `src/assets/images/products/`: Imagens dos produtos exibidos no catálogo.

## ⚙️ Comandos Úteis

- **Instalar Dependências:** `npm install`
- **Desenvolvimento:** `npm start` ou `ng serve` (Acesse em `http://localhost:4200`)
- **Build de Produção:** `npm run build`
- **Testes:** `npm test` (Utiliza Vitest)

## 🛠️ Convenções de Desenvolvimento

- **Componentes:** Prefira o uso de `standalone: true` (padrão no Angular 21) e `Signals` para gerenciamento de estado local.
- **Estilos:** Utilize as variáveis definidas em `src/styles/_variables.scss` para manter a consistência visual. Cada componente deve ter seu próprio arquivo `.scss`.
- **Tipagem:** Sempre utilize as interfaces definidas em `src/app/shared/interfaces/product.interface.ts`.
- **Atualização do Catálogo:** A atualização de produtos é feita editando diretamente os arquivos em `src/assets/data/` e adicionando imagens em `src/assets/images/products/`.

## 🛍️ Como adicionar um novo produto

1. Adicione as imagens em `src/assets/images/products/` (recomendado `.webp` ou `.jpg`).
2. Edite `src/assets/data/products.json` seguindo a interface `Product`.
3. Verifique se a categoria existe em `src/assets/data/categories.json`.
4. Faça o `git push` para que a Vercel realize o deploy automático.
