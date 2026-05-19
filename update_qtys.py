import json

json_path = 'src/assets/data/products.json'
target_category = 'CONDIMENTO E ESPECIARIAS'
new_qty = 10

# Carregar o JSON
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

fixes_count = 0

for p in products:
    # Se o produto é da categoria alvo E o peso é menor que 30g
    if p.get('category') == target_category:
        measure = p.get('measure', {})
        if measure.get('unit') == 'g' and measure.get('value', 0) < 30:
            if p.get('package_qty') != new_qty:
                p['package_qty'] = new_qty
                fixes_count += 1

# Salvar o JSON
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Concluído! {fixes_count} produtos foram atualizados para caixa com {new_qty} unidades.")
