import { calculateItemTotal, formatCurrency } from './format';
import type { Product } from '../contexts/CartContext';
import { translations, type Language } from '../i18n/translations';
import { findEmojiForProduct } from './productCatalog';

const loadRoundedIcon = (url: string, cornerRatio = 0.152): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(url);

      const w = img.width;
      const h = img.height;
      const r = Math.min(w, h) * cornerRatio;

      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

const emojiImageCache = new Map<string, string>();

const renderEmojiToPNG = (emoji: string, sizePx = 96): string => {
  if (emojiImageCache.has(emoji)) return emojiImageCache.get(emoji)!;

  const canvas = document.createElement('canvas');
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.font = `${sizePx * 0.75}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, sizePx / 2, sizePx / 2 + sizePx * 0.05);

  const dataUrl = canvas.toDataURL('image/png');
  emojiImageCache.set(emoji, dataUrl);
  return dataUrl;
};

const pad2 = (value: number): string => String(value).padStart(2, '0');
const pad3 = (value: number): string => String(value).padStart(3, '0');

const truncateToWidth = (doc: import('jspdf').jsPDF, text: string, maxWidth: number): string => {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && doc.getTextWidth(`${truncated}…`) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
};

export const generateShoppingListPDF = async (
  products: Product[],
  _totalUnits: number,
  totalPrice: number,
  lang: Language = 'pt'
) => {
  const { jsPDF } = await import('jspdf');

  const dict = translations[lang] || translations.pt;
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  const primaryColor: [number, number, number] = [28, 66, 48];
  const primaryLightColor: [number, number, number] = [167, 201, 87];
  const darkBoxColor: [number, number, number] = [20, 36, 29];
  const lightBgColor: [number, number, number] = [248, 249, 250];
  const mutedOnDark: [number, number, number] = [150, 180, 160];
  const mutedGray: [number, number, number] = [140, 140, 140];
  const darkText: [number, number, number] = [33, 37, 41];
  const borderGray: [number, number, number] = [225, 225, 225];

  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  const dateObj = new Date();
  const timeStr = dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const dayNum = pad2(dateObj.getDate());
  const monthAbbrev = dateObj.toLocaleDateString(locale, { month: 'short' }).replace('.', '').toUpperCase();
  const weekdayAbbrev = dateObj.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '').toUpperCase();
  const dateBig = `${dayNum} ${monthAbbrev} ${dateObj.getFullYear()}`;
  const timeLine = `${timeStr} / ${weekdayAbbrev}`;
  const hhmm = `${pad2(dateObj.getHours())}${pad2(dateObj.getMinutes())}`;
  const ddmmyy = `${dayNum}${pad2(dateObj.getMonth() + 1)}${String(dateObj.getFullYear()).slice(-2)}`;

  const averageTicket = products.length > 0 ? totalPrice / products.length : 0;
  const itemsLabelKey = products.length === 1 ? 'header.itemCount_one' : 'header.itemCount_other';
  const itemsLabel = dict[itemsLabelKey].replace('{{count}}', pad3(products.length)).toUpperCase();

  let currentY = 0;

  const ensureSpace = (needed: number) => {
    if (currentY + needed > pageHeight - margin) {
      doc.addPage();
      currentY = 20;
    }
  };

  const headerHeight = 52;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  const dotGridX = pageWidth - 78;
  const highlighted = new Set(['3-1']);
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      const isHighlighted = highlighted.has(`${col}-${row}`);
      const cx = dotGridX + col * 8.2;
      const cy = 10 + row * 7;
      if (isHighlighted) {
        doc.setFillColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
        doc.circle(cx, cy, 0.9, 'F');
      } else {
        doc.setFillColor(mutedOnDark[0], mutedOnDark[1], mutedOnDark[2]);
        doc.circle(cx, cy, 0.4, 'F');
      }
    }
  }

  const logoSize = 13;
  const logoX = margin;
  const logoY = 9;
  try {
    const logoUrl = import.meta.env.BASE_URL + 'icon-512x512.png';
    const roundedLogo = await loadRoundedIcon(logoUrl);
    doc.addImage(roundedLogo, 'PNG', logoX, logoY, logoSize, logoSize);
  } catch (error) {
    console.warn('Erro ao carregar o logo, usando fallback:', error);
    doc.setFillColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
    doc.roundedRect(logoX, logoY, logoSize, logoSize, 3, 3, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('M', logoX + logoSize / 2, logoY + logoSize / 2 + 1.5, { align: 'center' });
  }

  const textX = logoX + logoSize + 4;
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(dict['pdf.title'], textX, logoY + 6.5);

  doc.setFontSize(7);
  doc.setTextColor(mutedOnDark[0], mutedOnDark[1], mutedOnDark[2]);
  doc.text(`${dict['pdf.subtitle']} · ${itemsLabel}`, textX, logoY + 12);

  const infoLabelY = headerHeight - 18;
  const infoValueY = headerHeight - 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedOnDark[0], mutedOnDark[1], mutedOnDark[2]);
  doc.text(dict['pdf.issuedAt'], margin, infoLabelY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(dateBig, margin, infoValueY);
  const dateWidth = doc.getTextWidth(dateBig);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
  doc.text(timeLine, margin + dateWidth + 3, infoValueY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedOnDark[0], mutedOnDark[1], mutedOnDark[2]);
  doc.text(dict['pdf.total'], pageWidth - margin, infoLabelY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(totalPrice, lang), pageWidth - margin, infoValueY, { align: 'right' });

  currentY = headerHeight + 12;

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(margin, currentY - 5, margin, currentY);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(dict['pdf.listItems'], margin + 3, currentY);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(`${pad2(products.length)} / ${pad2(products.length)}`, pageWidth - margin, currentY, { align: 'right' });

  currentY += 6;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 9;

  const rowHeight = 20;
  const priceColX = pageWidth - margin - 40;
  const subtotalColX = pageWidth - margin;
  const iconColX = margin + 13;
  const iconColSize = 9;
  const contentX = iconColX + iconColSize + 4;

  products.forEach((product, index) => {
    ensureSpace(rowHeight + 5);

    const badgeY = currentY;
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.roundedRect(margin, badgeY, 9, 9, 2, 2, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(pad2(index + 1), margin + 4.5, badgeY + 6, { align: 'center' });

    const productEmoji = product.imageUrl ? null : findEmojiForProduct(product.name);
    if (productEmoji) {
      const emojiImage = renderEmojiToPNG(productEmoji);
      if (emojiImage) {
        doc.addImage(emojiImage, 'PNG', iconColX, badgeY, iconColSize, iconColSize);
      }
    }

    const fallbackName = product.imageUrl ? dict['product.photoOnly'] : dict['pdf.noName'];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    const priceLabelWidth = doc.getTextWidth(dict['pdf.thUnitPrice']);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const maxNameWidth = priceColX - priceLabelWidth - contentX - 6;
    const displayName = truncateToWidth(doc, product.name || fallbackName, maxNameWidth);
    doc.text(displayName, contentX, currentY + 4.5);

    const unitLabel = product.unit === 'un' ? dict['product.unit'] : product.unit;
    const quantityStr = lang === 'pt'
      ? product.quantity.toString().replace('.', ',')
      : product.quantity.toString();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(dict['sheet.quantityLabel'], contentX, currentY + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const unitSuffix = product.unit === 'un' ? `${unitLabel}.` : unitLabel;
    doc.text(`${quantityStr} ${unitSuffix}`, contentX + 22, currentY + 11);

    const roundedItemTotal = calculateItemTotal(product.price, product.quantity, product.unit);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(dict['pdf.thUnitPrice'], priceColX, currentY + 4.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(formatCurrency(product.price, lang), priceColX, currentY + 11, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(dict['pdf.thSubtotal'], subtotalColX, currentY + 4.5, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(formatCurrency(roundedItemTotal, lang), subtotalColX, currentY + 12, { align: 'right' });

    if (index < products.length - 1) {
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.4);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(contentX, currentY + rowHeight - 3, pageWidth - margin, currentY + rowHeight - 3);
      doc.setLineDashPattern([], 0);
    }

    currentY += rowHeight;
  });

  ensureSpace(8 + 24 + 8 + 18 + 14 + 20);
  currentY += 8;

  const avgCardHeight = 24;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, avgCardHeight, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(dict['pdf.avgPerProduct'], margin + 8, currentY + 9);

  const maxSubtotal = products.length > 0
    ? Math.max(...products.map(p => calculateItemTotal(p.price, p.quantity, p.unit)))
    : 0;
  const ratio = maxSubtotal > 0 ? Math.min(0.85, Math.max(0.15, averageTicket / maxSubtotal)) : 0.5;
  const barWidth = 90;
  const barX = margin + 8;
  const barY = currentY + 13;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(barX, barY, barWidth, 3, 1.5, 1.5, 'F');
  doc.setFillColor(primaryLightColor[0], primaryLightColor[1], primaryLightColor[2]);
  doc.roundedRect(barX, barY, barWidth * ratio, 3, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(formatCurrency(averageTicket, lang), pageWidth - margin - 8, currentY + 15, { align: 'right' });

  currentY += avgCardHeight + 8;

  const totalBoxHeight = 18;
  doc.setFillColor(darkBoxColor[0], darkBoxColor[1], darkBoxColor[2]);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, totalBoxHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(mutedOnDark[0], mutedOnDark[1], mutedOnDark[2]);
  doc.text(dict['pdf.grandTotal'].toUpperCase(), margin + 8, currentY + 7);
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(totalPrice, lang), pageWidth - margin - 8, currentY + 13, { align: 'right' });

  currentY += totalBoxHeight + 14;

  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  let barX2 = margin;
  for (let i = 0; i < 26; i++) {
    const barW = i % 3 === 0 ? 1.1 : 0.5;
    const barH = 5 + (i % 4) * 1.2;
    doc.rect(barX2, currentY, barW, barH, 'F');
    barX2 += barW + 0.7;
  }

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  const footerId = `${dict['pdf.title'].toUpperCase()} / ${dict['pdf.listLabel'].toUpperCase()} ${pad3(products.length)} / ${ddmmyy}-${hhmm}`;
  doc.text(footerId, pageWidth - margin, currentY + 6, { align: 'right' });

  const dataNome = new Date().toISOString().split('T')[0];
  doc.save(`minha_feira_${dataNome}.pdf`);
};
