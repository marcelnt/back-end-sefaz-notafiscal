import fs from 'fs';
import PDFDocument from 'pdfkit';
import { parseStringPromise } from 'xml2js';

export async function gerarDanfePDF(caminhoXml, chaveAcesso, caminhoSaidaPdf) {
  try {
    const xmlString = fs.readFileSync(caminhoXml, 'utf-8');
    const parsed = await parseStringPromise(xmlString, { explicitArray: false });

    // Extrai o nó NFe da estrutura
    const nfeObj = parsed.nfeProc ? parsed.nfeProc.NFe : (parsed.NFe || parsed);
    const infNFe = nfeObj.infNFe || nfeObj;
    
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const ide = infNFe.ide || {};
    const total = infNFe.total?.ICMSTot || {};

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 30 });
      const stream = fs.createWriteStream(caminhoSaidaPdf);
      doc.pipe(stream);

      // --- ESTRUTURA VISUAL DO DANFE (PDF) ---
      doc.rect(30, 30, 535, 780).stroke();
      doc.fontSize(11).font('Helvetica-Bold').text('RECEBEMOS DE SENAI SP CURSOS TECNICOS LTDA OS PRODUTOS/SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO', 40, 40, { width: 380 });
      doc.fontSize(10).font('Helvetica').text(`NF-e Nº: ${ide.nNF || '1'}  SÉRIE: ${ide.serie || '1'}`, 440, 40);

      doc.moveTo(30, 80).lineTo(565, 80).stroke();

      // Emitente
      doc.fontSize(11).font('Helvetica-Bold').text(emit.xNome || 'SENAI SP CURSOS TECNICOS LTDA', 40, 90);
      doc.fontSize(8).font('Helvetica')
         .text(`CNPJ: ${emit.CNPJ || ''}`, 40, 108)
         .text(`Inscrição Estadual: ${emit.IE || ''}`, 40, 120)
         .text(`${emit.enderEmit?.xLgr || ''}, ${emit.enderEmit?.nro || ''} - ${emit.enderEmit?.xMun || ''}/${emit.enderEmit?.UF || ''}`, 40, 132);

      doc.fontSize(10).font('Helvetica-Bold').text('DANFE', 320, 90);
      doc.fontSize(8).font('Helvetica').text('DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA', 300, 105);
      
      doc.fontSize(8).font('Helvetica-Bold').text('CHAVE DE ACESSO:', 300, 125);
      doc.fontSize(8).font('Helvetica').text(chaveAcesso || '35261012345678000195550010000000011234567890', 300, 137);

      doc.moveTo(30, 155).lineTo(565, 155).stroke();

      // Destinatário
      doc.fontSize(9).font('Helvetica-Bold').text('DESTINATÁRIO / REMETENTE', 40, 162);
      doc.fontSize(8).font('Helvetica')
         .text(`NOME / RAZÃO SOCIAL: ${dest.xNome || ''}`, 40, 176)
         .text(`CPF/CNPJ: ${dest.CPF || dest.CNPJ || ''}`, 380, 176)
         .text(`ENDEREÇO: ${dest.enderDest?.xLgr || ''}, ${dest.enderDest?.nro || ''}`, 40, 190)
         .text(`BAIRRO: ${dest.enderDest?.xBairro || ''}`, 380, 190);

      doc.moveTo(30, 210).lineTo(565, 210).stroke();

      // Totais
      doc.fontSize(9).font('Helvetica-Bold').text('CÁLCULO DO IMPOSTO', 40, 217);
      doc.fontSize(8).font('Helvetica')
         .text(`BASE DE CÁLC. DO ICMS: R$ ${total.vBC || '0.00'}`, 40, 230)
         .text(`VALOR DO ICMS: R$ ${total.vICMS || '0.00'}`, 180, 230)
         .text(`VALOR TOTAL DOS PRODUTOS: R$ ${total.vProd || '0.00'}`, 330, 230)
         .text(`VALOR TOTAL DA NOTA: R$ ${total.vNF || '0.00'}`, 40, 244);

      doc.moveTo(30, 260).lineTo(565, 260).stroke();

      // Tabela de Produtos
      doc.fontSize(9).font('Helvetica-Bold').text('DADOS DOS PRODUTOS / SERVIÇOS', 40, 267);
      doc.fontSize(8).font('Helvetica-Bold')
         .text('CÓDIGO', 40, 282)
         .text('DESCRIÇÃO', 100, 282)
         .text('NCM', 300, 282)
         .text('QNTD', 380, 282)
         .text('V. UNIT', 440, 282)
         .text('V. TOTAL', 500, 282);

      doc.moveTo(30, 295).lineTo(565, 295).stroke();

      const detList = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];
      let y = 303;

      detList.forEach((item) => {
        if (!item) return;
        const prod = item.prod || {};
        doc.fontSize(8).font('Helvetica')
           .text(prod.cProd || '001', 40, y)
           .text(prod.xProd || 'PRODUTO', 100, y, { width: 190 })
           .text(prod.NCM || '', 300, y)
           .text(prod.qCom || '1', 380, y)
           .text(`R$ ${prod.vUnCom || '0.00'}`, 440, y)
           .text(`R$ ${prod.vProd || '0.00'}`, 500, y);
        y += 18;
      });

      doc.end();

      stream.on('finish', () => {
        console.log(`✅ DANFE PDF gerado com sucesso em: ${caminhoSaidaPdf}`);
        resolve(caminhoSaidaPdf);
        // return caminhoSaidaPdf
      });

      stream.on('error', (err) => reject(err));
    });
  } catch (erro) {
      console.error('Erro no danfeGenerator:', erro);
    throw erro;
  }
}