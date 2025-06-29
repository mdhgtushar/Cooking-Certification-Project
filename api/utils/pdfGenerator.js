const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

class CertificatePDFGenerator {
  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });
  }

  async generateCertificate(certificateData) {
    const {
      certificateNumber,
      student,
      course,
      instructor,
      issueDate,
      expiryDate,
      score,
      grade,
      certificateType,
      certificateLevel,
      verificationCode,
      issuedBy,
      qrCode
    } = certificateData;

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrCode);

    // Set up the document
    this.doc.font('Helvetica');

    // Add background
    this.addBackground();

    // Add header
    this.addHeader(issuedBy);

    // Add main content
    this.addMainContent(student, course, grade, certificateType, certificateLevel);

    // Add certificate details
    this.addCertificateDetails(certificateNumber, issueDate, expiryDate, score, instructor);

    // Add QR code
    this.addQRCode(qrCodeDataURL, verificationCode);

    // Add footer
    this.addFooter();

    return this.doc;
  }

  addBackground() {
    // Add a subtle background pattern
    this.doc.rect(0, 0, this.doc.page.width, this.doc.page.height)
      .fill('#f8f9fa');
    
    // Add border
    this.doc.rect(20, 20, this.doc.page.width - 40, this.doc.page.height - 40)
      .lineWidth(3)
      .stroke('#2c3e50');
  }

  addHeader(issuedBy) {
    // Institution name
    this.doc.fontSize(28)
      .font('Helvetica-Bold')
      .fill('#2c3e50')
      .text(issuedBy, 0, 80, {
        align: 'center',
        width: this.doc.page.width
      });

    // Certificate title
    this.doc.fontSize(18)
      .font('Helvetica')
      .fill('#7f8c8d')
      .text('Certificate of Completion', 0, 120, {
        align: 'center',
        width: this.doc.page.width
      });

    // Decorative line
    this.doc.moveTo(100, 150)
      .lineTo(this.doc.page.width - 100, 150)
      .lineWidth(2)
      .stroke('#3498db');
  }

  addMainContent(student, course, grade, certificateType, certificateLevel) {
    // This is to certify that
    this.doc.fontSize(14)
      .font('Helvetica')
      .fill('#2c3e50')
      .text('This is to certify that', 0, 180, {
        align: 'center',
        width: this.doc.page.width
      });

    // Student name
    const studentName = `${student.firstName} ${student.lastName}`;
    this.doc.fontSize(24)
      .font('Helvetica-Bold')
      .fill('#2c3e50')
      .text(studentName, 0, 210, {
        align: 'center',
        width: this.doc.page.width
      });

    // Has successfully completed
    this.doc.fontSize(14)
      .font('Helvetica')
      .fill('#2c3e50')
      .text('has successfully completed the course', 0, 250, {
        align: 'center',
        width: this.doc.page.width
      });

    // Course name
    this.doc.fontSize(20)
      .font('Helvetica-Bold')
      .fill('#3498db')
      .text(course.title, 0, 280, {
        align: 'center',
        width: this.doc.page.width
      });

    // Grade and level
    this.doc.fontSize(16)
      .font('Helvetica-Bold')
      .fill('#27ae60')
      .text(`Grade: ${grade} | Level: ${certificateLevel}`, 0, 320, {
        align: 'center',
        width: this.doc.page.width
      });

    // Certificate type
    this.doc.fontSize(14)
      .font('Helvetica')
      .fill('#7f8c8d')
      .text(`Certificate Type: ${certificateType}`, 0, 350, {
        align: 'center',
        width: this.doc.page.width
      });
  }

  addCertificateDetails(certificateNumber, issueDate, expiryDate, score, instructor) {
    const detailsY = 400;
    const leftX = 80;
    const rightX = this.doc.page.width - 200;

    // Left column
    this.doc.fontSize(12)
      .font('Helvetica-Bold')
      .fill('#2c3e50')
      .text('Certificate Number:', leftX, detailsY)
      .font('Helvetica')
      .text(certificateNumber, leftX, detailsY + 20);

    this.doc.font('Helvetica-Bold')
      .text('Issue Date:', leftX, detailsY + 50)
      .font('Helvetica')
      .text(new Date(issueDate).toLocaleDateString(), leftX, detailsY + 70);

    this.doc.font('Helvetica-Bold')
      .text('Expiry Date:', leftX, detailsY + 100)
      .font('Helvetica')
      .text(new Date(expiryDate).toLocaleDateString(), leftX, detailsY + 120);

    // Right column
    this.doc.font('Helvetica-Bold')
      .text('Score:', rightX, detailsY)
      .font('Helvetica')
      .text(`${score.obtained}/${score.total} (${score.percentage}%)`, rightX, detailsY + 20);

    this.doc.font('Helvetica-Bold')
      .text('Instructor:', rightX, detailsY + 50)
      .font('Helvetica')
      .text(`${instructor.firstName} ${instructor.lastName}`, rightX, detailsY + 70);
  }

  addQRCode(qrCodeDataURL, verificationCode) {
    const qrSize = 80;
    const qrX = this.doc.page.width - 120;
    const qrY = this.doc.page.height - 150;

    // Add QR code
    this.doc.image(qrCodeDataURL, qrX, qrY, {
      width: qrSize,
      height: qrSize
    });

    // Add verification text
    this.doc.fontSize(10)
      .font('Helvetica')
      .fill('#7f8c8d')
      .text('Scan to verify', qrX, qrY + qrSize + 5, {
        align: 'center',
        width: qrSize
      });

    this.doc.fontSize(8)
      .text(`Code: ${verificationCode}`, qrX, qrY + qrSize + 20, {
        align: 'center',
        width: qrSize
      });
  }

  addFooter() {
    const footerY = this.doc.page.height - 80;

    // Decorative line
    this.doc.moveTo(100, footerY - 20)
      .lineTo(this.doc.page.width - 100, footerY - 20)
      .lineWidth(1)
      .stroke('#bdc3c7');

    // Footer text
    this.doc.fontSize(10)
      .font('Helvetica')
      .fill('#7f8c8d')
      .text('This certificate is issued electronically and is valid without signature', 0, footerY, {
        align: 'center',
        width: this.doc.page.width
      });

    this.doc.text('For verification, visit our website or scan the QR code', 0, footerY + 15, {
      align: 'center',
      width: this.doc.page.width
    });
  }

  getDocument() {
    return this.doc;
  }
}

module.exports = CertificatePDFGenerator; 