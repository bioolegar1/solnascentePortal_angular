# 📌 Contexto para Próxima Sessão — Sol Nascente Portal

Este arquivo serve como guia para as tarefas pendentes na próxima sessão de desenvolvimento.

## ✅ O que foi concluído hoje
- **Regras de Negócio (Embalagens):** Atualizadas as quantidades por caixa (`package_qty`) conforme o padrão industrial:
    - Farofas: 20x1.
    - Condimentos e Confeitos (> 30g): 6x1.
    - Condimentos pequenos (5g a 20g): 10x1.
- **Novos Produtos:** Ketchup Sol Nascente 200g e Maionese 200g adicionados e vinculados às imagens.
- **Organização de Dados:** Todo o catálogo (`products.json`) foi reordenado em **ordem alfabética** dentro de cada categoria oficial.
- **Correções de Ativos:** Corrigidos caminhos de imagem para Temperos em Pasta e itens de gramatura maior (Granel), com normalização de nomes de pastas (underscores).

## 🔜 Próximas Etapas

### 1. Revisão de Metadados
- Verificar se as descrições dos novos produtos de 200g e itens de gramatura maior estão completas.
- Validar os códigos de barras (`barcode`) caso novos dados sejam fornecidos.

### 2. Melhorias na Experiência do Usuário (Opcional)
- Implementar filtros avançados por marca (Sol Nascente vs Delícia).
- Adicionar uma seção de "Destaques" ou "Mais Vendidos" na Home.

## 💡 Lembretes Importantes
- O servidor local deve ser iniciado sempre com `npm start`.
- Manter o padrão de ordenação alfabética ao adicionar manualmente novos produtos no futuro.

---
*Documento atualizado após refinamento de regras de negócio e ordenação do catálogo.*
