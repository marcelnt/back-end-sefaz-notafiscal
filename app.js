import express from 'express'
import fs from 'fs'
import path from 'path'
import { gerarDanfePDF } from './danfeGenerator.js'
import { gerarDadosXMLNF} from './gerar_dados.js'
import { converterPdfParaBase64 } from './gerar_base64.js'

const app = express();
app.use(express.json());

app.post('/api/nfe/processar-completo', async (req, res) => {
  try {

    const dados = req.body
    let chaveAcesso = dados.chave


    let xmlBruto = await gerarDadosXMLNF(dados)

    // 2. Garante a criação da pasta de saída
    const outputDir = path.resolve('./output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const xmlOutputPath = path.join(outputDir, `nfe_${chaveAcesso}.xml`);
    const pdfOutputPath = path.join(outputDir, `danfe_${chaveAcesso}.pdf`);

    // 3. Guarda o ficheiro XML
    fs.writeFileSync(xmlOutputPath, xmlBruto, 'utf-8');

    // 4. Gera o DANFE PDF
    let caminhoPDF = await gerarDanfePDF(xmlOutputPath, chaveAcesso, pdfOutputPath);
    let pdfBase64 = converterPdfParaBase64(caminhoPDF)
    // console.log(arquivoBase64)

    return res.json({
      sucesso: true,
      mensagem: 'NF-e e DANFE PDF gerados com sucesso!',
      caminhoXml: xmlOutputPath,
      caminhoPdf: pdfOutputPath,
      pdfBase64: `data:application/pdf;base64,${pdfBase64}`
    });

  } catch (error) {
    console.error('Erro na emissão:', error);
    return res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));