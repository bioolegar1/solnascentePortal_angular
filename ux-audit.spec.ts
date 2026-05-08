import { test, expect, devices } from '@playwright/test';

test.describe('Full Site UX Audit', () => {
  
  // Auditoria Mobile
  test('mobile audit', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 13'].viewport);
    await page.goto('http://localhost:4200/produtos');
    
    // Captura catálogo mobile
    await page.screenshot({ path: 'audit-mobile-catalog.png' });
    
    // Testa abertura de produto e visibilidade do footer fixo
    await page.locator('.product-card').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'audit-mobile-modal.png' });
    
    // Verifica se o botão de fechar está acessível (não sobreposto)
    const closeBtn = page.locator('.btn-close-modal');
    await expect(closeBtn).toBeVisible();
    
    // Testa scroll no modal para ver se o footer permanece fixo
    await page.mouse.wheel(0, 500);
    await page.screenshot({ path: 'audit-mobile-modal-scrolled.png' });
  });

  // Auditoria Desktop
  test('desktop audit', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:4200/produtos');
    
    // Captura header e navegação
    await page.screenshot({ path: 'audit-desktop-header.png' });
    
    // Verifica o novo botão "Meu Pedido"
    const cartBtn = page.locator('.btn-cart-nav');
    await expect(cartBtn).toBeVisible();
    
    // Abre carrinho lateral
    await cartBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'audit-desktop-cart-sidebar.png' });
  });

  // Auditoria de Fluxo (UX)
  test('checkout flow audit', async ({ page }) => {
    await page.goto('http://localhost:4200/produtos');
    
    // Adiciona 2 itens de produtos diferentes
    const products = page.locator('.product-card');
    
    // Item 1
    await products.nth(0).click();
    await page.locator('.btn-add-to-cart').click();
    await page.locator('.btn-close-modal').click();
    
    // Item 2
    await products.nth(1).click();
    await page.locator('.btn-add-to-cart').click();
    await page.locator('.btn-close-modal').click();
    
    // Verifica se o FAB do carrinho apareceu
    const fab = page.locator('.cart-fab');
    await expect(fab).toBeVisible();
    await expect(fab).toContainText('2');
    
    // Abre carrinho e tira print da lista
    await fab.click();
    await page.screenshot({ path: 'audit-cart-list.png' });
  });
});
