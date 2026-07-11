import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './format';
import type { Product } from '../contexts/CartContext';

export const generateShoppingListPDF = (
  products: Product[],
  totalUnits: number,
  totalPrice: number
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Variáveis de cor
  const primaryColor: [number, number, number] = [28, 66, 48]; // Escuro
  const primaryLightColor: [number, number, number] = [167, 201, 87]; // Verde folha
  const lightBgColor: [number, number, number] = [248, 249, 250]; // Fundo da tabela

  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const averageTicket = products.length > 0 ? totalPrice / products.length : 0;

  // --- HEADER (FUNDO VERDE) ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 80, 'F');

  // Logo (um quadrado simples simulando a folha)
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({opacity: 0.15}));
  doc.roundedRect(15, 15, 12, 12, 3, 3, 'F');
  doc.setGState(new (doc as any).GState({opacity: 1}));
  
  doc.setTextColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
  doc.setFontSize(10);
  doc.text('M', 18, 23); // Placeholder de ícone logo

  // Títulos
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Mercado', 32, 21);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(150, 180, 160);
  doc.text('LISTA DE COMPRAS', 32, 26);

  // Info Data (Direita)
  doc.setFontSize(7);
  doc.text('EMITIDO EM', pageWidth - 15, 19, { align: 'right' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(formattedDate, pageWidth - 15, 24, { align: 'right' });
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(8);
  doc.text(timeStr, pageWidth - 15, 29, { align: 'right' });

  // --- SUMMARY CARD ---
  doc.setGState(new (doc as any).GState({opacity: 0.1}));
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 40, pageWidth - 30, 25, 4, 4, 'F');
  doc.setGState(new (doc as any).GState({opacity: 1}));

  // Gasto
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(8);
  doc.text('TOTAL GASTO', 20, 48);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(formatCurrency(totalPrice), 20, 58);

  // Métrica 1
  const m1X = pageWidth - 90;
  doc.setFontSize(12);
  doc.text(products.length.toString(), m1X, 52, { align: 'center' });
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text('PRODUTOS', m1X, 58, { align: 'center' });

  // Métrica 2
  const m2X = pageWidth - 60;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(Number(totalUnits.toFixed(3)).toString().replace('.', ','), m2X, 52, { align: 'center' });
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text('UNIDADES', m2X, 58, { align: 'center' });

  // Métrica 3
  const m3X = pageWidth - 25;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(formatCurrency(averageTicket), m3X, 52, { align: 'center' });
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text('MÉDIA', m3X, 58, { align: 'center' });


  // --- BODY TÍTULO ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.text('ITENS DA LISTA', 18, 95);
  // Linha lateral
  doc.setLineWidth(1);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(15, 91, 15, 96);


  // --- TABELA ---
  const tableData = products.map(product => {
    const isUnitMultiplier = product.unit === 'un';
    const quantityStr = `${product.quantity.toString().replace('.', ',')}`;
    const priceStr = formatCurrency(product.price);
    const itemTotalRaw = isUnitMultiplier ? product.quantity * product.price : product.price;
    const roundedItemTotal = Number(Math.round(Number(itemTotalRaw + 'e2')) + 'e-2');
    const totalStr = formatCurrency(roundedItemTotal);

    // O primeiro campo fica com espaçamento pra podermos desenhar algo no gancho
    return [
      `     ${product.name || 'Sem nome'}`, // espaços para fingir indentação da imagem
      quantityStr,
      priceStr,
      totalStr
    ];
  });

  autoTable(doc, {
    startY: 105,
    head: [['PRODUTO', 'QTD.', 'PREÇO UN.', 'SUBTOTAL']],
    body: tableData,
    theme: 'plain', // Sem bordas
    headStyles: {
      fillColor: lightBgColor,
      textColor: [100, 110, 100],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 6,
    },
    bodyStyles: {
      textColor: [33, 37, 41],
      fontSize: 9,
      cellPadding: 8,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 25, halign: 'center', textColor: primaryColor },
      2: { cellWidth: 35, halign: 'right', textColor: [100, 110, 100], fontStyle: 'normal' },
      3: { cellWidth: 35, halign: 'right' }
    },
    willDrawCell: (data) => {
      // Cria a borda pontilhada abaixo de cada linha de produto
      if (data.section === 'body' && data.row.index !== tableData.length - 1 && data.column.index === 0) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(data.cell.x, data.cell.y + data.cell.height, pageWidth - 15, data.cell.y + data.cell.height);
        doc.setLineDashPattern([], 0);
      }
    },
    didDrawCell: (data) => {
      // Adiciona o quadradinho do icone na primeira coluna
      if (data.section === 'body' && data.column.index === 0) {
        doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
        doc.roundedRect(data.cell.x + 2, data.cell.y + 4, 8, 8, 2, 2, 'F');
      }
    }
  });

  // --- RODAPÉ ---
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // Box ticket medio
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, finalY, pageWidth - 30, 12, 3, 3, 'S');
  doc.setTextColor(100, 110, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Ticket médio por produto', 20, finalY + 8);
  doc.setTextColor(33, 37, 41);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(averageTicket), pageWidth - 20, finalY + 8, { align: 'right' });

  // Box total geral
  const totalY = finalY + 16;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(15, totalY, pageWidth - 30, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Total geral', 20, totalY + 11);
  doc.setFontSize(14);
  doc.text(formatCurrency(totalPrice), pageWidth - 20, totalY + 12, { align: 'right' });

  // Watermark (marca no fim da página)
  const watermarkY = totalY + 30;
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, watermarkY - 5, pageWidth - 15, watermarkY - 5);
  doc.setLineDashPattern([], 0);
  
  doc.setTextColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
  doc.setFontSize(8);
  doc.text('Mercado', 15, watermarkY + 2);
  doc.setTextColor(150, 150, 150);
  doc.text(`${formattedDate.toLowerCase()} - ${timeStr}`, pageWidth - 15, watermarkY + 2, { align: 'right' });

  // Salva o PDF
  const dataNome = new Date().toISOString().split('T')[0];
  doc.save(`minha_feira_${dataNome}.pdf`);
};
