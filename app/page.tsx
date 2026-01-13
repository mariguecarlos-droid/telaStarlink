"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Wifi, MapPin, Zap, Shield, Phone, Star, Users, Clock, Award, Sparkles, Rocket, Radio, Circle, Copy, X, Loader2 } from "lucide-react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  
  // Estados para o Pagamento
  const [loading, setLoading] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64?: string; copiaCola?: string } | null>(null);

  // --- INTERAÇÃO COM API LOCAL (Segurança) ---
  const gerarPix = async () => {
    try {
      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          cpf
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao conectar com o servidor.");
      }

      return data; // Espera-se { qrCodeBase64, copiaCola }

    } catch (error: any) {
      console.error("ERRO ao solicitar Pix:", error);
      alert(`Não foi possível gerar o Pix: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Aqui você pode salvar o lead no seu banco de dados antes de gerar o pagamento

    // 2. Gerar o Pix (Simulado)
    const data = await gerarPix();

    if (data) {
      setPixData(data);
      setShowPixModal(true);
    }
    
    setLoading(false);
  };

  const copiarCodigo = () => {
    if (pixData?.copiaCola) {
      navigator.clipboard.writeText(pixData.copiaCola);
      alert("Código Pix copiado! Cole no app do seu banco.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      
      {/* --- MODAL DE PAGAMENTO PIX --- */}
      {showPixModal && pixData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl border-4 border-cyan-400/50 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPixModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Quase lá, {nome.split(" ")[0]}!</h3>
              <p className="text-gray-600 mb-6">
                Escaneie o QR Code abaixo ou copie o código para finalizar seu pedido do <strong className="text-blue-600">Chip Starlink</strong>.
              </p>

              <div className="bg-gray-100 p-4 rounded-xl mb-6 inline-block border-2 border-dashed border-gray-300">
                {/* Aqui virá a imagem Base64 real da API */}
                <img 
                  src={pixData.qrCodeBase64} 
                  alt="QR Code Pix" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Código Pix Copia e Cola</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={pixData.copiaCola}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg p-3 focus:outline-none"
                  />
                  <button 
                    onClick={copiarCodigo}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg transition-colors"
                    title="Copiar código"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 animate-pulse text-orange-500" />
                  <span>Aguardando pagamento...</span>
                </div>
                <button 
                  onClick={() => alert("Na integração real, isso verificaria o status automaticamente!")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-600/30"
                >
                  JÁ FIZ O PAGAMENTO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Satélites Animados no Fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Satélite 1 - Orbita da esquerda para direita */}
        <div className="absolute top-20 left-0 animate-[moveRight_20s_linear_infinite]">
          <div className="relative">
            <Radio className="w-12 h-12 text-cyan-400 animate-pulse" />
            {/* Ondas de transmissão */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 border-2 border-cyan-400/40 rounded-full animate-ping"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-500">
              <div className="w-16 h-16 border-2 border-blue-400/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Satélite 2 - Orbita da direita para esquerda */}
        <div className="absolute top-40 right-0 animate-[moveLeft_25s_linear_infinite]">
          <div className="relative">
            <Radio className="w-10 h-10 text-blue-400 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 border-2 border-blue-400/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Satélite 3 - Orbita diagonal */}
        <div className="absolute bottom-40 left-1/4 animate-[moveDiagonal_30s_linear_infinite]">
          <div className="relative">
            <Radio className="w-8 h-8 text-purple-400 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-14 h-14 border-2 border-purple-400/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Premium com Badge VIA SATÉLITE */}
      <header className="relative bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image 
                src="/lgoo.png" 
                alt="Starlink Chip Logo" 
                width={150} 
                height={40} 
                className="filter invert" // Adiciona um filtro para inverter as cores, transformando o logo preto em branco.
              />
            </div>
            <div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400 ml-1">5.0 (2.847 avaliações)</span>
              </div>
            </div>
          </div>
          
          {/* Badge VIA SATÉLITE no Header */}
          <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-full animate-pulse">
            <Radio className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">VIA SATÉLITE</span>
            <div className="relative">
              <Circle className="w-2 h-2 text-white fill-white animate-ping" />
            </div>
          </div>

          <a 
            href="#adquirir" 
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg hover:shadow-orange-500/50 text-sm md:text-base"
          >
            Adquirir Agora
          </a>
        </div>
      </header>

      {/* Hero Section Premium com Satélite Gigante */}
      <section className="relative container mx-auto px-4 py-12 md:py-20 lg:py-28">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge de Promoção */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm md:text-base mb-8 animate-bounce shadow-2xl">
            <Sparkles className="w-5 h-5" />
            <span>PROMOÇÃO EXCLUSIVA ZONA RURAL</span>
            <Sparkles className="w-5 h-5" />
          </div>

          {/* Badge VIA SATÉLITE Gigante e Chamativo */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-8 py-4 rounded-2xl border-4 border-white/30 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Radio className="w-12 h-12 text-white animate-pulse" />
                  {/* Ondas de transmissão ao redor do ícone */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-300">
                    <div className="w-16 h-16 border-4 border-white/40 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl md:text-5xl font-black text-white flex items-center gap-2">
                    <span>VIA SATÉLITE</span>
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-semibold mt-1">
                    Tecnologia Espacial de Última Geração 🛰️
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-tight">
            Internet de Alta Velocidade
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mt-2">
              Direto no Seu Chip!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-medium">
            Isso mesmo! Você da <span className="text-green-400 font-bold">zona rural</span>, adquira seu chip Starlink por apenas
          </p>
          
          {/* Preço Destaque */}
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white px-10 md:px-16 py-6 md:py-8 rounded-3xl shadow-2xl border-4 border-white/20">
              <div className="text-sm md:text-base font-semibold opacity-90 mb-1">Apenas</div>
              <div className="flex items-start justify-center">
                <span className="text-3xl md:text-4xl font-bold mt-2">R$</span>
                <span className="text-6xl md:text-8xl lg:text-9xl font-black">47</span>
                <span className="text-2xl md:text-3xl font-bold mt-2">,00</span>
              </div>
              <div className="text-sm md:text-base font-semibold opacity-90 mt-1">Pagamento único • Sem mensalidade</div>
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-12 animate-pulse">
            E ative agora mesmo! 🚀
          </p>
          
          {/* CTA Principal */}
          <a 
            href="#adquirir"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-10 md:px-16 py-5 md:py-6 rounded-full text-xl md:text-2xl font-black hover:scale-105 transition-all shadow-2xl hover:shadow-orange-500/50 mb-8"
          >
            <Rocket className="w-6 h-6 md:w-8 md:h-8" />
            QUERO MEU CHIP AGORA!
          </a>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-300 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span><strong className="text-white">12.847+</strong> clientes satisfeitos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span><strong className="text-white">Entrega</strong> em 3-5 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span><strong className="text-white">Garantia</strong> de 30 dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção DESTAQUE - Como Funciona VIA SATÉLITE */}
      <section className="relative py-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-white blur-2xl opacity-30 animate-pulse"></div>
              <Radio className="relative w-20 h-20 md:w-32 md:h-32 text-white mx-auto animate-pulse" />
              {/* Ondas gigantes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-white/40 rounded-full animate-ping"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-500">
                <div className="w-40 h-40 md:w-56 md:h-56 border-4 border-white/30 rounded-full animate-ping"></div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              🛰️ CONEXÃO VIA SATÉLITE 🛰️
            </h2>
            <p className="text-xl md:text-3xl text-white/90 mb-8 font-bold">
              Tecnologia espacial que conecta você de QUALQUER LUGAR!
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30">
                <div className="text-5xl mb-4">🛰️</div>
                <h3 className="text-2xl font-black text-white mb-3">Satélites em Órbita</h3>
                <p className="text-white/80">Rede de satélites de última geração transmitindo sinal 24/7</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30">
                <div className="text-5xl mb-4">📡</div>
                <h3 className="text-2xl font-black text-white mb-3">Recepção Direta</h3>
                <p className="text-white/80">Seu chip recebe o sinal direto do espaço, sem intermediários</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-black text-white mb-3">Internet Rápida</h3>
                <p className="text-white/80">Velocidade de até 100 Mbps mesmo na zona rural mais remota</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section className="relative py-12 md:py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-10">
            O que nossos clientes dizem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200 mb-4 italic">"Finalmente internet rápida na minha fazenda! Mudou minha vida completamente. Recomendo demais!"</p>
              <p className="text-cyan-400 font-bold">— João Silva, Goiás</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200 mb-4 italic">"Incrível! Por R$ 47 tenho internet melhor que na cidade. Meus filhos adoram!"</p>
              <p className="text-cyan-400 font-bold">— Maria Santos, Minas Gerais</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200 mb-4 italic">"Melhor investimento que já fiz! Trabalho home office tranquilamente agora."</p>
              <p className="text-cyan-400 font-bold">— Carlos Oliveira, Bahia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Premium com Ícones de Satélite */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Por que escolher <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Starlink Chip</span>?
            </h2>
            <p className="text-xl text-gray-300">A revolução da internet chegou na zona rural</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Internet Ultra Rápida</h3>
              <p className="text-gray-300 leading-relaxed">
                Velocidade de até <strong className="text-cyan-400">100 Mbps</strong> mesmo nas áreas mais remotas. Assista vídeos em HD, faça videochamadas e trabalhe sem travamentos.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden">
              {/* Badge VIA SATÉLITE no card */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <Radio className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-bold">VIA SATÉLITE</span>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform relative">
                <MapPin className="w-8 h-8 text-white" />
                {/* Ondas ao redor do ícone */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-green-400/40 rounded-full animate-ping"></div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Cobertura Total</h3>
              <p className="text-gray-300 leading-relaxed">
                Funciona em <strong className="text-cyan-400">qualquer lugar</strong> da zona rural, sem limite de distância. Tecnologia via satélite de última geração.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden">
              {/* Flash de satélite */}
              <div className="absolute top-2 right-2">
                <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Conexão Estável</h3>
              <p className="text-gray-300 leading-relaxed">
                Tecnologia via satélite garante sinal <strong className="text-cyan-400">constante e confiável</strong>, sem quedas ou instabilidade.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Ativação Instantânea</h3>
              <p className="text-gray-300 leading-relaxed">
                Insira o chip e comece a usar <strong className="text-cyan-400">imediatamente</strong>, sem instalação, sem técnico, sem complicação.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Sem Mensalidade</h3>
              <p className="text-gray-300 leading-relaxed">
                Pague apenas <strong className="text-green-400">R$ 47 uma vez</strong> e tenha internet de qualidade sem preocupação com contas mensais.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Dados Ilimitados</h3>
              <p className="text-gray-300 leading-relaxed">
                Use <strong className="text-cyan-400">à vontade</strong> sem preocupação com franquia ou limite de dados. Internet verdadeiramente ilimitada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Urgência */}
      <section className="relative py-12 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ⚠️ ATENÇÃO: Estoque Limitado!
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            Restam apenas <strong className="text-yellow-300">127 chips</strong> disponíveis nesta promoção
          </p>
          <a 
            href="#adquirir"
            className="inline-block bg-white text-red-600 px-10 py-4 rounded-full text-xl font-black hover:scale-105 transition-all shadow-2xl"
          >
            GARANTIR MEU CHIP AGORA! 🔥
          </a>
        </div>
      </section>

      {/* Formulário Premium */}
      <section id="adquirir" className="relative py-16 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-900/80 to-cyan-900/80 backdrop-blur-xl p-8 md:p-14 rounded-3xl border-2 border-cyan-500/40 shadow-2xl">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <Check className="w-4 h-4" />
                    <span>Formulário Seguro e Criptografado</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                    Garanta Seu Chip Agora!
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl">
                    Preencha os dados abaixo e receba seu chip em casa com <strong className="text-cyan-400">frete grátis</strong>
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">Nome Completo *</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-lg"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">CPF *</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      required
                      maxLength={14}
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-lg"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">Telefone/WhatsApp *</label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-lg"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">E-mail *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-lg"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">Cidade/Estado *</label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-lg"
                      placeholder="Ex: São Paulo/SP"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-5 md:py-6 rounded-xl text-xl md:text-2xl font-black hover:scale-105 transition-all shadow-2xl hover:shadow-orange-500/50 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        GERANDO PIX...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6" />
                        ADQUIRIR POR R$ 47,00
                      </>
                    )}
                  </button>
                  
                  <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-center">
                    <p className="text-green-300 font-semibold flex items-center justify-center gap-2 flex-wrap text-sm md:text-base">
                      <Check className="w-5 h-5" />
                      <span>Pagamento 100% seguro</span>
                      <span>•</span>
                      <Check className="w-5 h-5" />
                      <span>Frete grátis</span>
                      <span>•</span>
                      <Check className="w-5 h-5" />
                      <span>Garantia de 30 dias</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <details className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 group">
              <summary className="font-bold text-white text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Como funciona o Chip Starlink?</span>
                <span className="text-cyan-400 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                O Chip Starlink utiliza tecnologia via satélite de última geração. Basta inserir o chip em qualquer dispositivo compatível e você terá acesso à internet de alta velocidade imediatamente, sem necessidade de instalação ou configuração complexa.
              </p>
            </details>

            <details className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 group">
              <summary className="font-bold text-white text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Realmente não tem mensalidade?</span>
                <span className="text-cyan-400 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Sim! Você paga apenas R$ 47,00 uma única vez e tem acesso ilimitado à internet sem nenhuma cobrança mensal. É um pagamento único e definitivo.
              </p>
            </details>

            <details className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 group">
              <summary className="font-bold text-white text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Quanto tempo demora para receber?</span>
                <span className="text-cyan-400 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                A entrega é realizada em 3 a 5 dias úteis para todo o Brasil, com frete totalmente grátis. Você receberá um código de rastreamento para acompanhar seu pedido.
              </p>
            </details>

            <details className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 group">
              <summary className="font-bold text-white text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Funciona em qualquer lugar?</span>
                <span className="text-cyan-400 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Sim! A tecnologia via satélite garante cobertura em 100% do território nacional, incluindo as áreas mais remotas da zona rural onde outros serviços não chegam.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="relative bg-black/60 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">Starlink Chip</span>
              </div>
              <p className="text-gray-400">
                Conectando a zona rural com internet de alta velocidade via satélite.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>📞 0800 123 4567</p>
                <p>📧 contato@starlinkchip.com.br</p>
                <p>⏰ Atendimento 24h</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Garantias</h3>
              <div className="space-y-2 text-gray-400">
                <p>✅ Satisfação garantida</p>
                <p>✅ Devolução em 30 dias</p>
                <p>✅ Suporte técnico gratuito</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p className="mb-2">© 2024 Starlink Chip - Todos os direitos reservados</p>
            <p className="text-sm">Internet via satélite de alta velocidade para todos os brasileiros</p>
          </div>
        </div>
      </footer>

      {/* Estilos para animações customizadas */}
    </div>
  );
}