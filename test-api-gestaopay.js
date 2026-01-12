const https = require('https');

// SUAS CREDENCIAIS (Copiadas do .env.local)
const publicKey = "pk_sRctiH1rrFynPIhDGb-kpd41ebmn0SImP4DCSLQs_M9phCGm";
const secretKey = "sk_la9mlWiOxzUbCqzEaEWIzShbV8UMoVjr71bosbfkGvhdI9k6";

const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

const payload = JSON.stringify({
  amount: 4700,
  paymentMethod: 'pix',
  customer: {
    name: "Teste de Sistema",
    email: "teste@email.com",
    phone: "11999999999",
    document: {
      number: "11111111111", // CPF Genérico para teste (pode falhar se tiver validação rigorosa)
      type: "cpf"
    }
  },
  items: [
    {
      title: "Chip Starlink Teste",
      unitPrice: 4700,
      quantity: 1,
      tangible: true
    }
  ],
  description: "Teste de API Backend"
});

const options = {
  hostname: 'api.gestaopay.com.br',
  path: '/v1/transactions',
  method: 'POST',
  headers: {
    'Authorization': auth,
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

console.log("Tentando conectar a GestãoPay...");

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('RESPOSTA:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(`ERRO NA REQUISIÇÃO: ${e.message}`);
});

req.write(payload);
req.end();
