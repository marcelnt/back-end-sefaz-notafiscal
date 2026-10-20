import fs from 'fs';
import forge from 'node-forge';
import { SignedXml } from 'xml-crypto';

/**
 * Extrai a Chave Privada e o Certificado X509 em formato PEM a partir de um arquivo .pfx (PKCS#12)
 * @param {string} pfxPath - Caminho do arquivo .pfx
 * @param {string} passphrase - Senha do certificado
 */
function extractPemKeysFromPfx(pfxPath, passphrase) {
  const pfxBuffer = fs.readFileSync(pfxPath);
  const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
  const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, false, passphrase);

  let privateKeyPem = null;
  let certPem = null;

  // Percorre as bolsas do PKCS#12 para localizar a chave privada e o certificado
  for (const safeContents of pfx.safeContents) {
    for (const safeBag of safeContents.safeBags) {
      if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag || safeBag.type === forge.pki.oids.keyBag) {
        privateKeyPem = forge.pki.privateKeyToPem(safeBag.key);
      }
      if (safeBag.type === forge.pki.oids.certBag) {
        certPem = forge.pki.certificateToPem(safeBag.cert);
      }
    }
  }

  if (!privateKeyPem || !certPem) {
    throw new Error('Não foi possível extrair a chave privada ou o certificado do arquivo PFX.');
  }

  return { privateKeyPem, certPem };
}

/**
 * Assina digitalmente o XML da NF-e no nó <infNFe>
 * @param {string} xmlString - Conteúdo do XML não assinado
 * @param {string} pfxPath - Caminho do arquivo .pfx
 * @param {string} passphrase - Senha do certificado A1
 * @param {string} idInfNFe - ID da tag NFe (ex: NFe35261012345678000195550010000000011234567890)
 */
export function assinarXML(xmlString, pfxPath, passphrase, idInfNFe) {
  const { privateKeyPem, certPem } = extractPemKeysFromPfx(pfxPath, passphrase);

  // Limpa o cabeçalho/rodapé do PEM para injetar a string pura na tag X509Certificate
  const cleanCert = certPem
    .replace(/-----BEGIN CERTIFICATE-----/g, '')
    .replace(/-----END CERTIFICATE-----/g, '')
    .replace(/[\r\n]/g, '');

  const sig = new SignedXml();

  // Configurações do Padrão SEFAZ para NF-e v4.00
  sig.addReference({
    xpath: `/*[local-name(.)='NFe']/*[local-name(.)='infNFe']`,
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
    ],
    digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1'
  });

  sig.signingKey = privateKeyPem;
  sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';

  // Customiza a estrutura da tag <KeyInfo> exigida pela SEFAZ
  sig.keyInfoProvider = {
    getKeyInfo: () => `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`
  };

  sig.computeSignature(xmlString, {
    location: {
      reference: `/*[local-name(.)='NFe']/*[local-name(.)='infNFe']`,
      action: 'after'
    }
  });

  return sig.getSignedXml();
}
