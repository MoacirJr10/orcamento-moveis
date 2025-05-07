package com.example.orcamento_moveis.service;

import com.example.orcamento_moveis.model.Orcamento;
import com.example.orcamento_moveis.model.ItemOrcamento;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    public byte[] gerarPdf(Orcamento orcamento) {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Configuração básica
            document.add(new Paragraph("ORÇAMENTO DE MÓVEIS",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            document.add(new Paragraph("Cliente: " + orcamento.getCliente()));
            document.add(new Paragraph("\n"));

            // Tabela de itens
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            // Cabeçalho
            table.addCell("Item");
            table.addCell("Descrição");
            table.addCell("Quantidade");
            table.addCell("Preço Total");

            // Itens
            int contador = 1;
            for (ItemOrcamento item : orcamento.getItens()) {
                table.addCell(String.valueOf(contador++));
                table.addCell(item.getNome());
                table.addCell(item.getQuantidade().toString());
                table.addCell("R$ " + String.format("%.2f", item.getPreco() * item.getQuantidade()));
            }

            document.add(table);

            // Total
            document.add(new Paragraph("\nValor Total: R$ " +
                    String.format("%.2f", orcamento.getValorTotal()),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD)));

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }

        return outputStream.toByteArray();
    }
}