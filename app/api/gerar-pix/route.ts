import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, cpf } = body;

    // Validação básica dos campos obrigatórios
    if (!nome || !email || !telefone || !cpf) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const url = 'https://api.gestaopay.com.br/v1/transactions';
    
    // Acessando as variáveis de ambiente (agora seguro no servidor)
    const publicKey = process.env.NEXT_PUBLIC_GESTOPAY_PUBLIC_KEY;
    const secretKey = process.env.NEXT_PUBLIC_GESTOPAY_SECRET_KEY;

    if (!publicKey || !secretKey) {
      console.error("Credenciais da GestãoPay não encontradas.");
      return NextResponse.json(
        { message: 'Erro interno de configuração: Credenciais ausentes.' },
        { status: 500 }
      );
    }

    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const payload = {
      amount: 4700, // R$ 47,00 (em centavos)
      paymentMethod: 'pix',
      customer: {
        name: nome,
        email: email,
        phone: telefone.replace(/\D/g, ""),
        document: {
          number: cpf.replace(/\D/g, ""),
          type: "cpf"
        }
      },
      items: [
        {
          title: "Chip Starlink",
          unitPrice: 4700,
          quantity: 1,
          tangible: true
        }
      ],
      description: "Pagamento Chip Starlink",
      // callbackUrl: "URL_DO_SEU_WEBHOOK" // Pode ser adicionado posteriormente
    };

    console.log("Enviando payload para GestãoPay:", JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resposta de ERRO completa da GestãoPay:", JSON.stringify(data, null, 2));
      
      let errorDetails = "";
      if (data.errors && Array.isArray(data.errors)) {
        errorDetails = " Detalhes: " + data.errors.map((e: any) => `${e.field}: ${e.message}`).join(", ");
      } else if (typeof data.errors === 'object') {
         errorDetails = " Detalhes: " + JSON.stringify(data.errors);
      }

      const errorMsg = (data.message || "Erro desconhecido") + errorDetails;
      
      return NextResponse.json(
        { message: `Falha na API GestãoPay: ${errorMsg}` },
        { status: response.status }
      );
    }

    console.log("Resposta de SUCESSO da GestãoPay:", JSON.stringify(data, null, 2));

    // Processamento da resposta de sucesso
    // A API retorna o "copia e cola" no campo data.pix.qrcode
    const copiaCola = data.pix?.qrcode;

    if (!copiaCola) {
      return NextResponse.json(
        { message: 'Transação criada, mas código Pix não retornado pela operadora.' },
        { status: 500 }
      );
    }

    // Gerar URL do QR Code usando uma API pública (já que a GestãoPay não mandou a imagem)
    // Isso garante que o <img src="..."> do frontend funcione
    const qrCodeBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(copiaCola)}`;

    return NextResponse.json({
      qrCodeBase64, // Agora é uma URL, mas funcionará igual no <img src>
      copiaCola
    });

  } catch (error: any) {
    console.error("ERRO no servidor ao gerar Pix:", error);
    return NextResponse.json(
      { message: `Erro interno: ${error.message}` },
      { status: 500 }
    );
  }
}