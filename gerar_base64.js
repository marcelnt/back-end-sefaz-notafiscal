import fs from 'fs';

/**
 * Converte um arquivo PDF salvo em disco para a string Base64
 * @param {string} caminhoPdf - Caminho do arquivo PDF existente (ex: './output/danfe_123.pdf')
 * @return {string} String do PDF codificada em Base64
 */
export function converterPdfParaBase64(caminhoPdf) {
  try {
    if (!fs.existsSync(caminhoPdf)) {
      throw new Error(`O arquivo PDF não foi encontrado em: ${caminhoPdf}`);
    }

        // Lê o buffer do arquivo PDF salvo em disco
        const pdfBuffer = fs.readFileSync(caminhoPdf);

        // Converte e retorna para Base64
        return pdfBuffer.toString('base64');
  } catch (erro) {
        console.error('Erro ao converter PDF para Base64:', erro.message);
    throw erro;
  }
}