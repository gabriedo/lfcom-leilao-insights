
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

// Add type augmentation for jsPDF to include the autoTable-specific properties
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generate a QR code as a data URL
 */
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 150
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Generate a verification ID for the report
 */
export const generateVerificationId = (): string => {
  return `LF-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

/**
 * Generate a PDF report for a property
 */
export const generatePropertyReportPDF = async (propertyDetails: any, 
                                             registryAnalysis: any,
                                             auctionAnalysis: any,
                                             propertyValuation: any,
                                             financialAnalysis: any,
                                             riskAnalysis: any,
                                             riskScores: any,
                                             recommendations: string[]): Promise<Blob> => {
  // Initialize PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const verificationId = generateVerificationId();
  const verificationUrl = `https://leiftech.com.br/verificar/${verificationId}`;
  
  // Generate QR code for verification
  const qrCodeDataUrl = await generateQRCode(verificationUrl);
  
  // Set text color to dark gray
  doc.setTextColor(50, 50, 50);
  
  // Add header with logo and title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE ANÁLISE DE IMÓVEL', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Leilão #${propertyDetails.id}`, 20, 28);
  doc.text(`Data de emissão: ${new Date().toLocaleDateString()}`, 20, 34);
  
  // Add property information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÕES DO IMÓVEL', 20, 45);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(propertyDetails.address, 20, 52);
  
  doc.setFontSize(10);
  doc.text(`Tipo: ${propertyDetails.type}`, 20, 60);
  doc.text(`Área: ${propertyDetails.area}`, 80, 60);
  doc.text(`Quartos: ${propertyDetails.bedrooms}`, 130, 60);
  doc.text(`Banheiros: ${propertyDetails.bathrooms}`, 20, 65);
  doc.text(`Vagas: ${propertyDetails.parking}`, 80, 65);
  doc.text(`Idade: ${propertyDetails.age}`, 130, 65);
  doc.text(`Conservação: ${propertyDetails.condition}`, 20, 70);
  
  // Financial Summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINANCEIRO', 20, 80);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Lance Mínimo: ${propertyDetails.minimumBid}`, 20, 88);
  doc.text(`Valor de Mercado: ${propertyDetails.marketValue}`, 80, 88);
  doc.text(`Desconto: ${propertyDetails.discount}`, 150, 88);
  doc.text(`Data do Leilão: ${propertyDetails.auction.date}`, 20, 93);
  doc.text(`Tipo de Leilão: ${propertyDetails.auction.type}`, 80, 93);
  
  // Risk Analysis Scores
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISE DE RISCOS', 20, 105);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Function to draw a score bar
  const drawScoreBar = (score: number, y: number) => {
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(220, 220, 220);
    doc.rect(80, y - 3, 60, 4, 'F');
    
    // Calculate the width based on the score (0-100)
    const width = (score / 100) * 60;
    
    // Set color based on score
    if (score >= 80) {
      doc.setFillColor(39, 174, 96); // green
    } else if (score >= 50) {
      doc.setFillColor(242, 153, 74); // amber
    } else {
      doc.setFillColor(231, 76, 60); // red
    }
    
    doc.rect(80, y - 3, width, 4, 'F');
  };
  
  doc.text('Risco Jurídico:', 20, 115);
  drawScoreBar(riskScores.legal, 115);
  doc.text(`${riskScores.legal}% Seguro`, 145, 115);
  
  doc.text('Risco Financeiro:', 20, 122);
  drawScoreBar(riskScores.financial, 122);
  doc.text(`${riskScores.financial}% Seguro`, 145, 122);
  
  doc.text('Risco Físico/Estrutural:', 20, 129);
  drawScoreBar(riskScores.physical, 129);
  doc.text(`${riskScores.physical}% Seguro`, 145, 129);
  
  doc.text('Avaliação Global:', 20, 136);
  drawScoreBar(riskScores.overall, 136);
  doc.text(`${riskScores.overall}% Seguro`, 145, 136);
  
  // Overall assessment
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONCLUSÃO DA ANÁLISE', 20, 148);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const conclusion = 'Considerando o desconto de 40% em relação ao valor de mercado, a localização privilegiada e os baixos riscos identificados, este imóvel representa uma excelente oportunidade de investimento com potencial de valorização após pequenas reformas.';
  
  const splitConclusion = doc.splitTextToSize(conclusion, 170);
  doc.text(splitConclusion, 20, 156);
  
  // Add a new page for detailed analyses
  doc.addPage();
  
  // Add header on the second page
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISE DA MATRÍCULA', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Matrícula: ${registryAnalysis.number}`, 20, 28);
  doc.text(`Cartório: ${registryAnalysis.notaryOffice}`, 20, 33);
  
  const registryText = 'A análise da matrícula não identificou ônus que impeçam a aquisição do imóvel. Consta penhora em processo de execução fiscal que será baixada após a arrematação, conforme previsto no edital.';
  const splitRegistry = doc.splitTextToSize(registryText, 170);
  doc.text(splitRegistry, 20, 40);
  
  // Owner history
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Cadeia Dominial', 20, 55);
  
  const ownerData = registryAnalysis.ownershipHistory.map((entry: any) => [
    entry.owner,
    entry.period,
    entry.acquisition
  ]);
  
  doc.autoTable({
    startY: 60,
    head: [['Proprietário', 'Período', 'Forma de Aquisição']],
    body: ownerData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] }
  });
  
  // Auction Analysis
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISE DO EDITAL', 20, doc.lastAutoTable.finalY + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Edital: ${auctionAnalysis.editalNumber}`, 20, doc.lastAutoTable.finalY + 23);
  doc.text(`Leilão: ${propertyDetails.auction.type}`, 100, doc.lastAutoTable.finalY + 23);
  doc.text(`Instituição: ${propertyDetails.auction.institution}`, 20, doc.lastAutoTable.finalY + 28);
  
  // Add a new page for financial analysis
  doc.addPage();
  
  // Valuation Analysis
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AVALIAÇÃO DO IMÓVEL', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Valor de Mercado', 20, 30);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(propertyValuation.marketPrice, 20, 37);
  doc.text(`${propertyValuation.pricePerSquareMeter}/m²`, 20, 43);
  
  // Comparable properties table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Imóveis Comparáveis', 20, 55);
  
  const comparableData = propertyValuation.comparativeProperties.map((prop: any) => [
    prop.address,
    prop.area,
    prop.price,
    prop.pricePerSqm
  ]);
  
  doc.autoTable({
    startY: 60,
    head: [['Endereço', 'Área', 'Preço', 'R$/m²']],
    body: comparableData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] }
  });
  
  // Financial Analysis
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VIABILIDADE FINANCEIRA', 20, doc.lastAutoTable.finalY + 15);
  
  // Acquisition costs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Custos de Aquisição', 20, doc.lastAutoTable.finalY + 25);
  
  const acquisitionData = financialAnalysis.acquisitionCosts.map((cost: any) => [
    cost.name,
    cost.value
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head: [['Item', 'Valor']],
    body: acquisitionData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] },
    margin: { right: 100 } // Make it narrower
  });
  
  // Renovation costs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Custos de Reforma', 110, doc.lastAutoTable.finalY - 30);
  
  const renovationData = financialAnalysis.renovationCosts.map((cost: any) => [
    cost.name,
    cost.value
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY - 25,
    head: [['Item', 'Valor']],
    body: renovationData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] },
    margin: { left: 110 } // Position it to the right
  });
  
  // Add a new page for recommendations
  doc.addPage();
  
  // Recommendations
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDAÇÕES', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 30;
  recommendations.forEach((rec, index) => {
    const splitRec = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
    doc.text(splitRec, 20, yPos);
    yPos += splitRec.length * 5 + 5; // Adjust y position based on text height
  });
  
  // Next Steps
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PRÓXIMOS PASSOS', 20, yPos + 10);
  
  const nextSteps = [
    'Agendar visita ao imóvel para inspeção detalhada',
    'Verificar documentação completa do processo',
    'Providenciar recursos financeiros para o lance e custos adicionais',
    'Cadastrar-se na plataforma do leiloeiro com antecedência'
  ];
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  yPos += 20;
  nextSteps.forEach((step, index) => {
    doc.text(`${index + 1}. ${step}`, 20, yPos);
    yPos += 7;
  });
  
  // Add footer with verification info
  const footerText = `Documento verificável em: ${verificationUrl}`;
  const footerTextWidth = doc.getTextWidth(footerText);
  
  // Add QR code to the last page
  doc.addImage(qrCodeDataUrl, 'PNG', 20, 230, 30, 30);
  
  // Add verification text
  doc.setFontSize(9);
  doc.text('Verificação de Autenticidade', 55, 245);
  doc.text(footerText, 55, 250);
  doc.text(`ID: ${verificationId}`, 55, 255);
  
  // Add page numbers to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(`Página ${i} de ${pageCount}`, 170, 285, { align: 'right' });
  }
  
  return doc.output('blob');
};
