import express from 'express';
import fs from 'fs';
import path from 'path';
import { gerarDanfePDF } from './danfeGenerator.js';

const app = express();
app.use(express.json());

app.post('/api/nfe/processar-completo', async (req, res) => {
  try {

    const dados = req.body
    console.log(dados)
    const chaveAcesso = '35261012345678000195550010000000011234567890';
    const idInfNFe = `NFe${chaveAcesso}`;

    // 1. Estrutura nfeProc completa exigida pela biblioteca do DANFE
    const xmlBruto = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="${idInfNFe}" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>12345678</cNF>
        <natOp>VENDA DE MERCADORIA</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>1</nNF>
        <dhEmi>2026-10-07T15:00:00-03:00</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <cDV>0</cDV>
        <tpAmb>2</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>1</indFinal>
        <indPres>1</indPres>
        <procEmi>0</procEmi>
        <verProc>1.0.0</verProc>
      </ide>
      <emit>
        <CNPJ>12345678000195</CNPJ>
        <xNome>SENAI SP CURSOS TECNICOS LTDA</xNome>
        <xFant>SENAI SP</xFant>
        <enderEmit>
          <xLgr>RUA SENAI</xLgr>
          <nro>100</nro>
          <xBairro>CENTRO</xBairro>
          <cMun>3550308</cMun>
          <xMun>SAO PAULO</xMun>
          <UF>SP</UF>
          <CEP>01000000</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderEmit>
        <IE>123456789</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        <CPF>12345678901</CPF>
        <xNome>${dados.cliente.nome}</xNome>
        <enderDest>
          <xLgr>AVENIDA DOS ALUNOS</xLgr>
          <nro>50</nro>
          <xBairro>JARDIM TESTE</xBairro>
          <cMun>3550308</cMun>
          <xMun>SAO PAULO</xMun>
          <UF>SP</UF>
          <CEP>02000000</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderDest>
        <indIEDest>9</indIEDest>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>001</cProd>
          <cEAN>SEM GTIN</cEAN>
          <xProd>CURSO NODEJS BACKEND SENAI</xProd>
          <NCM>85234990</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>1.0000</qCom>
          <vUnCom>150.00</vUnCom>
          <vProd>150.00</vProd>
          <cEANTrib>SEM GTIN</cEANTrib>
          <uTrib>UN</uTrib>
          <qTrib>1.0000</qTrib>
          <vUnTrib>150.00</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <vTotTrib>0.00</vTotTrib>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>3</modBC>
              <vBC>150.00</vBC>
              <pICMS>18.00</pICMS>
              <vICMS>27.00</vICMS>
            </ICMS00>
          </ICMS>
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vBC>150.00</vBC>
          <vICMS>27.00</vICMS>
          <vICMSDeson>0.00</vICMSDeson>
          <vFCP>0.00</vFCP>
          <vBCST>0.00</vBCST>
          <vST>0.00</vST>
          <vFCPST>0.00</vFCPST>
          <vFCPSTRet>0.00</vFCPSTRet>
          <vProd>150.00</vProd>
          <vFrete>0.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>0.00</vDesc>
          <vII>0.00</vII>
          <vIPI>0.00</vIPI>
          <vIPIDevol>0.00</vIPIDevol>
          <vPIS>0.00</vPIS>
          <vCOFINS>0.00</vCOFINS>
          <vOutro>0.00</vOutro>
          <vNF>150.00</vNF>
          <vTotTrib>0.00</vTotTrib>
        </ICMSTot>
      </total>
      <transp>
        <modFrete>9</modFrete>
      </transp>
      <pag>
        <detPag>
          <tPag>01</tPag>
          <vPag>150.00</vPag>
        </detPag>
      </pag>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>2</tpAmb>
      <verAplic>1.0.0</verAplic>
      <chNFe>${chaveAcesso}</chNFe>
      <dhRecto>2026-10-07T15:00:00-03:00</dhRecto>
      <nProt>135260000000000</nProt>
      <digVal>SIMULADO=</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;

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
    await gerarDanfePDF(xmlOutputPath, chaveAcesso, pdfOutputPath);

    return res.json({
      sucesso: true,
      mensagem: 'NF-e e DANFE PDF gerados com sucesso!',
      caminhoXml: xmlOutputPath,
      caminhoPdf: pdfOutputPath
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