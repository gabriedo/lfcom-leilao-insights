
import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Share,
  ChevronLeft,
  GraduationCap,
  FileText,
  BookText
} from "lucide-react";

// This would typically come from an API
const getContentById = (type: string, id: string) => {
  // Mock data - in a real app, this would be fetched from an API
  const articles = [
    {
      id: "1",
      title: "Como avaliar o potencial de valorização de um imóvel",
      excerpt: "Guia completo para entender os fatores que influenciam no valor futuro de uma propriedade.",
      content: `
        <p>O mercado imobiliário é dinâmico e a valorização de um imóvel depende de diversos fatores. Neste artigo, vamos explorar os principais aspectos que influenciam o potencial de valorização de uma propriedade.</p>
        
        <h2>Localização é fundamental</h2>
        <p>Como dizem no mercado imobiliário: "localização, localização, localização". Este é, sem dúvida, o fator mais importante para a valorização de um imóvel. Propriedades em áreas centrais, com boa infraestrutura, fácil acesso ao transporte público, próximas a escolas, hospitais, parques e centros comerciais tendem a valorizar mais rapidamente.</p>
        
        <h2>Desenvolvimento da região</h2>
        <p>Áreas em desenvolvimento, que estão recebendo novos investimentos em infraestrutura, como metrô, shopping centers, universidades ou grandes empresas, têm grande potencial de valorização. Ficar atento a planos diretores da cidade e projetos de urbanização pode ser uma ótima estratégia para antecipar tendências de valorização.</p>
        
        <h2>Qualidade da construção</h2>
        <p>Imóveis bem construídos, com materiais de qualidade e que seguem as normas técnicas adequadas, tendem a se valorizar mais ao longo do tempo. A qualidade da construção influencia diretamente na durabilidade e nos custos de manutenção do imóvel.</p>
        
        <h2>Segurança da região</h2>
        <p>Áreas com baixos índices de criminalidade são naturalmente mais valorizadas. A sensação de segurança é um fator decisivo para muitos compradores e investidores.</p>
        
        <h2>Potencial de reforma e expansão</h2>
        <p>Imóveis que permitem reformas, ampliações ou que têm flexibilidade de uso também apresentam bom potencial de valorização. Terrenos amplos, por exemplo, podem permitir futuras expansões ou até mesmo novos empreendimentos.</p>
      `,
      category: "Análise de Mercado",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: "Ana Silva",
      date: "2025-03-15",
      readTime: "8 min",
      featured: true,
      relatedContent: ["2", "5"]
    },
    {
      id: "2",
      title: "Financiamento imobiliário: conheça as melhores taxas",
      excerpt: "Comparamos as taxas de juros e condições dos principais bancos para ajudar na sua decisão.",
      content: `
        <p>Escolher o financiamento imobiliário ideal pode fazer uma grande diferença no valor total pago pelo seu imóvel. Neste artigo, comparamos as principais opções disponíveis no mercado.</p>
        
        <h2>Taxas de juros atuais</h2>
        <p>As taxas de juros para financiamento imobiliário variam significativamente entre as instituições financeiras. Atualmente, as taxas médias estão entre 7% e 10% ao ano, mas é possível encontrar condições especiais dependendo do seu perfil como cliente.</p>
        
        <h2>Principais bancos e suas condições</h2>
        <p>Cada banco tem suas próprias políticas de financiamento. Alguns oferecem vantagens para quem já é correntista, outros têm programas especiais para determinadas categorias profissionais. É fundamental comparar não apenas as taxas, mas também o prazo, as exigências de entrada e as taxas administrativas.</p>
        
        <h2>Sistema de amortização</h2>
        <p>Existem diferentes sistemas de amortização: SAC, Price e SAM. Cada um tem suas vantagens e desvantagens, e a escolha deve ser feita de acordo com seu planejamento financeiro de longo prazo.</p>
      `,
      category: "Financiamento",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: "Pedro Costa",
      date: "2025-03-10",
      readTime: "6 min",
      featured: false,
      relatedContent: ["1", "4"]
    }
  ];
  
  const courses = [
    {
      id: "1",
      title: "Investimento em Imóveis para Iniciantes",
      description: "Aprenda os fundamentos do investimento imobiliário e comece sua jornada neste mercado.",
      content: `
        <p>Este curso foi desenvolvido especialmente para quem está dando os primeiros passos no mercado imobiliário. Ao longo de 12 lições, você aprenderá os conceitos fundamentais e estratégias práticas para iniciar seus investimentos com segurança.</p>
        
        <h2>O que você vai aprender</h2>
        <ul>
          <li>Fundamentos do mercado imobiliário</li>
          <li>Como avaliar imóveis e calcular rentabilidade</li>
          <li>Estratégias de investimento para diferentes perfis</li>
          <li>Aspectos jurídicos e tributários</li>
          <li>Como financiar suas aquisições</li>
          <li>Gestão de imóveis para aluguel</li>
        </ul>
        
        <h2>Conteúdo programático</h2>
        <ol>
          <li>Introdução ao mercado imobiliário</li>
          <li>Tipos de investimentos imobiliários</li>
          <li>Análise de localização</li>
          <li>Avaliação de imóveis</li>
          <li>Cálculo de rentabilidade</li>
          <li>Aspectos jurídicos na compra</li>
          <li>Financiamento imobiliário</li>
          <li>Impostos e encargos</li>
          <li>Gestão de imóveis para aluguel</li>
          <li>Reformas e valorização</li>
          <li>Estratégias de saída</li>
          <li>Montando sua carteira imobiliária</li>
        </ol>
      `,
      category: "Investimentos",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      duration: "4 semanas",
      lessons: 12,
      level: "Iniciante",
      featured: true,
      instructor: "Carlos Mendes",
      instructorBio: "Investidor imobiliário há 15 anos e consultor especializado em primeiros investimentos.",
      relatedContent: ["2", "3"]
    }
  ];
  
  const guides = [
    {
      id: "1",
      title: "Guia Completo da Documentação Imobiliária",
      description: "Manual detalhado sobre todos os documentos necessários na compra e venda de imóveis.",
      content: `
        <p>A documentação é um aspecto crítico em qualquer transação imobiliária. Este guia apresenta todos os documentos necessários e como verificá-los para garantir segurança jurídica na compra ou venda de um imóvel.</p>
        
        <h2>Documentos do Imóvel</h2>
        <ul>
          <li>Certidão de Matrícula atualizada</li>
          <li>IPTU</li>
          <li>Certidão Negativa de Débitos</li>
          <li>Declaração de Quitação de Taxas Condominiais</li>
          <li>Habite-se</li>
        </ul>
        
        <h2>Documentos do Vendedor (Pessoa Física)</h2>
        <ul>
          <li>RG e CPF</li>
          <li>Certidão de Nascimento/Casamento</li>
          <li>Certidão Negativa de Débitos Trabalhistas</li>
          <li>Certidão de Ações Cíveis</li>
        </ul>
        
        <h2>Documentos do Vendedor (Pessoa Jurídica)</h2>
        <ul>
          <li>Contrato Social</li>
          <li>CNPJ</li>
          <li>Certidão Negativa de Débitos Federais</li>
          <li>Certidão de Regularidade do FGTS</li>
        </ul>
      `,
      category: "Documentação",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      pages: 24,
      downloadable: true,
      featured: true,
      author: "Roberta Lima",
      relatedContent: ["2"]
    }
  ];

  if (type === "artigos") {
    return articles.find(article => article.id === id);
  } else if (type === "cursos") {
    return courses.find(course => course.id === id);
  } else if (type === "guias") {
    return guides.find(guide => guide.id === id);
  }
  
  return null;
};

