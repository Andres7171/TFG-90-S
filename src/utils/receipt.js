import { jsPDF } from 'jspdf'

/**
 * @param {object} order - Objeto pedido con lines, total, mailing_address, created_at, id
 * @param {object} profile - Perfil del usuario { name, surname, email }
 * @param {string} userEmail - Email del usuario
 * @returns {jsPDF} - Instancia del PDF (para descargar o convertir a base64)
 */
export function generateReceiptPDF(order, profile, userEmail) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Colores
  const gold = [255, 215, 0]
  const dark = [17, 17, 17]
  const gray = [120, 120, 120]
  const white = [255, 255, 255]

  // Cabecera
  doc.setFillColor(...dark)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...gold)
  doc.text("RETROWEAR", margin, 20)

  doc.setFontSize(10)
  doc.setTextColor(...white)
  doc.text('RECIBO DE COMPRA', margin, 30)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  const orderDate = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  doc.text(`Pedido: #${order.id.slice(0, 8).toUpperCase()}`, pageWidth - margin, 20, { align: 'right' })
  doc.text(`Fecha: ${orderDate}`, pageWidth - margin, 27, { align: 'right' })
  doc.text(`Estado: ${order.status?.toUpperCase() || 'PAGADO'}`, pageWidth - margin, 34, { align: 'right' })

  y = 55

  // Datos del cliente
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text('DATOS DEL CLIENTE', margin, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)

  const clientName = profile
    ? `${profile.name || ''}${profile.surname ? ' ' + profile.surname : ''}`.trim()
    : 'Cliente'
  doc.text(`Nombre: ${clientName}`, margin, y); y += 5
  doc.text(`Email: ${userEmail || '—'}`, margin, y); y += 5
  doc.text(`Dirección de envío: ${order.mailing_address}`, margin, y); y += 10

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Tabla de productos
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...dark)
  doc.text('DETALLE DEL PEDIDO', margin, y)
  y += 8

  // Header de tabla
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, y - 4, contentWidth, 8, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.text('PRODUCTO', margin + 2, y)
  doc.text('TALLA', margin + 85, y)
  doc.text('CANT.', margin + 110, y, { align: 'center' })
  doc.text('PRECIO UD.', margin + 130, y)
  doc.text('SUBTOTAL', pageWidth - margin - 2, y, { align: 'right' })
  y += 7

  // Filas
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(40, 40, 40)

  const lines = order.lines || []
  lines.forEach((line, i) => {
    if (y > 260) {
      doc.addPage()
      y = margin
    }

    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248)
      doc.rect(margin, y - 4, contentWidth, 7, 'F')
    }

    const subtotal = (line.unit_price * line.quantity).toFixed(2)
    doc.text(line.product_name_snapshot || '—', margin + 2, y)
    doc.text(line.variant_size_snapshot || '—', margin + 85, y)
    doc.text(String(line.quantity), margin + 110, y, { align: 'center' })
    doc.text(`${Number(line.unit_price).toFixed(2)} €`, margin + 130, y)
    doc.text(`${subtotal} €`, pageWidth - margin - 2, y, { align: 'right' })
    y += 7
  })

  y += 5

  // Total 
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFillColor(...dark)
  doc.rect(pageWidth - margin - 60, y - 5, 60, 10, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...gold)
  doc.text(`TOTAL: ${Number(order.total).toFixed(2)} €`, pageWidth - margin - 5, y + 1, { align: 'right' })
  y += 18

  // Pie 
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...gray)
  doc.text('Gracias por tu compra. Este recibo se ha generado automáticamente.', margin, y)
  y += 5
  doc.text("RetroWear — Moda retro con alma de los 90.", margin, y)
  y += 5
  doc.text('Si tienes algún problema con tu pedido, contacta con nosotros desde la página web.', margin, y)

  return doc
}


// Descargar el PDF del recibo. 
export function downloadReceipt(order, profile, userEmail) {
  const doc = generateReceiptPDF(order, profile, userEmail)
  const filename = `recibo_${order.id.slice(0, 8)}.pdf`
  doc.save(filename)
}