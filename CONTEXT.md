# 📌 Contexto para Próxima Sessão — Sol Nascente Portal

Este arquivo serve como guia para as tarefas pendentes na próxima sessão de desenvolvimento.

## ✅ O que foi concluído hoje
- **Normalização de Ativos:** Todas as pastas de imagens foram renomeadas para o padrão com underscores (ex: `TEMPEROS_E_PASTAS`).
- **Sincronização de Dados:** 289+ caminhos de imagem corrigidos no `products.json` para refletir as novas pastas.
- **Novos Produtos:** Adicionados Ketchup Sol Nascente 200g, Maionese 200g e novos Sais de Parrilla (350g).
- **Regras de Unidade (Package Qty):**
    - Farofas: 20x1.
    - Condimentos (> 30g): 6x1.
    - Condimentos Pequenos (< 30g): 10x1.
- **Bug Fixes:**
    - Corrigido o carregamento de fotos de Colorau, Orégano e Pimenta (Granel).
    - Unificada a categoria "CONDIMENTO E ESPECIARIAS" (singular).
    - Removidos itens inexistentes de 10g (Edu e Chef).

## 🔜 Próximas Etapas

### 1. Finalização de Metadados
- Revisar se todos os novos itens adicionados automaticamente possuem descrições adequadas.
- Validar se o `measure` (peso/volume) de todos os itens de gramatura maior está correto.

### 2. Teste de Produção
- Verificar se as imagens carregam corretamente no ambiente de deploy (Vercel) após a normalização das pastas.

### 3. Melhorias Adicionais (Opcional)
- Adicionar filtros por marca (Delícia vs Sol Nascente).

## 💡 Lembretes Importantes
- O servidor local deve ser iniciado sempre com `npm start`.
- Manter o padrão de nomenclatura de pastas sem espaços para novos ativos.

---
*Documento atualizado após estabilização global de dados e ativos.*
