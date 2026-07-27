import { formatCurrency } from './format';
import type { Product } from '../contexts/CartContext';
import { translations, type Language } from '../i18n/translations';

const loadTransparentImage = (url: string): Promise<string | HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(img);
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Converte pixels brancos (ou muito claros) para transparentes
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0; // Alpha = 0 (transparente)
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateShoppingListPDF = async (
  products: Product[],
  totalUnits: number,
  totalPrice: number,
  lang: Language = 'pt'
) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);
  
  const dict = translations[lang] || translations.pt;
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Variáveis de cor
  const primaryColor: [number, number, number] = [28, 66, 48]; // Escuro
  const primaryLightColor: [number, number, number] = [167, 201, 87]; // Verde folha
  const lightBgColor: [number, number, number] = [248, 249, 250]; // Fundo da tabela

  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const averageTicket = products.length > 0 ? totalPrice / products.length : 0;

  // --- HEADER (FUNDO VERDE) ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 80, 'F');

  // Logo (imagem carregada com fundo transparente)
  try {
    const logoUrl = import.meta.env.BASE_URL + 'icon-512x512.png';
    const transparentLogo = await loadTransparentImage(logoUrl);
    doc.addImage(transparentLogo, 'PNG', 15, 15, 12, 12);
  } catch (error) {
    console.warn('Erro ao carregar o logo, usando fallback:', error);
    doc.setFillColor(255, 255, 255);
    doc.setGState(new (doc as any).GState({opacity: 0.15}));
    doc.roundedRect(15, 15, 12, 12, 3, 3, 'F');
    doc.setGState(new (doc as any).GState({opacity: 1}));
    
    doc.setTextColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
    doc.setFontSize(10);
    doc.text('M', 18, 23);
  }

  // Títulos
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(dict['pdf.title'], 32, 21);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(150, 180, 160);
  doc.text(dict['pdf.subtitle'], 32, 26);

  // Info Data (Direita)
  doc.setFontSize(7);
  doc.text(dict['pdf.issuedAt'], pageWidth - 15, 19, { align: 'right' });
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
  doc.text(dict['pdf.totalSpent'], 20, 48);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(formatCurrency(totalPrice, lang), 20, 58);

  // Métrica 1
  const m1X = pageWidth - 102;
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text(dict['pdf.products'], m1X, 48, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(products.length.toString(), m1X, 58, { align: 'center' });

  // Métrica 2
  const m2X = pageWidth - 67;
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text(dict['pdf.units'], m2X, 48, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  const formattedTotalUnits = lang === 'pt'
    ? Number(totalUnits.toFixed(3)).toString().replace('.', ',')
    : Number(totalUnits.toFixed(3)).toString();
  doc.text(formattedTotalUnits, m2X, 58, { align: 'center' });

  // Métrica 3
  const m3X = pageWidth - 32;
  doc.setTextColor(150, 180, 160);
  doc.setFontSize(7);
  doc.text(dict['pdf.average'], m3X, 48, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(formatCurrency(averageTicket, lang), m3X, 58, { align: 'center' });

  // --- BODY TÍTULO ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.text(dict['pdf.listItems'], 18, 95);
  // Linha lateral
  doc.setLineWidth(1);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(15, 91, 15, 96);

  // --- TABELA ---
  const tableData = products.map(product => {
    const isUnitMultiplier = product.unit === 'un';
    const quantityStr = lang === 'pt'
      ? product.quantity.toString().replace('.', ',')
      : product.quantity.toString();
    const priceStr = formatCurrency(product.price, lang);
    const itemTotalRaw = isUnitMultiplier ? product.quantity * product.price : product.price;
    const roundedItemTotal = Number(Math.round(Number(itemTotalRaw + 'e2')) + 'e-2');
    const totalStr = formatCurrency(roundedItemTotal, lang);
    const fallbackName = product.imageUrl ? dict['product.photoOnly'] : dict['pdf.noName'];

    return [
      `     ${product.name || fallbackName}`,
      quantityStr,
      priceStr,
      totalStr
    ];
  });

  autoTable(doc, {
    startY: 105,
    head: [[dict['pdf.thProduct'], dict['pdf.thQty'], dict['pdf.thUnitPrice'], dict['pdf.thSubtotal']]],
    body: tableData,
    theme: 'plain',
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
      if (data.section === 'body' && data.row.index !== tableData.length - 1 && data.column.index === 0) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(data.cell.x, data.cell.y + data.cell.height, pageWidth - 15, data.cell.y + data.cell.height);
        doc.setLineDashPattern([], 0);
      }
    },
    didDrawCell: (data) => {
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
  doc.text(dict['pdf.averageTicket'], 20, finalY + 8);
  doc.setTextColor(33, 37, 41);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(averageTicket, lang), pageWidth - 20, finalY + 8, { align: 'right' });

  // Box total geral
  const totalY = finalY + 16;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(15, totalY, pageWidth - 30, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(dict['pdf.grandTotal'], 20, totalY + 11);
  doc.setFontSize(14);
  doc.text(formatCurrency(totalPrice, lang), pageWidth - 20, totalY + 12, { align: 'right' });

  // Watermark (marca no fim da página)
  const watermarkY = totalY + 30;
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, watermarkY - 5, pageWidth - 15, watermarkY - 5);
  doc.setLineDashPattern([], 0);
  
  doc.setTextColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
  doc.setFontSize(8);
  doc.text(dict['pdf.title'], 15, watermarkY + 2);
  doc.setTextColor(150, 150, 150);
  doc.text(`${formattedDate.toLowerCase()} - ${timeStr}`, pageWidth - 15, watermarkY + 2, { align: 'right' });

  // Salva o PDF
  const dataNome = new Date().toISOString().split('T')[0];
  doc.save(`minha_feira_${dataNome}.pdf`);
};
