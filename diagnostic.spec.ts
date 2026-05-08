import { test, expect } from '@playwright/test';

test('diagnose products page', async ({ page }) => {
  // Acessa a página de produtos
  await page.goto('http://localhost:4200/produtos');
  
  // Tira um print da página inicial
  await page.screenshot({ path: 'diagnostic-home.png', fullPage: true });

  // Verifica se o catálogo carregou
  const products = page.locator('.product-card');
  const count = await products.count();
  console.log(`Produtos encontrados: ${count}`);

  if (count > 0) {
    // Abre o primeiro produto
    await products.first().click();
    await page.waitForTimeout(1000);
    
    // Tira print do modal aberto
    await page.screenshot({ path: 'diagnostic-modal.png' });

    // Tira print específico da área que o usuário disse estar quebrada
    const footer = page.locator('.modal-fixed-footer');
    if (await footer.isVisible()) {
        await footer.screenshot({ path: 'diagnostic-footer.png' });
    } else {
        console.log('ERRO: Rodapé do modal não está visível!');
    }
  } else {
    console.log('ERRO: Nenhum produto carregado no grid!');
  }
});
