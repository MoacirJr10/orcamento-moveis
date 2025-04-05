package com.seuprojeto.orcamento.services;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;

@Service
public class OrcamentoPdfService{

    public void gerarPdf(Long orcamentoId) throws Exception{
        String filePath = "orcamento_" + orcamentoId + ".pdf";
        File file - new File(filePath);
        PdfWriter writer = new PdfWriter(new FileOutputStream(file));

        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);

        document.add(new Paragraph("Orçamento ID: " + orcamentoId));
        document.add(new Paragraph("Cliente: Nome do Cliente"));
        document.add(new Paragraph("Total: R$ 1.000,00"));

        document.close();
    }
}