export default function ConteudoDetalhe() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const content = getContentById(type || "", id || "");

  if (!content) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Conteúdo não encontrado</h1>
            <p className="mb-6">O conteúdo que você está procurando não está disponível.</p>
            <Button asChild>
              <Link to="/conteudos">Voltar para Centro de Conteúdos</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Render based on content type
  const renderContent = () => {
    switch (type) {
      case "artigos":
        return renderArticle(content);
      case "cursos":
        return renderCourse(content);
      case "guias":
        return renderGuide(content);
      default:
        return <div>Tipo de conteúdo não suportado</div>;
    }
  };

  const renderArticle = (article: any) => (
    <>
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">{article.category}</Badge>
          <div className="flex items-center text-lfcom-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(article.date).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center text-lfcom-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {article.readTime}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-lfcom-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="h-5 w-5" />
            </div>
            <span className="font-medium">{article.author}</span>
          </div>
          
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
        
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8" 
        />
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
      
      {article.relatedContent && article.relatedContent.length > 0 && (
        <div className="max-w-3xl mx-auto my-12">
          <h3 className="text-xl font-semibold mb-6">Artigos Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.relatedContent.map((relId: string) => {
              const relatedArticle = getContentById("artigos", relId);
              return relatedArticle ? (
                <Card 
                  key={relatedArticle.id}
                  className="flex overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link 
                    to={`/conteudos/artigos/${relatedArticle.id}`}
                    className="flex w-full"
                  >
                    <div className="w-1/3 overflow-hidden">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <CardContent className="w-2/3 p-4">
                      <h4 className="font-semibold mb-1">{relatedArticle.title}</h4>
                      <p className="text-sm text-lfcom-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ) : null;
            })}
          </div>
        </div>
      )}
    </>
  );

  const renderCourse = (course: any) => (
    <>
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">{course.category}</Badge>
          <Badge className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
            {course.level}
          </Badge>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{course.title}</h1>
        
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="h-10 w-10 bg-lfcom-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="font-medium">{course.instructor}</span>
              <p className="text-sm text-lfcom-gray-500">{course.instructorBio}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lfcom-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              {course.duration}
            </div>
            <div className="flex items-center text-lfcom-gray-600">
              <GraduationCap className="h-5 w-5 mr-2" />
              {course.lessons} lições
            </div>
          </div>
        </div>
        
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8" 
        />
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: course.content }}
        />

        <div className="mt-10 space-y-6">
          <h3 className="text-xl font-semibold">Inscreva-se neste curso</h3>
          <p className="text-lfcom-gray-600">
            Obtenha acesso a todas as aulas, materiais e certificado de conclusão.
          </p>
          <Button className="w-full md:w-auto bg-lfcom-black text-white hover:bg-lfcom-gray-800">
            Matricular-se Agora
          </Button>
        </div>
      </div>
      
      {course.relatedContent && course.relatedContent.length > 0 && (
        <div className="max-w-3xl mx-auto my-12">
          <h3 className="text-xl font-semibold mb-6">Cursos Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.relatedContent.map((relId: string) => {
              const relatedCourse = getContentById("cursos", relId);
              return relatedCourse ? (
                <Card 
                  key={relatedCourse.id}
                  className="overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link 
                    to={`/conteudos/cursos/${relatedCourse.id}`}
                    className="block"
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={relatedCourse.image} 
                        alt={relatedCourse.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">{relatedCourse.level}</Badge>
                      <h4 className="font-semibold mb-2">{relatedCourse.title}</h4>
                      <p className="text-sm text-lfcom-gray-600 line-clamp-2">
                        {relatedCourse.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ) : null;
            })}
          </div>
        </div>
      )}
    </>
  );

  const renderGuide = (guide: any) => (
    <>
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">{guide.category}</Badge>
          <div className="flex items-center text-lfcom-gray-500 text-sm">
            <FileText className="h-4 w-4 mr-1" />
            {guide.pages} páginas
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{guide.title}</h1>
        
        <div className="flex items-center justify-between mb-8">
          {guide.author && (
            <div className="flex items-center">
              <div className="h-10 w-10 bg-lfcom-gray-200 rounded-full flex items-center justify-center mr-2">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">{guide.author}</span>
            </div>
          )}
          
          {guide.downloadable && (
            <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
              Baixar PDF
            </Button>
          )}
        </div>
        
        <img 
          src={guide.image} 
          alt={guide.title} 
          className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8" 
        />
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      </div>
      
      {guide.relatedContent && guide.relatedContent.length > 0 && (
        <div className="max-w-3xl mx-auto my-12">
          <h3 className="text-xl font-semibold mb-6">Guias Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.relatedContent.map((relId: string) => {
              const relatedGuide = getContentById("guias", relId);
              return relatedGuide ? (
                <Card 
                  key={relatedGuide.id}
                  className="flex overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link 
                    to={`/conteudos/guias/${relatedGuide.id}`}
                    className="flex w-full"
                  >
                    <div className="w-1/3 overflow-hidden">
                      <img 
                        src={relatedGuide.image} 
                        alt={relatedGuide.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <CardContent className="w-2/3 p-4">
                      <h4 className="font-semibold mb-1">{relatedGuide.title}</h4>
                      <p className="text-sm text-lfcom-gray-600 line-clamp-2">
                        {relatedGuide.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ) : null;
            })}
          </div>
        </div>
      )}
    </>
  );

  // Icon mapping based on content type
  const getIcon = () => {
    switch(type) {
      case "artigos": return <BookOpen className="h-5 w-5 mr-2" />;
      case "cursos": return <GraduationCap className="h-5 w-5 mr-2" />;
      case "guias": return <BookText className="h-5 w-5 mr-2" />;
      default: return null;
    }
  };

  // Text mapping based on content type
  const getContentTypeText = () => {
    switch(type) {
      case "artigos": return "Artigos";
      case "cursos": return "Cursos";
      case "guias": return "Guias";
      default: return "Conteúdos";
    }
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-4 hover:bg-lfcom-gray-100">
            <Link to="/conteudos" className="flex items-center text-lfcom-gray-600">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <div className="flex items-center">
                {getIcon()} 
                <span>Voltar para {getContentTypeText()}</span>
              </div>
            </Link>
          </Button>

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}
