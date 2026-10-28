export const gerarDadosXMLNF = async function(dados){
    
    let chaveAcesso = dados.chave
    let idInfNFe = `NFe${chaveAcesso}`
    let xmlDanfe
    let xmlProdutos
    let idProduto = 0

    // 1. Estrutura nfeProc completa exigida pela biblioteca do DANFE
    let xmlEmitDest = `<?xml version="1.0" encoding="UTF-8"?>
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
            <CNPJ>${dados.emitente.cpf_cnpj}</CNPJ>
            <xNome>${dados.emitente.nome}</xNome>
            <xFant>${dados.emitente.nome_fantasia}</xFant>
            <enderEmit>
            <xLgr>${dados.emitente.endereco[0].logradouro}</xLgr>
            <nro>${dados.emitente.endereco[0].numero}</nro>
            <xBairro>${dados.emitente.endereco[0].bairro}</xBairro>
            <cMun></cMun>
            <xMun>${dados.emitente.endereco[0].cidade}</xMun>
            <UF>${dados.emitente.endereco[0].uf}</UF>
            <CEP>${dados.emitente.endereco[0].cep}</CEP>
            <cPais>1058</cPais>
            <xPais>BRASIL</xPais>
            </enderEmit>
            <IE>${dados.emitente.inscricao_estadual}</IE>
            <CRT>3</CRT>
        </emit>
        <dest>
            <CPF>${dados.detinatario.cpf_cnpj}</CPF>
            <xNome>${dados.detinatario.nome}</xNome>
            <enderDest>
            <xLgr>${dados.detinatario.endereco[0].logradouro}</xLgr>
            <nro>${dados.detinatario.endereco[0].numero}</nro>
            <xBairro>${dados.detinatario.endereco[0].bairro}</xBairro>
            <cMun></cMun>
            <xMun>${dados.detinatario.endereco[0].cidade}</xMun>
            <UF>${dados.detinatario.endereco[0].uf}</UF>
            <CEP>${dados.detinatario.endereco[0].cep}</CEP>
            <cPais>1058</cPais>
            <xPais>BRASIL</xPais>
            </enderDest>
            <indIEDest>9</indIEDest>
        </dest>
        `
    console.log(dados.produtos)
    dados.produtos.forEach(function(produto){
        idProduto+=1
        xmlProdutos = xmlProdutos + `<det nItem="1">
        <prod>
        <cProd>${String(idProduto).padStart(3, '0')}</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>${produto.descricao}</xProd>
        <NCM>${produto.ncm}</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>${produto.quantidade}</qCom>
        <vUnCom>${produto.valor_unitario}</vUnCom>
        <vProd>${produto.valor_unitario}</vProd>
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
    </det>`
    })

    

    let xmlTotal = `<total>
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
    </nfeProc>`

    xmlDanfe = xmlEmitDest + xmlProdutos + xmlTotal

    return xmlDanfe
}

