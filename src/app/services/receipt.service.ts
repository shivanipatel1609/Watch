import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

interface ReceiptUserDetails {
  name: string;
  email: string;
  phone: string;
}

interface ReceiptField {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class ReceiptService {
  private readonly pageWidth = 595;
  private readonly pageHeight = 842;
  private readonly margin = 26;
  private readonly cardPadding = 22;
  private readonly columnGap = 16;
  private readonly contentWidth = this.pageWidth - this.margin * 2;
  private readonly cardWidth = (this.contentWidth - this.columnGap) / 2;

  downloadOrderReceipt(order: Order, user: ReceiptUserDetails): void {
    const pdf = this.buildPdf(order, user);
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.id}-receipt.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private buildPdf(order: Order, user: ReceiptUserDetails): Uint8Array {
    const ops: string[] = [];

    this.drawRect(ops, 0, 0, this.pageWidth, this.pageHeight, '#f5f1eb');
    this.drawRoundedRect(ops, this.margin, this.margin, this.contentWidth, this.pageHeight - this.margin * 2, 18, '#fffaf4', '#ddd1c3');

    const headerHeight = 124;
    this.drawRoundedRect(ops, this.margin, this.pageHeight - this.margin - headerHeight, this.contentWidth, headerHeight, 18, '#f3eee6', undefined, true, true, false, false);
    this.drawLine(ops, this.margin, this.pageHeight - this.margin - headerHeight, this.margin + this.contentWidth, this.pageHeight - this.margin - headerHeight, '#ddd1c3', 1);

    const left = this.margin + 24;
    let cursorY = this.pageHeight - this.margin - 30;
    this.drawText(ops, 'CALIBER WATCH STORE', left, cursorY, 11, 'F3', '#c8a46b');
    cursorY -= 30;
    this.drawText(ops, 'Order Receipt', left, cursorY, 34, 'F3', '#2f3a4a');

    const fields: ReceiptField[] = [
      { label: 'Order ID', value: order.id },
      { label: 'Placed', value: this.formatDate(order.createdAt) },
      { label: 'Customer', value: user.name },
      { label: 'Email', value: user.email },
      { label: 'Phone', value: user.phone },
      { label: 'Payment', value: order.paymentMethod },
      { label: 'Status', value: order.orderStatus },
      { label: 'Shipping Address', value: `${order.address}, ${order.city}` }
    ];

    let fieldsTop = this.pageHeight - this.margin - headerHeight - 28;
    for (let index = 0; index < fields.length; index += 2) {
      const row = fields.slice(index, index + 2);
      const rowHeight = this.calculateFieldRowHeight(row);
      row.forEach((field, columnIndex) => {
        const x = this.margin + 24 + columnIndex * (this.cardWidth + this.columnGap);
        const y = fieldsTop - rowHeight;
        this.drawFieldCard(ops, x, y, this.cardWidth, rowHeight, field);
      });
      fieldsTop -= rowHeight + 14;
    }

    const tableTop = fieldsTop - 20;
    const tableX = this.margin + 24;
    const tableWidth = this.contentWidth - 48;
    const columns = [
      { label: 'Watch', x: tableX, width: 220 },
      { label: 'Qty', x: tableX + 220, width: 50 },
      { label: 'Unit Price', x: tableX + 270, width: 130 },
      { label: 'Line Total', x: tableX + 400, width: 120 }
    ];

    columns.forEach((column) => {
      this.drawText(ops, column.label, column.x, tableTop, 11, 'F3', '#5c6f89');
    });
    this.drawLine(ops, tableX, tableTop - 18, tableX + tableWidth, tableTop - 18, '#ddd1c3', 1);

    let rowTop = tableTop - 42;
    order.products.forEach((product) => {
      const nameLines = this.wrapText(product.name, 34);
      const rowHeight = Math.max(30, nameLines.length * 16);

      nameLines.forEach((line, lineIndex) => {
        this.drawText(ops, line, columns[0].x, rowTop - lineIndex * 16, 11, 'F1', '#2f3a4a');
      });
      this.drawText(ops, String(product.quantity), columns[1].x, rowTop, 11, 'F1', '#2f3a4a');
      this.drawText(ops, `INR ${this.formatCurrency(product.price)}`, columns[2].x, rowTop, 11, 'F1', '#2f3a4a');
      this.drawText(ops, `INR ${this.formatCurrency(product.price * product.quantity)}`, columns[3].x, rowTop, 11, 'F1', '#2f3a4a');
      this.drawLine(ops, tableX, rowTop - rowHeight + 2, tableX + tableWidth, rowTop - rowHeight + 2, '#e4dbcf', 1);
      rowTop -= rowHeight + 14;
    });

    const totalBoxWidth = 170;
    const totalBoxHeight = 72;
    const totalX = tableX + tableWidth - totalBoxWidth;
    const totalY = Math.max(this.margin + 26, rowTop - 54);
    this.drawRoundedRect(ops, totalX, totalY, totalBoxWidth, totalBoxHeight, 16, '#2f3a4a');
    this.drawText(ops, 'TOTAL PAID', totalX + 18, totalY + totalBoxHeight - 24, 10, 'F3', '#c8a46b');
    this.drawText(ops, `INR ${this.formatCurrency(order.totalPrice)}`, totalX + 18, totalY + 22, 18, 'F3', '#f5f1eb');

    const stream = ops.join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      `7 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`
    ];

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.slice(1).forEach((offset) => {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  private drawFieldCard(ops: string[], x: number, y: number, width: number, height: number, field: ReceiptField): void {
    this.drawRoundedRect(ops, x, y, width, height, 14, '#f8f4ee', '#ddd1c3');
    this.drawText(ops, field.label.toUpperCase(), x + this.cardPadding, y + height - 24, 10, 'F3', '#5c6f89');

    const valueLines = this.wrapText(field.value, 34);
    valueLines.forEach((line, index) => {
      this.drawText(ops, line, x + this.cardPadding, y + height - 52 - index * 16, 11, 'F1', '#2f3a4a');
    });
  }

  private calculateFieldRowHeight(fields: ReceiptField[]): number {
    const baseHeight = 72;
    const contentHeights = fields.map((field) => {
      const lines = this.wrapText(field.value, 34).length;
      return baseHeight + Math.max(0, lines - 1) * 16;
    });
    return Math.max(...contentHeights);
  }

  private drawText(
    ops: string[],
    text: string,
    x: number,
    y: number,
    size: number,
    font: 'F1' | 'F2' | 'F3',
    color: string
  ): void {
    const [r, g, b] = this.hexToRgb(color);
    ops.push('BT');
    ops.push(`/${font} ${size} Tf`);
    ops.push(`${r} ${g} ${b} rg`);
    ops.push(`1 0 0 1 ${this.formatNumber(x)} ${this.formatNumber(y)} Tm`);
    ops.push(`(${this.escapePdfText(text)}) Tj`);
    ops.push('ET');
  }

  private drawRect(ops: string[], x: number, y: number, width: number, height: number, fillColor: string): void {
    const [r, g, b] = this.hexToRgb(fillColor);
    ops.push(`${r} ${g} ${b} rg`);
    ops.push(`${this.formatNumber(x)} ${this.formatNumber(y)} ${this.formatNumber(width)} ${this.formatNumber(height)} re f`);
  }

  private drawRoundedRect(
    ops: string[],
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string,
    strokeColor?: string,
    roundTopLeft = true,
    roundTopRight = true,
    roundBottomRight = true,
    roundBottomLeft = true
  ): void {
    const k = 0.5522847498;
    const right = x + width;
    const top = y + height;
    const [fr, fg, fb] = this.hexToRgb(fillColor);
    ops.push(`${fr} ${fg} ${fb} rg`);
    if (strokeColor) {
      const [sr, sg, sb] = this.hexToRgb(strokeColor);
      ops.push(`${sr} ${sg} ${sb} RG`);
      ops.push('1 w');
    }

    ops.push(`${this.formatNumber(x + (roundBottomLeft ? radius : 0))} ${this.formatNumber(y)} m`);
    ops.push(`${this.formatNumber(right - (roundBottomRight ? radius : 0))} ${this.formatNumber(y)} l`);
    if (roundBottomRight) {
      ops.push(
        `${this.formatNumber(right - radius + radius * k)} ${this.formatNumber(y)} ${this.formatNumber(right)} ${this.formatNumber(y + radius - radius * k)} ${this.formatNumber(right)} ${this.formatNumber(y + radius)} c`
      );
    } else {
      ops.push(`${this.formatNumber(right)} ${this.formatNumber(y)} l`);
    }
    ops.push(`${this.formatNumber(right)} ${this.formatNumber(top - (roundTopRight ? radius : 0))} l`);
    if (roundTopRight) {
      ops.push(
        `${this.formatNumber(right)} ${this.formatNumber(top - radius + radius * k)} ${this.formatNumber(right - radius + radius * k)} ${this.formatNumber(top)} ${this.formatNumber(right - radius)} ${this.formatNumber(top)} c`
      );
    } else {
      ops.push(`${this.formatNumber(right)} ${this.formatNumber(top)} l`);
    }
    ops.push(`${this.formatNumber(x + (roundTopLeft ? radius : 0))} ${this.formatNumber(top)} l`);
    if (roundTopLeft) {
      ops.push(
        `${this.formatNumber(x + radius - radius * k)} ${this.formatNumber(top)} ${this.formatNumber(x)} ${this.formatNumber(top - radius + radius * k)} ${this.formatNumber(x)} ${this.formatNumber(top - radius)} c`
      );
    } else {
      ops.push(`${this.formatNumber(x)} ${this.formatNumber(top)} l`);
    }
    ops.push(`${this.formatNumber(x)} ${this.formatNumber(y + (roundBottomLeft ? radius : 0))} l`);
    if (roundBottomLeft) {
      ops.push(
        `${this.formatNumber(x)} ${this.formatNumber(y + radius - radius * k)} ${this.formatNumber(x + radius - radius * k)} ${this.formatNumber(y)} ${this.formatNumber(x + radius)} ${this.formatNumber(y)} c`
      );
    } else {
      ops.push(`${this.formatNumber(x)} ${this.formatNumber(y)} l`);
    }
    ops.push(strokeColor ? 'B' : 'f');
  }

  private drawLine(ops: string[], x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
    const [r, g, b] = this.hexToRgb(color);
    ops.push(`${r} ${g} ${b} RG`);
    ops.push(`${this.formatNumber(width)} w`);
    ops.push(`${this.formatNumber(x1)} ${this.formatNumber(y1)} m`);
    ops.push(`${this.formatNumber(x2)} ${this.formatNumber(y2)} l`);
    ops.push('S');
  }

  private wrapText(value: string, maxCharsPerLine: number): string[] {
    const words = value.split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [''];
    }

    const lines: string[] = [];
    let current = '';

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxCharsPerLine) {
        current = candidate;
        return;
      }

      if (current) {
        lines.push(current);
      }
      current = word;
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
  }

  private formatDate(value?: string): string {
    if (!value) {
      return 'N/A';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  private hexToRgb(hex: string): [string, string, string] {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    return [r, g, b].map((value) => this.formatNumber(value)) as [string, string, string];
  }

  private formatNumber(value: number): string {
    return value.toFixed(3).replace(/\.?0+$/, '');
  }

  private escapePdfText(value: string): string {
    return value
      .replaceAll('\\', '\\\\')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)');
  }
}
