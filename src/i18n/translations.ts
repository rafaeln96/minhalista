export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Header
    'header.logo': 'Mercado',
    'header.subtitle': 'LISTA DE COMPRAS',
    'header.generatePdf': 'Gerar PDF',
    'header.clearList': 'Limpar lista',
    'header.totalInCart': 'TOTAL NO CARRINHO',
    'header.productCount_one': '{{count}} produto',
    'header.productCount_other': '{{count}} produtos',
    'header.itemCount_one': '{{count}} item',
    'header.itemCount_other': '{{count}} itens',

    // Search Bar
    'search.placeholder': 'Buscar produtos...',
    'search.clear': 'Limpar busca',
    'search.emptyResult': 'Nenhum produto encontrado para "{{query}}"',

    // Empty State
    'empty.title': 'Carrinho vazio',
    'empty.subtitle': 'Adicione produtos conforme você vai colocando no carrinho.',
    'empty.button': 'Tirar foto ou digitar nome',

    // Product Card
    'product.defaultName': 'Produto',
    'product.photoOnly': 'Sem nome',
    'product.unit': 'un',
    'product.kg': 'kg',
    'product.g': 'g',
    'product.l': 'L',
    'product.ml': 'ml',
    'product.editLabel': 'Editar produto',
    'product.deleteLabel': 'Remover produto',
    'product.closeImage': 'Fechar foto',

    // Bottom Sheet (Add/Edit)
    'sheet.titleNew': 'Novo produto',
    'sheet.titleEdit': 'Editar produto',
    'sheet.subtitle': 'Tire uma foto ou escreva o nome',
    'sheet.photoLabel': 'FOTO',
    'sheet.nameLabel': 'NOME',
    'sheet.namePlaceholder': 'Leite, Arroz, Sabão...',
    'sheet.priceLabel': 'PREÇO UNITÁRIO',
    'sheet.quantityLabel': 'QUANTIDADE',
    'sheet.unitLabel': 'MEDIDA',
    'sheet.submitNew': '+ Adicionar ao carrinho',
    'sheet.submitEdit': 'Salvar alterações',
    'sheet.footerHint': 'Toque fora para fechar · adicione vários em sequência',

    // Confirm Modals
    'confirmDelete.title': 'Remover item?',
    'confirmDelete.message': 'Tem certeza que deseja remover {{name}} da sua lista?',
    'confirmDelete.cancel': 'Cancelar',
    'confirmDelete.confirm': 'Remover',

    'confirmClear.title': 'Limpar toda a lista?',
    'confirmClear.message': 'Você perderá todos os {{count}} produtos adicionados. Tem certeza que deseja esvaziar o carrinho?',
    'confirmClear.cancel': 'Cancelar',
    'confirmClear.confirm': 'Esvaziar',

    // Language Selector
    'lang.pt': 'PT',
    'lang.en': 'EN',
    'lang.switch': 'Mudar para Inglês',

    // PDF Generator
    'pdf.title': 'Mercado',
    'pdf.subtitle': 'LISTA DE COMPRAS',
    'pdf.issuedAt': 'EMITIDO EM',
    'pdf.totalSpent': 'TOTAL GASTO',
    'pdf.products': 'PRODUTOS',
    'pdf.units': 'UNIDADES',
    'pdf.average': 'MÉDIA',
    'pdf.listItems': 'ITENS DA LISTA',
    'pdf.thProduct': 'PRODUTO',
    'pdf.thQty': 'QTD.',
    'pdf.thUnitPrice': 'PREÇO UN.',
    'pdf.thSubtotal': 'SUBTOTAL',
    'pdf.averageTicket': 'Ticket médio por produto',
    'pdf.grandTotal': 'Total geral',
    'pdf.noName': 'Sem nome'
  },
  en: {
    // Header
    'header.logo': 'Market',
    'header.subtitle': 'SHOPPING LIST',
    'header.generatePdf': 'Export PDF',
    'header.clearList': 'Clear list',
    'header.totalInCart': 'TOTAL IN CART',
    'header.productCount_one': '{{count}} product',
    'header.productCount_other': '{{count}} products',
    'header.itemCount_one': '{{count}} item',
    'header.itemCount_other': '{{count}} items',

    // Search Bar
    'search.placeholder': 'Search products...',
    'search.clear': 'Clear search',
    'search.emptyResult': 'No products found for "{{query}}"',

    // Empty State
    'empty.title': 'Empty Cart',
    'empty.subtitle': 'Add products as you put them in your shopping cart.',
    'empty.button': 'Take photo or type name',

    // Product Card
    'product.defaultName': 'Product',
    'product.photoOnly': 'No name',
    'product.unit': 'pc',
    'product.kg': 'kg',
    'product.g': 'g',
    'product.l': 'L',
    'product.ml': 'ml',
    'product.editLabel': 'Edit product',
    'product.deleteLabel': 'Delete product',
    'product.closeImage': 'Close image',

    // Bottom Sheet (Add/Edit)
    'sheet.titleNew': 'New product',
    'sheet.titleEdit': 'Edit product',
    'sheet.subtitle': 'Take a photo or type the product name',
    'sheet.photoLabel': 'PHOTO',
    'sheet.nameLabel': 'NAME',
    'sheet.namePlaceholder': 'Milk, Rice, Soap...',
    'sheet.priceLabel': 'UNIT PRICE',
    'sheet.quantityLabel': 'QUANTITY',
    'sheet.unitLabel': 'UNIT',
    'sheet.submitNew': '+ Add to cart',
    'sheet.submitEdit': 'Save changes',
    'sheet.footerHint': 'Tap outside to close · add multiple items in sequence',

    // Confirm Modals
    'confirmDelete.title': 'Remove item?',
    'confirmDelete.message': 'Are you sure you want to remove {{name}} from your list?',
    'confirmDelete.cancel': 'Cancel',
    'confirmDelete.confirm': 'Remove',

    'confirmClear.title': 'Clear entire list?',
    'confirmClear.message': 'You will lose all {{count}} added products. Are you sure you want to empty the cart?',
    'confirmClear.cancel': 'Cancel',
    'confirmClear.confirm': 'Empty cart',

    // Language Selector
    'lang.pt': 'PT',
    'lang.en': 'EN',
    'lang.switch': 'Switch to Portuguese',

    // PDF Generator
    'pdf.title': 'Market',
    'pdf.subtitle': 'SHOPPING LIST',
    'pdf.issuedAt': 'ISSUED ON',
    'pdf.totalSpent': 'TOTAL SPENT',
    'pdf.products': 'PRODUCTS',
    'pdf.units': 'UNITS',
    'pdf.average': 'AVERAGE',
    'pdf.listItems': 'LIST ITEMS',
    'pdf.thProduct': 'PRODUCT',
    'pdf.thQty': 'QTY',
    'pdf.thUnitPrice': 'UNIT PRICE',
    'pdf.thSubtotal': 'SUBTOTAL',
    'pdf.averageTicket': 'Average price per product',
    'pdf.grandTotal': 'Grand total',
    'pdf.noName': 'No name'
  }
};
