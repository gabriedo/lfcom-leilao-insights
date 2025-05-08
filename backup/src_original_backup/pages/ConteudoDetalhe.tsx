
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Book, Calendar, PlayCircle, Download, Share2, Bookmark, User, BarChart } from "lucide-react";

// Define proper types for different content types
type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  relatedContent: string[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  duration: string;
  lessons: number;
  level: string;
  featured: boolean;
  instructor: string;
  instructorBio: string;
  relatedContent: string[];
};

type Guide = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  steps: number;
  author: string;
  date: string;
  featured: boolean;
  downloadable: boolean;
  relatedContent: string[];
};

type ContentItem = Article | Course | Guide;

// Function to determine the type of content
const getContentType = (item: ContentItem): "article" | "course" | "guide" => {
  if ('readTime' in item) {
    return "article";
  } else if ('lessons' in item) {
    return "course";
  } else {
    return "guide";
  }
};

// Type guards
const isArticle = (item: ContentItem): item is Article => {
  return 'readTime' in item;
};

const isCourse = (item: ContentItem): item is Course => {
  return 'lessons' in item;
};

const isGuide = (item: ContentItem): item is Guide => {
  return 'steps' in item;
};

export default function ConteudoDetalhe() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    // This would normally be an API call
    // Simulating content fetching based on type and ID
    const fetchContent = () => {
      // Sample articles
      const articles: Article[] = [
        {
          id: "1",
          title: "Como funciona um leilão de imóveis",
          excerpt: "Guia completo sobre o funcionamento dos leilões de imóveis no Brasil",
          content: `
            <p>Os leilões de imóveis são uma excelente oportunidade para adquirir propriedades por valores abaixo do mercado. Este artigo explora todo o processo de participação em leilões imobiliários.</p>
            <h2>O que são leilões de imóveis?</h2>
            <p>Leilões de imóveis são eventos onde propriedades são vendidas ao maior lance oferecido, geralmente por valores abaixo do preço de mercado. Esses imóveis podem ser originados de dívidas bancárias, execuções fiscais ou falências.</p>
            <h2>Tipos de leilões</h2>
            <p>Existem dois tipos principais de leilões:</p>
            <ul>
              <li><strong>Leilão extrajudicial:</strong> Realizado por instituições financeiras para recuperar créditos de financiamentos imobiliários inadimplentes.</li>
              <li><strong>Leilão judicial:</strong> Determinado pela justiça para quitar dívidas do proprietário original.</li>
            </ul>
            <h2>Como participar de um leilão</h2>
            <p>Para participar de um leilão de imóveis, você precisa:</p>
            <ol>
              <li>Cadastrar-se na plataforma do leiloeiro</li>
              <li>Analisar o edital do leilão com atenção</li>
              <li>Verificar a documentação do imóvel</li>
              <li>Visitar o imóvel, se possível</li>
              <li>Preparar-se financeiramente</li>
              <li>Dar lances dentro do seu orçamento</li>
            </ol>
            <h2>Riscos e cuidados</h2>
            <p>Embora os leilões ofereçam boas oportunidades, existem riscos que devem ser considerados:</p>
            <ul>
              <li>Imóveis ocupados</li>
              <li>Dívidas pendentes (IPTU, condomínio)</li>
              <li>Problemas documentais</li>
              <li>Estado de conservação desconhecido</li>
            </ul>
            <h2>Conclusão</h2>
            <p>Participar de leilões de imóveis pode ser uma excelente estratégia de investimento, mas requer conhecimento, preparação e cautela. Utilize ferramentas de análise como o LFCOM para maximizar suas chances de sucesso.</p>
          `,
          category: "Leilões",
          image: "/placeholder.svg",
          author: "Maria Silva",
          date: "12 de Março de 2023",
          readTime: "8 min",
          featured: true,
          relatedContent: ["2", "5"]
        },
        {
          id: "2",
          title: "Os 5 erros mais comuns em leilões de imóveis",
          excerpt: "Saiba quais são os erros mais comuns e como evitá-los",
          content: "Conteúdo detalhado sobre erros em leilões...",
          category: "Leilões",
          image: "/placeholder.svg",
          author: "João Santos",
          date: "5 de Abril de 2023",
          readTime: "6 min",
          featured: false,
          relatedContent: ["1", "3"]
        }
      ];

      // Sample courses
      const courses: Course[] = [
        {
          id: "3",
          title: "Curso completo sobre leilões imobiliários",
          description: "Aprenda tudo sobre leilões de imóveis do básico ao avançado",
          content: "Conteúdo detalhado do curso sobre leilões...",
          category: "Cursos",
          image: "/placeholder.svg",
          duration: "8 horas",
          lessons: 12,
          level: "Intermediário",
          featured: true,
          instructor: "Dr. Carlos Mendes",
          instructorBio: "Especialista em direito imobiliário com 15 anos de experiência",
          relatedContent: ["1", "4"]
        },
        {
          id: "4",
          title: "Como avaliar imóveis para investimento",
          description: "Técnicas profissionais para avaliação de imóveis",
          content: "Conteúdo detalhado sobre avaliação de imóveis...",
          category: "Cursos",
          image: "/placeholder.svg",
          duration: "6 horas",
          lessons: 10,
          level: "Avançado",
          featured: false,
          instructor: "Ana Vieira",
          instructorBio: "Corretora de imóveis especializada em investimentos",
          relatedContent: ["3", "5"]
        }
      ];

      // Sample guides
      const guides: Guide[] = [
        {
          id: "5",
          title: "Guia passo a passo para leilões da Caixa",
          description: "Como participar e vencer em leilões da Caixa Econômica Federal",
          content: "Conteúdo detalhado do guia sobre leilões da Caixa...",
          category: "Guias",
          image: "/placeholder.svg",
          steps: 8,
          author: "Roberto Alves",
          date: "20 de Março de 2023",
          featured: true,
          downloadable: true,
          relatedContent: ["1", "3"]
        },
        {
          id: "6",
          title: "Checklist para inspeção de imóveis",
          description: "O que verificar antes de comprar um imóvel em leilão",
          content: "Conteúdo detalhado do checklist de inspeção...",
          category: "Guias",
          image: "/placeholder.svg",
          steps: 12,
          author: "Paulo Martins",
          date: "8 de Abril de 2023",
          featured: false,
          downloadable: true,
          relatedContent: ["2", "5"]
        }
      ];

      let allContent: ContentItem[] = [...articles, ...courses, ...guides];
      
      // Find the requested content
      const foundContent = allContent.find(item => item.id === id);
      
      if (foundContent) {
        setContent(foundContent);
        
        // Find related content
        if (foundContent.relatedContent && foundContent.relatedContent.length > 0) {
          const related = allContent.filter(item => foundContent.relatedContent.includes(item.id));
          setRelatedItems(related);
        }
      }
    };

    fetchContent();
  }, [id, type]);

  if (!content) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <p>Carregando conteúdo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const contentType = getContentType(content);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/conteudos" className="text-lfcom-gray-600 hover:text-lfcom-black flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Conteúdos</span>
          </Link>
        </div>

        {/* Content Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{content.category}</Badge>
            {contentType === "course" && isCourse(content) && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {content.level}
              </Badge>
            )}
            {contentType === "guide" && isGuide(content) && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {content.steps} Passos
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>
          
          <div className="text-lfcom-gray-600 flex flex-wrap gap-4 items-center">
            {isArticle(content) && (
              <>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{content.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{content.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{content.readTime} de leitura</span>
                </div>
              </>
            )}
            
            {isCourse(content) && (
              <>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Instrutor: {content.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Duração: {content.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  <span>{content.lessons} Aulas</span>
                </div>
              </>
            )}
            
            {isGuide(content) && (
              <>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{content.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{content.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{content.steps} Passos</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content */}
          <div className="lg:w-2/3">
            <Card className="mb-8">
              <CardContent className="p-6">
                {contentType === "article" && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
                
                {contentType === "course" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Sobre este curso</h2>
                      <p>{isCourse(content) && content.description}</p>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Conteúdo do curso</h2>
                      <Tabs defaultValue="overview">
                        <TabsList>
                          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                          <TabsTrigger value="curriculum">Currículo</TabsTrigger>
                          <TabsTrigger value="instructor">Instrutor</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
                        </TabsContent>
                        <TabsContent value="curriculum" className="mt-4">
                          {isCourse(content) && (
                            <div className="space-y-3">
                              {[...Array(content.lessons)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-lfcom-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                      {i + 1}
                                    </div>
                                    <span>Lição {i + 1}: Título da lição</span>
                                  </div>
                                  <PlayCircle className="h-5 w-5 text-lfcom-gray-500" />
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="instructor" className="mt-4">
                          {isCourse(content) && (
                            <div>
                              <h3 className="text-lg font-medium mb-2">{content.instructor}</h3>
                              <p>{content.instructorBio}</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}
                
                {contentType === "guide" && (
                  <div>
                    <div className="mb-6">
                      <p className="mb-4">{isGuide(content) && content.description}</p>
                    </div>
                    
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
                    
                    {isGuide(content) && content.downloadable && (
                      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2">Quer baixar este guia?</h3>
                        <p className="text-blue-700 mb-4">Tenha acesso a este guia em PDF para consultar offline quando precisar.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Guia em PDF
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button variant="outline" className="flex gap-2">
                <Bookmark className="h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" className="flex gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Call to Action */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Pronto para começar?</h3>
                <p className="mb-4 text-lfcom-gray-600">Aproveite nossos recursos para encontrar as melhores oportunidades em leilões de imóveis.</p>
                <Button className="w-full bg-lfcom-black">
                  <Link to="/nova-analise">Iniciar Nova Análise</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Related Content */}
            {relatedItems.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Conteúdos relacionados</h3>
                  <div className="space-y-5">
                    {relatedItems.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <Link 
                            to={`/conteudos/${getContentType(item)}/${item.id}`} 
                            className="font-medium hover:text-blue-700"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-lfcom-gray-500 mt-1">
                            {isArticle(item) ? item.excerpt : 
                             isCourse(item) ? item.description :
                             isGuide(item) ? item.description : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
