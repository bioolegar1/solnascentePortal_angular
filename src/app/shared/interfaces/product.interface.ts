// ─────────────────────────────────────────────
// Alérgenos suportados
// ─────────────────────────────────────────────
export type Allergen = 'gluten' | 'soja' | 'lactose';

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Glúten',
  soja: 'Soja',
  lactose: 'Lactose',
};

// ─────────────────────────────────────────────
// Unidade de medida (peso OU volume)
// ─────────────────────────────────────────────
export type MeasureUnit = 'g' | 'ml';

export interface Measure {
  value: number; // ex: 500
  unit: MeasureUnit; // 'g' para gramas | 'ml' para mililitros
}

// ─────────────────────────────────────────────
// Produto
// ─────────────────────────────────────────────
export interface Product {
  id: string;
  name: string; // Nome do produto
  barcode: string; // Código de barras (EAN)
  description: string; // Descrição
  category: string; // Slug da categoria
  package_qty: number; // Unidades por embalagem/caixa
  measure: Measure; // Peso ou volume
  images: string[]; // Até 3 caminhos: ['assets/images/products/nome.jpg']
  allergens: Allergen[]; // [] se não contém nenhum
}

// ─────────────────────────────────────────────
// Categoria
// ─────────────────────────────────────────────
export interface Category {
  id: string;
  name: string; // ex: 'Temperos'
  slug: string; // ex: 'temperos'
}
