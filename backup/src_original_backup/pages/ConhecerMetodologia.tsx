import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart2, 
  Building, 
  Calculator, 
  CheckCircle, 
  Database, 
  FileText, 
  Layers, 
  Map,
  Scale,
  Search,
  Shield,
  TrendingUp, 
  Zap,
  AlertTriangle,
  Gauge,
  LineChart,
  Activity,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";

const ConhecerMetodologia = () => {
  const [activeSection, setActiveSection] = useState("visao-geral");
  const [scrollY, setScrollY] = useState(0);

  // Animate on scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <Layout className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lfcom-gray-900 to-lfcom-black text-white pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-lfcom-black/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Nossa Metodologia de Análise
            </h1>
            <p className="text-xl md:text-2xl text-lfcom-gray-200 mb-8">
              Descubra como transformamos dados em decisões inteligentes para seu investimento imobiliário
            </p>
            <Button className="bg-white text-lfcom-black hover:bg-lfcom-gray-200 h-12 px-8 rounded-md" asChild>
              <a href="#visao-geral">Explorar Metodologia</a>
            </Button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}></div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 bg-white z-30 border-b border-lfcom-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto pb-1 hide-scrollbar">
            <nav className="flex space-x-2 md:space-x-6 py-4">
              {[
                { id: "visao-geral", label: "Visão Geral" },
                { id: "coleta-dados", label: "Coleta de Dados" },
                { id: "analise-mercado", label: "Análise de Mercado" },
                { id: "risco-juridico", label: "Risk Assessment" },
                { id: "relatorio", label: "Relatório Final" }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`whitespace-nowrap px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-lfcom-black text-white"
                      : "text-lfcom-gray-600 hover:text-lfcom-black hover:bg-lfcom-gray-100"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth"
                    });
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Section: Visão Geral */}
        <section 
          id="visao-geral" 
          className="mb-20 py-10 scroll-mt-32"
          onMouseEnter={() => setActiveSection("visao-geral")}
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-2">Visão Geral da Metodologia</h2>
              <div className="w-20 h-1 bg-lfcom-black mb-8"></div>
              <p className="text-lfcom-gray-600 text-lg mb-12">
                Nossa metodologia proprietária combina análise de dados com expertise em mercado imobiliário e jurídico para fornecer uma visão completa sobre oportunidades em leilões. Desenvolvemos um processo de 4 etapas que identifica o valor real e os riscos associados a cada propriedade.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {[
                {
                  icon: <Database className="w-12 h-12 text-lfcom-black mb-4" />,
                  title: "Coleta de Dados Abrangente",
                  description: "Reunimos informações detalhadas sobre o imóvel, documentação, histórico e características do entorno."
                },
                {
                  icon: <TrendingUp className="w-12 h-12 text-lfcom-black mb-4" />,
                  title: "Análise de Mercado Precisa",
                  description: "Comparamos com mais de 50.000 transações recentes para determinar o valor justo de mercado."
                },
                {
                  icon: <Shield className="w-12 h-12 text-lfcom-black mb-4" />,
                  title: "Avaliação de Riscos Jurídicos",
                  description: "Identificamos possíveis problemas legais, ônus ou pendências que possam afetar a aquisição."
                },
                {
                  icon: <FileText className="w-12 h-12 text-lfcom-black mb-4" />,
                  title: "Relatório Completo e Acionável",
                  description: "Entregamos um documento com análises quantitativas e qualitativas para embasar sua decisão."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg border border-lfcom-gray-200 hover:border-lfcom-gray-300 hover:shadow-md transition-all"
                  variants={itemVariants}
                >
                  {item.icon}
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-lfcom-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Section: Coleta de Dados */}
        <section 
          id="coleta-dados" 
          className="mb-20 py-10 scroll-mt-32"
          onMouseEnter={() => setActiveSection("coleta-dados")}
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-2">Coleta e Tratamento de Dados</h2>
              <div className="w-20 h-1 bg-lfcom-black mx-auto mb-8"></div>
              <p className="text-lfcom-gray-600 text-lg max-w-2xl mx-auto">
                Nosso processo de coleta de dados utiliza múltiplas fontes para criar uma visão completa do imóvel e seu contexto.
              </p>
            </motion.div>

            <motion.div variants={containerVariants}>
              <div className="bg-lfcom-gray-100 rounded-2xl p-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="flex flex-col items-center text-center"
                    variants={itemVariants}
                  >
                    <div className="bg-lfcom-black rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Search className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Identificação</h3>
                    <p className="text-lfcom-gray-600">Coletamos todos os dados disponíveis no edital do leilão e documentos públicos</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center text-center"
                    variants={itemVariants}
                  >
                    <div className="bg-lfcom-black rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Building className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Caracterização</h3>
                    <p className="text-lfcom-gray-600">Mapeamos características físicas, estruturais e de localização do imóvel</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center text-center"
                    variants={itemVariants}
                  >
                    <div className="bg-lfcom-black rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Map className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Geolocalização</h3>
                    <p className="text-lfcom-gray-600">Analisamos o entorno e acessibilidade a serviços e infraestrutura</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.div 
                className="bg-white p-6 rounded-lg border border-lfcom-gray-200 flex items-start"
                variants={itemVariants}
              >
                <CheckCircle className="text-green-500 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Processamento de Documentos</h3>
                  <p className="text-lfcom-gray-600">
                    Utilizamos OCR (Reconhecimento Óptico de Caracteres) e processamento de linguagem natural para extrair informações relevantes de documentos públicos, incluindo certidões, matrículas e editais.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg border border-lfcom-gray-200 flex items-start"
                variants={itemVariants}
              >
                <CheckCircle className="text-green-500 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Validação de Dados</h3>
                  <p className="text-lfcom-gray-600">
                    Todos os dados coletados passam por um processo de validação para garantir a precisão e confiabilidade das informações que serão utilizadas nas análises.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg border border-lfcom-gray-200 flex items-start"
                variants={itemVariants}
              >
                <CheckCircle className="text-green-500 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Integrações com Bases de Dados</h3>
                  <p className="text-lfcom-gray-600">
                    Conectamos com múltiplas bases de dados públicas e privadas, incluindo registros de imóveis, bases notariais e informações urbanísticas municipais.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section: Análise de Mercado */}
        <section 
          id="analise-mercado" 
          className="mb-20 py-10 scroll-mt-32"
          onMouseEnter={() => setActiveSection("analise-mercado")}
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-2">Análise de Mercado</h2>
              <div className="w-20 h-1 bg-lfcom-black mb-8"></div>
              <p className="text-lfcom-gray-600 text-lg mb-12">
                Utilizamos algoritmos avançados para determinar com precisão o valor real de mercado do imóvel, considerando fatores micro e macroeconômicos.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 border border-lfcom-gray-200"
              variants={containerVariants}
            >
              <div className="bg-lfcom-gray-800 text-white p-6">
                <h3 className="text-xl font-bold">Nosso Algoritmo de Precificação</h3>
                <p className="text-lfcom-gray-300 mt-2">
                  Combinamos múltiplas metodologias de avaliação para obter o valor mais preciso
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <motion.div 
                  className="flex items-start border-b border-lfcom-gray-200 pb-6"
                  variants={itemVariants}
                >
                  <div className="bg-lfcom-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Análise Comparativa de Mercado</h4>
                    <p className="text-lfcom-gray-600 mt-1">
                      Comparamos o imóvel com transações semelhantes recentes na mesma região, considerando características como área, acabamento, idade e conservação.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start border-b border-lfcom-gray-200 pb-6"
                  variants={itemVariants}
                >
                  <div className="bg-lfcom-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Método da Renda</h4>
                    <p className="text-lfcom-gray-600 mt-1">
                      Calculamos o potencial de geração de renda do imóvel baseado no valor de aluguel da região e taxa de capitalização atual do mercado.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className="bg-lfcom-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Modelagem Estatística</h4>
                    <p className="text-lfcom-gray-600 mt-1">
                      Utilizamos modelos de regressão para ajustar os valores e considerar fatores como tendências de mercado, sazonalidade e projeções econômicas.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              <motion.div 
                className="bg-lfcom-gray-100 p-6 rounded-lg"
                variants={itemVariants}
              >
                <BarChart2 className="w-12 h-12 text-lfcom-black mb-4" />
                <h3 className="text-xl font-bold mb-2">Análise de Mercado Local</h3>
                <ul className="space-y-2 text-lfcom-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Oferta e demanda na região</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Tempo médio de venda</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Gap entre valor pedido e valor fechado</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Tendências de valorização</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-lfcom-gray-100 p-6 rounded-lg"
                variants={itemVariants}
              >
                <Calculator className="w-12 h-12 text-lfcom-black mb-4" />
                <h3 className="text-xl font-bold mb-2">Cálculo de Custos Adicionais</h3>
                <ul className="space-y-2 text-lfcom-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Custos de regularização</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Impostos e taxas de transferência</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Estimativa de reformas necessárias</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Débitos condominiais e tributos pendentes</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section: Risk Assessment */}
        <section 
          id="risco-juridico" 
          className="mb-20 py-10 scroll-mt-32"
          onMouseEnter={() => setActiveSection("risco-juridico")}
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    animate={{ 
                      boxShadow: ["0 0 0 rgba(66, 153, 225, 0.5)", "0 0 20px rgba(66, 153, 225, 0.8)", "0 0 0 rgba(66, 153, 225, 0.5)"] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <Activity className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute -inset-1 rounded-full"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    style={{ 
                      background: "linear-gradient(90deg, rgba(79, 70, 229, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)" 
                    }}
                  />
                </div>
                <h2 className="text-3xl font-bold mb-0">RiskPulse™</h2>
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mb-8"></div>
              <p className="text-lfcom-gray-600 text-lg mb-12">
                Nossa plataforma proprietária de análise de riscos que utiliza inteligência artificial e machine learning para identificar, avaliar e quantificar todos os fatores de risco associados ao seu investimento imobiliário.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="mb-12">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-8">
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="mr-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm"
                      animate={{ 
                        y: [0, -5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <Gauge className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold">
                      Índice de Risco RiskPulse™
                    </h3>
                  </div>
                  <p className="mb-6 text-blue-100">
                    Nossa tecnologia exclusiva analisa mais de 200 variáveis para gerar um índice preciso do nível de risco do investimento, permitindo comparações objetivas entre diferentes oportunidades.
                  </p>
                  
                  <div className="relative h-12 mb-6 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full rounded-full flex items-center px-4"
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ 
                        duration: 1.5,
                        delay: 0.5,
                      }}
                      style={{
                        background: "linear-gradient(90deg, rgba(52, 211, 153, 1) 0%, rgba(249, 215, 28, 1) 50%, rgba(239, 68, 68, 1) 100%)"
                      }}
                    >
                      <motion.div 
                        className="w-5 h-5 bg-white rounded-full absolute"
                        initial={{ left: "85%" }}
                        animate={{ 
                          left: ["85%", "83%", "87%", "85%"],
                          boxShadow: ["0 0 0px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.8)", "0 0 0px rgba(255,255,255,0.8)"],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 text-sm text-center">
                    <div className="bg-green-500 py-2 px-1 rounded font-medium">Muito Baixo</div>
                    <div className="bg-green-400 py-2 px-1 rounded font-medium">Baixo</div>
                    <div className="bg-yellow-400 py-2 px-1 rounded font-medium">Médio</div>
                    <div className="bg-orange-500 py-2 px-1 rounded font-medium">Alto</div>
                    <div className="bg-red-500 py-2 px-1 rounded font-medium">Muito Alto</div>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute top-1/4 right-10 w-20 h-20 rounded-full bg-blue-500/10 backdrop-blur-sm"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <motion.div 
                  className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 backdrop-blur-sm"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <pattern id="pattern-circles" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div 
                className="bg-white rounded-xl p-6 border border-indigo-100 shadow-lg shadow-indigo-100/20 relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50"></div>
                <div className="relative z-10">
                  <div className="p-3 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">IA Preditiva</h3>
                  <p className="text-lfcom-gray-600 mb-4">
                    Nosso algoritmo de inteligência artificial analisa milhares de casos anteriores para identificar padrões e prever potenciais riscos futuros.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Aprendizado contínuo com novos dados</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Identificação de correlações não óbvias</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Acurácia superior a 95% em previsões</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-6 border border-indigo-100 shadow-lg shadow-indigo-100/20 relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full blur-xl opacity-50"></div>
                <div className="relative z-10">
                  <div className="p-3 bg-purple-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <LineChart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Análise Multidimensional</h3>
                  <p className="text-lfcom-gray-600 mb-4">
                    Avaliamos riscos em diferentes dimensões para uma compreensão completa do cenário de investimento.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Riscos documentais e contratuais</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Condições do mercado e liquidez</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-lfcom-gray-600">Aspectos técnicos e estruturais</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100"
              variants={containerVariants}
            >
              <motion.h3 
                className="flex items-center text-2xl font-bold mb-6"
                variants={itemVariants}
              >
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                Módulos do RiskPulse™
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  {
                    icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
                    title: "Detector de Anomalias",
                    description: "Identifica padrões incomuns nos documentos e histórico do imóvel que podem representar riscos ocultos."
                  },
                  {
                    icon: <FileText className="w-6 h-6 text-blue-500" />,
                    title: "Análise Documental",
                    description: "Avaliação completa de toda documentação com extração automática de informações relevantes."
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
                    title: "Previsão de Contingências",
                    description: "Estima a probabilidade e impacto financeiro de possíveis complicações futuras."
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-purple-500" />,
                    title: "Recomendações Automatizadas",
                    description: "Sugestões personalizadas para mitigar os riscos identificados, com estimativa de custos."
                  }
                ].map((module, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="p-2 bg-white rounded-lg mr-4 shadow-md">
                      {module.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{module.title}</h4>
                      <p className="text-lfcom-gray-600 text-sm">{module.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 p-4 bg-blue-900/10 rounded-lg border border-blue-200"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="p-2 bg-blue-600 rounded-md mr-3"
                    animate={{
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 rgba(37, 99, 235, 0.4)",
                        "0 0 8px rgba(37, 99, 235, 0.6)",
                        "0 0 0 rgba(37, 99, 235, 0.4)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <Activity className="w-5 h-5 text-white" />
                  </motion.div>
                  <h5 className="font-semibold">Tecnologia em constante evolução</h5>
                </div>
                <p className="text-lfcom-gray-700 mt-2 text-sm">
                  Nossa plataforma é atualizada semanalmente com novos dados e melhorias nos algoritmos, garantindo análises cada vez mais precisas e abrangentes.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section: Relatório */}
        <section 
          id="relatorio" 
          className="mb-20 py-10 scroll-mt-32"
          onMouseEnter={() => setActiveSection("relatorio")}
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-2">Relatório Final de Análise</h2>
              <div className="w-20 h-1 bg-lfcom-black mx-auto mb-8"></div>
              <p className="text-lfcom-gray-600 text-lg max-w-2xl mx-auto">
                Consolidamos toda a análise em um relatório completo, com informações acionáveis para apoiar sua decisão de investimento.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-lg border border-lfcom-gray-200 overflow-hidden mb-12"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8">
                  <motion.h3 
                    className="text-2xl font-bold mb-6"
                    variants={itemVariants}
                  >
                    Componentes do Relatório
                  </motion.h3>
                  <motion.ul className="space-y-4" variants={containerVariants}>
                    {[
                      {
                        title: "Sumário Executivo",
                        desc: "Resumo conciso com os principais pontos e recomendações"
                      },
                      {
                        title: "Análise de Valor",
                        desc: "Detalhamento do valor de mercado e potencial de valorização"
                      },
                      {
                        title: "Avaliação de Risco",
                        desc: "Classificação dos riscos jurídicos e financeiros"
                      },
                      {
                        title: "Custos Projetados",
                        desc: "Estimativa de todos os custos envolvidos na aquisição"
                      },
                      {
                        title: "Recomendação Final",
                        desc: "Orientação clara sobre a viabilidade do investimento"
                      }
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        variants={itemVariants}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{item.title}</span>
                          <span className="text-sm text-lfcom-gray-600">{item.desc}</span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div className="bg-lfcom-gray-100 p-8 flex items-center justify-center">
                  <motion.div variants={itemVariants}>
                    <div className="max-w-xs mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-lfcom-gray-200">
                      <div className="bg-lfcom-black text-white p-4">
                        <h4 className="font-semibold">Relatório de Análise</h4>
                        <p className="text-xs text-lfcom-gray-300">Apto 75m² - Edital 342/2024</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-lfcom-gray-600">Valor do Lance Mínimo</span>
                          <span className="font-medium">R$ 245.000,00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-lfcom-gray-600">Valor de Mercado</span>
                          <span className="font-medium">R$ 410.000,00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-lfcom-gray-600">Potencial de Valorização</span>
                          <span className="text-green-600 font-medium">+67%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-lfcom-gray-600">Risco Jurídico</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Baixo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-lfcom-gray-600">Custos Adicionais</span>
                          <span className="font-medium">R$ 32.450,00</span>
                        </div>
                        <div className="pt-3 mt-2 border-t border-lfcom-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm">Viabilidade Final</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Alta</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800 h-12 px-8 rounded-md text-base group" asChild>
                <Link to="/nova-analise" className="flex items-center justify-center">
                  Solicitar Análise Agora
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* FAQ Section */}
      <section className="bg-lfcom-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Perguntas Frequentes</h2>
              <div className="w-20 h-1 bg-lfcom-black mx-auto mb-6"></div>
              <p className="text-lfcom-gray-600">Respostas para as dúvidas mais comuns sobre nossa metodologia de análise</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Quanto tempo leva para receber um relatório completo?",
                  answer: "Nossos relatórios são entregues em até 48 horas após o recebimento de todas as informações necessárias. Para análises urgentes, oferecemos um serviço prioritário com entrega em 24 horas."
                },
                {
                  question: "A análise inclui visita presencial ao imóvel?",
                  answer: "Nossa análise padrão é baseada em dados e não inclui visita presencial. No entanto, oferecemos esse serviço adicional para imóveis em determinadas localidades, mediante agendamento prévio."
                },
                {
                  question: "Como são calculados os custos adicionais do imóvel?",
                  answer: "Calculamos todos os custos associados à aquisição, incluindo impostos (ITBI), taxas de transferência, custos cartorários, débitos condominiais, tributos pendentes e uma estimativa de eventuais custos de regularização e reforma."
                },
                {
                  question: "Qual o nível de precisão da avaliação de valor de mercado?",
                  answer: "Nossa metodologia de avaliação tem uma margem de erro média de 5-8%, dependendo da disponibilidade de dados comparáveis na região. Utilizamos metodologias reconhecidas pelo mercado e órgãos reguladores."
                },
                {
                  question: "Posso usar o relatório para obter financiamento bancário?",
                  answer: "Nosso relatório não substitui uma avaliação formal para fins de financiamento bancário, mas serve como um excelente material complementar. Para fins de financiamento, recomendamos a contratação de um laudo de avaliação específico."
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg border border-lfcom-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-lfcom-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lfcom-gray-600 mb-4">
                Ainda tem dúvidas sobre como funciona nossa metodologia?
              </p>
              <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100" asChild>
                <Link to="/contato">Entre em Contato</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConhecerMetodologia;
