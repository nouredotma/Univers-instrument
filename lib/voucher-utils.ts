import { jsPDF } from "jspdf"

interface VoucherData {
  booking: any
  offer: any
  userProfile: any
  t: any
}

export const generateVoucherPDF = async (data: VoucherData) => {
  const { booking, offer, userProfile, t } = data
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const vt = t.users.bookingDetails.voucher

  // =============== COLOR PALETTE ===============
  const colors = {
    primary: [44, 56, 99] as const,     // #2c3863 - Website Primary Blue
    secondary: [250, 195, 96] as const, // #fac360 - Website Secondary Gold
    darkGray: [31, 41, 55] as const,    // #1F2937 - Dark text
    lightGray: [107, 114, 128] as const, // #6B7280 - Muted text
    borderGray: [229, 231, 235] as const, // #E5E7EB - Borders
    bgLight: [249, 250, 251] as const,   // #F9FAFB - Light backgrounds
    white: [255, 255, 255] as const,
    green: [34, 197, 94] as const,       // #22C55E - Success/Confirmed
    orange: [249, 115, 22] as const,     // #F97316 - Pending
  }

  const pageWidth = 210
  const pageHeight = 297
  const margin = 15
  const contentWidth = pageWidth - (margin * 2)
  let currentY = 0

  // =============== HELPER FUNCTIONS ===============
  const setColor = (color: readonly [number, number, number], type: 'fill' | 'text' | 'draw' = 'text') => {
    if (type === 'fill') doc.setFillColor(color[0], color[1], color[2])
    else if (type === 'draw') doc.setDrawColor(color[0], color[1], color[2])
    else doc.setTextColor(color[0], color[1], color[2])
  }

  const drawDivider = (y: number, width: number = contentWidth, xOffset: number = margin) => {
    setColor(colors.borderGray, 'draw')
    doc.setLineWidth(0.3)
    doc.line(xOffset, y, xOffset + width, y)
  }

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase()
    if (s === 'confirmed' || s === 'completed') return colors.green
    if (s === 'pending') return colors.orange
    return colors.primary
  }

  // =============== HEADER SECTION ===============
  const headerHeight = 35
  
  // Header background
  setColor(colors.primary, 'fill')
  doc.rect(0, 0, pageWidth, headerHeight, "F")
  
  // Secondary accent bar at the bottom of header
  setColor(colors.secondary, 'fill')
  doc.rect(0, headerHeight - 2, pageWidth, 2, "F")

  // Logo area
  try {
    doc.addImage("/logo.png", "PNG", margin, 5, 25, 25)
  } catch {
    // Fallback text logo
    setColor(colors.white)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("MTS", margin, 18)
  }

  // Company info
  setColor(colors.white)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Univers Instrument Service", margin + 30, 15)
  
  setColor(colors.secondary)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("www.universinstrumentservice.com", margin + 30, 22)

  // Date generated & Voucher Title (Clean text instead of badge)
  setColor(colors.white)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  const downloadDate = new Date().toLocaleDateString()
  doc.text(`${t.header?.downloadDate || 'Generated'}: ${downloadDate}`, pageWidth - margin, 27, { align: 'right' })
  
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(vt.title.toUpperCase(), pageWidth - margin, 18, { align: 'right' })

  currentY = headerHeight + 10

  // =============== BOOKING INFO BAR ===============
  setColor(colors.bgLight, 'fill')
  doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "F")

  // Booking ID
  setColor(colors.lightGray)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(vt.bookingId, margin + 6, currentY + 7)
  setColor(colors.darkGray)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(`#${booking.id?.substring(0, 8).toUpperCase() || 'N/A'}`, margin + 6, currentY + 14)

  // Booking Date
  const colWidth = contentWidth / 3
  setColor(colors.lightGray)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(vt.bookingDate, margin + colWidth + 6, currentY + 7)
  setColor(colors.darkGray)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  const bookingDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'
  doc.text(bookingDate, margin + colWidth + 6, currentY + 14)

  // Status
  setColor(colors.lightGray)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(vt.status, margin + (colWidth * 2) + 6, currentY + 7)
  const statusColor = getStatusColor(booking.status)
  setColor(statusColor)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(booking.status?.toUpperCase() || 'PENDING', margin + (colWidth * 2) + 6, currentY + 14)

  currentY += 28

  // =============== SERVICE DETAILS SECTION ===============
  setColor(colors.secondary)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(vt.serviceInfo?.toUpperCase() || 'SERVICE INFORMATION', margin, currentY)
  
  currentY += 6

  // Offer Title
  setColor(colors.primary)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  const titleLines = doc.splitTextToSize(offer.title || offer.name || "Experience", contentWidth - 10)
  doc.text(titleLines, margin, currentY + 5)
  currentY += (titleLines.length * 7) + 5

  // Offer Overview/Description
  const overview = offer.detailedDescription?.overview || offer.description
  if (overview) {
    setColor(colors.darkGray)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const overviewLines = doc.splitTextToSize(overview, contentWidth - 10)
    doc.text(overviewLines, margin, currentY)
    currentY += (overviewLines.length * 5) + 6
  }

  // Service Quick Info Row
  currentY += 2
  setColor(colors.bgLight, 'fill')
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "F")

  const infoItems = [
    { label: t.offerDetails?.preferredDate || 'Date', value: booking.date ? new Date(booking.date).toLocaleDateString() : 'TBD' },
    { label: vt.departure || 'Departure', value: offer.depart_city || offer.departCity || 'Marrakech' },
    { label: t.offerDetails?.duration || 'Duration', value: offer.detailedDescription?.duration || offer.duration || '-' },
  ]

  const infoColWidth = contentWidth / 3
  infoItems.forEach((item, idx) => {
    const xPos = margin + (idx * infoColWidth) + 6
    setColor(colors.lightGray)
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.text(item.label, xPos, currentY + 5)
    setColor(colors.darkGray)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(item.value, xPos, currentY + 11)
  })

  currentY += 22

  // =============== OFFER DETAILS SECTION (Included/Excluded) ===============
  const halfWidth = (contentWidth - 6) / 2

  // Included Items
  if (offer.includedItems && offer.includedItems.length > 0) {
    setColor(colors.green)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(t.offerDetails?.included || '✓ Included', margin, currentY)
    
    currentY += 4
    setColor(colors.darkGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    
    offer.includedItems.forEach((item: string, idx: number) => {
      // Split item text if it's too long
      const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 20)
      doc.text(itemLines, margin + 2, currentY + 4)
      currentY += (itemLines.length * 4)
    })
    currentY += 4
  }

  // Excluded Items
  if (offer.excludedItems && offer.excludedItems.length > 0) {
    setColor(colors.orange)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(t.offerDetails?.notIncluded || '✗ Not Included', margin, currentY)
    
    currentY += 4
    setColor(colors.lightGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    
    offer.excludedItems.forEach((item: string) => {
      const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 20)
      doc.text(itemLines, margin + 2, currentY + 4)
      currentY += (itemLines.length * 4)
    })
    currentY += 4
  }

  // Highlights
  if (offer.detailedDescription?.highlights && offer.detailedDescription.highlights.length > 0) {
    setColor(colors.primary)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text('★ ' + (t.offerDetails?.highlights || 'Highlights'), margin, currentY)
    
    currentY += 4
    setColor(colors.darkGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    
    offer.detailedDescription.highlights.forEach((highlight: string) => {
      const hLines = doc.splitTextToSize(`• ${highlight}`, contentWidth - 20)
      doc.text(hLines, margin + 2, currentY + 4)
      currentY += (hLines.length * 4)
    })
    currentY += 4
  }

  drawDivider(currentY)
  currentY += 8

  // =============== GUEST & GROUP INFO SECTION ===============
  const twoColStart = currentY

  // Guest Info (Left Column)
  setColor(colors.secondary)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(vt.guestInfo?.toUpperCase() || 'GUEST INFORMATION', margin, currentY)
  
  currentY += 6
  const guestDetails = [
    { label: vt.name || 'Name', value: userProfile?.name || userProfile?.full_name || 'N/A' },
    { label: vt.email || 'Email', value: userProfile?.email || 'N/A' },
    { label: vt.phone || 'Phone', value: userProfile?.phone || 'N/A' },
  ]

  guestDetails.forEach((detail) => {
    setColor(colors.lightGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(detail.label, margin, currentY)
    setColor(colors.darkGray)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(detail.value, margin + 30, currentY)
    currentY += 5
  })

  // Group Size (Right Column)
  let rightColY = twoColStart
  const rightColX = margin + halfWidth + 10

  setColor(colors.secondary)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(vt.groupSize?.toUpperCase() || 'GROUP SIZE', rightColX, rightColY)
  
  rightColY += 6
  setColor(colors.bgLight, 'fill')
  doc.roundedRect(rightColX, rightColY, halfWidth - 10, 18, 2, 2, "F")

  // Adults
  setColor(colors.darkGray)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(`${booking.adults || 0}`, rightColX + 8, rightColY + 12)
  setColor(colors.lightGray)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(vt.adults || 'Adults', rightColX + 20, rightColY + 12)

  // Children
  if (booking.children && booking.children > 0) {
    setColor(colors.darkGray)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(`${booking.children}`, rightColX + 50, rightColY + 12)
    setColor(colors.lightGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(vt.children || 'Children', rightColX + 62, rightColY + 12)
  }

  currentY = Math.max(currentY, rightColY + 20) + 8
  drawDivider(currentY)
  currentY += 8

  // =============== PAYMENT SUMMARY ===============
  setColor(colors.secondary)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(vt.paymentInfo?.toUpperCase() || 'PAYMENT SUMMARY', margin, currentY)
  currentY += 8

  // Price breakdown box
  setColor(colors.bgLight, 'fill')
  doc.roundedRect(margin, currentY, contentWidth, 35, 3, 3, "F")

  let priceY = currentY + 8
  const priceRightX = pageWidth - margin - 6

  // Adult pricing
  if (booking.adults > 0 && (offer.priceAdult || offer.price_adult)) {
    const adultPrice = offer.priceAdult || offer.price_adult
    setColor(colors.darkGray)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`${booking.adults} × ${vt.adults || 'Adults'}`, margin + 6, priceY)
    doc.setFont("helvetica", "bold")
    doc.text(`€ ${(booking.adults * parseFloat(adultPrice)).toFixed(2)}`, priceRightX, priceY, { align: 'right' })
    priceY += 6
  }

  // Child pricing
  if (booking.children > 0 && (offer.priceChild || offer.price_child)) {
    const childPrice = offer.priceChild || offer.price_child
    setColor(colors.darkGray)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`${booking.children} × ${vt.children || 'Children'}`, margin + 6, priceY)
    doc.setFont("helvetica", "bold")
    doc.text(`€ ${(booking.children * parseFloat(childPrice)).toFixed(2)}`, priceRightX, priceY, { align: 'right' })
    priceY += 6
  }

  // Divider line before total
  setColor(colors.borderGray, 'draw')
  doc.setLineWidth(0.3)
  doc.line(margin + 6, priceY + 2, priceRightX, priceY + 2)
  priceY += 8

  // Total
  setColor(colors.darkGray)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(vt.totalPrice || 'TOTAL', margin + 6, priceY)
  setColor(colors.secondary)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  const totalPrice = parseFloat(booking.total_price || 0).toFixed(2)
  doc.text(`€ ${totalPrice}`, priceRightX, priceY, { align: 'right' })

  currentY += 42

  // =============== IMPORTANT NOTE ===============
  if (t.users?.bookingDetails?.paymentNote) {
    setColor(colors.bgLight, 'fill')
    setColor(colors.orange, 'draw')
    doc.setLineWidth(0.8)
    doc.roundedRect(margin, currentY, contentWidth, 24, 3, 3, "FD")
    
    setColor(colors.orange)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text('⚠ ' + (vt.note || 'Important Note'), margin + 6, currentY + 7)
    
    setColor(colors.darkGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    const noteLines = doc.splitTextToSize(t.users.bookingDetails.paymentNote, contentWidth - 14)
    doc.text(noteLines.slice(0, 2), margin + 6, currentY + 14)
    
    currentY += 30
  }

  // =============== FOOTER ===============
  const footerHeight = 25
  const footerY = pageHeight - footerHeight

  setColor(colors.primary, 'fill')
  doc.rect(0, footerY, pageWidth, footerHeight, "F")

  // Secondary accent line at top of footer
  setColor(colors.secondary, 'fill')
  doc.rect(0, footerY, pageWidth, 2, "F")

  // Footer content
  setColor(colors.white)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  
  const footerText = vt.footerText || 'Thank you for booking with Univers Instrument Service. Please present this voucher on arrival.'
  const footerLines = doc.splitTextToSize(footerText, contentWidth - 20)
  doc.text(footerLines, pageWidth / 2, footerY + 10, { align: 'center' })

  // Contact info
  setColor(colors.secondary)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  const contactText = `${vt.contactUs || 'Contact'}: support@marrakechtravelservices.com | +212 661-044503`
  doc.text(contactText, pageWidth / 2, footerY + 20, { align: 'center' })

  // =============== SAVE PDF ===============
  const fileName = `voucher-${(booking.id || 'booking').substring(0, 8)}.pdf`
  doc.save(fileName)
}
