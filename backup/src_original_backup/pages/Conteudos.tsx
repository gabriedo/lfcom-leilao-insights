
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  BookText, 
  GraduationCap, 
  FileText, 
  ArrowRight,
  Calendar,
  Clock,
  User
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for different content types
const articles = [
  {
    id: "1",
    title: "Como avaliar o potencial de valorização de um imóvel",
    excerpt: "Guia completo para entender os fatores que influenciam no valor futuro de uma propriedade.",
    category: "Análise de Mercado",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Ana Silva",
    date: "2025-03-15",
    readTime: "8 min",
    featured: true
  },
  {
    id: "2",
    title: "Financiamento imobiliário: conheça as melhores taxas",
    excerpt: "Comparamos as taxas de juros e condições dos principais bancos para ajudar na sua decisão.",
    category: "Financiamento",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Pedro Costa",
    date: "2025-03-10",
    readTime: "6 min",
    featured: false
  },
  {
    id: "3",
    title: "5 dicas para negociar o preço de imóveis em leilão",
    excerpt: "Estratégias comprovadas para conseguir os melhores preços em leilões imobiliários.",
    category: "Leilões",
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Marcos Oliveira",
    date: "2025-03-05",
    readTime: "5 min",
    featured: false
  },
  {
    id: "4",
    title: "Reforma ou compra? O que é mais vantajoso",
    excerpt: "Análise detalhada para ajudar você a decidir entre reformar um imóvel antigo ou comprar um novo.",
    category: "Investimento",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Juliana Mendes",
    date: "2025-02-28",
    readTime: "10 min",
    featured: true
  },
  {
    id: "5",
    title: "Análise do mercado imobiliário em 2025",
    excerpt: "Tendências, previsões e oportunidades no setor imobiliário para o ano corrente.",
    category: "Análise de Mercado",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Carlos Santos",
    date: "2025-02-20",
    readTime: "7 min",
    featured: false
  },
  {
    id: "6",
    title: "Como avaliar a documentação de um imóvel",
    excerpt: "Guia prático para verificar se a documentação de um imóvel está em ordem antes da compra.",
    category: "Documentação",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Roberta Lima",
    date: "2025-02-15",
    readTime: "9 min",
    featured: false
  }
];

const courses = [
  {
    id: "1",
    title: "Investimento em Imóveis para Iniciantes",
    description: "Aprenda os fundamentos do investimento imobiliário e comece sua jornada neste mercado.",
    category: "Investimentos",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "4 semanas",
    lessons: 12,
    level: "Iniciante",
    featured: true
  },
  {
    id: "2",
    title: "Análise Avançada de Rentabilidade Imobiliária",
    description: "Técnicas avançadas para calcular o retorno sobre investimento em diferentes tipos de imóveis.",
    category: "Análise Financeira",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "6 semanas",
    lessons: 18,
    level: "Avançado",
    featured: true
  },
  {
    id: "3",
    title: "Como Avaliar Imóveis em Leilão",
    description: "Metodologia completa para identificar boas oportunidades em leilões imobiliários.",
    category: "Leilões",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "3 semanas",
    lessons: 9,
    level: "Intermediário",
    featured: false
  },
  {
    id: "4",
    title: "Financiamento Imobiliário: Estratégias e Armadilhas",
    description: "Tudo o que você precisa saber para escolher e negociar o melhor financiamento para seu imóvel.",
    category: "Financiamento",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "4 semanas",
    lessons: 10,
    level: "Intermediário",
    featured: false
  }
];

const guides = [
  {
    id: "1",
    title: "Guia Completo da Documentação Imobiliária",
    description: "Manual detalhado sobre todos os documentos necessários na compra e venda de imóveis.",
    category: "Documentação",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pages: 24,
    downloadable: true,
    featured: true
  },
  {
    id: "2",
    title: "Manual de Inspeção de Imóveis",
    description: "Como identificar problemas estruturais e avaliar a qualidade de um imóvel antes da compra.",
    category: "Inspeção",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pages: 18,
    downloadable: true,
    featured: false
  },
  {
    id: "3",
    title: "Estratégias de Negociação em Leilões",
    description: "Técnicas e táticas para conseguir os melhores preços em leilões imobiliários.",
    category: "Leilões",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pages: 12,
    downloadable: true,
    featured: false
  },
  {
    id: "4",
    title: "Localização e Valorização: Guia de Análise",
    description: "Como avaliar o potencial de valorização de um imóvel com base em sua localização.",
    category: "Análise de Mercado",
    image: "https://images.unsplash.com/photo-1535850836387-0f9dfce30846?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pages: 16,
    downloadable: true,
    featured: true
  }
];

export default function Conteudos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the active tab from URL or default to "artigos"
  const activeTab = searchParams.get("tab") || "artigos";
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };
  
  // Handle content click to navigate to detail page
  const handleContentClick = (type: string, id: string) => {
    navigate(`/conteudos/${type}/${id}`);
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white to-lfcom-gray-100">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-lfcom-black">
                Centro de Conhecimento Imobiliário
              </h1>
              <p className="text-lg text-lfcom-gray-600 mb-8">
                Artigos, guias, cursos e recursos para você fazer os melhores investimentos imobiliários.
              </p>
              
              <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar artigos, guias e cursos..."
                    className="pl-10 pr-4 py-3 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2 h-12">Buscar</Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Tabs Navigation */}
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="border-b border-lfcom-gray-200 mb-8">
              <TabsList className="bg-transparent w-full justify-start space-x-8 h-auto p-0">
                <TabsTrigger 
                  value="artigos" 
                  className="text-lfcom-gray-600 data-[state=active]:text-lfcom-black data-[state=active]:border-b-2 data-[state=active]:border-lfcom-black rounded-none px-0 py-4 data-[state=active]:shadow-none bg-transparent"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Artigos
                </TabsTrigger>
                <TabsTrigger 
                  value="cursos" 
                  className="text-lfcom-gray-600 data-[state=active]:text-lfcom-black data-[state=active]:border-b-2 data-[state=active]:border-lfcom-black rounded-none px-0 py-4 data-[state=active]:shadow-none bg-transparent"
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Cursos
                </TabsTrigger>
                <TabsTrigger 
                  value="guias" 
                  className="text-lfcom-gray-600 data-[state=active]:text-lfcom-black data-[state=active]:border-b-2 data-[state=active]:border-lfcom-black rounded-none px-0 py-4 data-[state=active]:shadow-none bg-transparent"
                >
                  <BookText className="h-5 w-5 mr-2" />
                  Guias e Manuais
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Featured Content Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-lfcom-black">Conteúdos em Destaque</h2>
              
              {/* Articles Tab Content */}
              <TabsContent value="artigos" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles
                    .filter(article => article.featured)
                    .map(article => (
                      <Card 
                        key={article.id} 
                        className="overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('artigos', article.id)}
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <CardDescription>{article.excerpt}</CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 text-xs text-lfcom-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 mt-10">
                  <h3 className="text-xl font-semibold mb-4">Artigos Recentes</h3>
                  {articles
                    .filter(article => !article.featured)
                    .map(article => (
                      <Card 
                        key={article.id} 
                        className="flex flex-col md:flex-row overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('artigos', article.id)}
                      >
                        <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-lfcom-gray-500">
                              {new Date(article.date).toLocaleDateString('pt-BR')} • {article.readTime}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
                          <p className="text-lfcom-gray-600 mb-2">{article.excerpt}</p>
                          <p className="text-sm text-lfcom-gray-500">Por {article.author}</p>
                        </div>
                      </Card>
                    ))}

                  {/* Pagination */}
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TabsContent>

              {/* Courses Tab Content */}
              <TabsContent value="cursos" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses
                    .filter(course => course.featured)
                    .map(course => (
                      <Card 
                        key={course.id} 
                        className="flex flex-col overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('cursos', course.id)}
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {course.category}
                            </Badge>
                            <Badge className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                              {course.level}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lfcom-gray-600 mb-4">{course.description}</p>
                          <div className="flex items-center justify-between text-sm text-lfcom-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </div>
                            <div>
                              {course.lessons} lições
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                            Ver Detalhes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  <h3 className="text-xl font-semibold mb-4 col-span-full">Outros Cursos</h3>
                  {courses
                    .filter(course => !course.featured)
                    .map(course => (
                      <Card 
                        key={course.id} 
                        className="overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('cursos', course.id)}
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {course.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <CardDescription className="text-sm line-clamp-2">
                            {course.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between text-xs text-lfcom-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration}
                          </div>
                          <Badge>{course.level}</Badge>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              {/* Guides Tab Content */}
              <TabsContent value="guias" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {guides
                    .filter(guide => guide.featured)
                    .map(guide => (
                      <Card 
                        key={guide.id} 
                        className="flex overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('guias', guide.id)}
                      >
                        <div className="w-1/3 overflow-hidden">
                          <img 
                            src={guide.image} 
                            alt={guide.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {guide.category}
                            </Badge>
                          </div>
                          <h4 className="text-lg font-semibold mb-2">{guide.title}</h4>
                          <p className="text-lfcom-gray-600 mb-4 text-sm">{guide.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-lfcom-gray-500">{guide.pages} páginas</span>
                            <Button size="sm" className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                              {guide.downloadable ? "Baixar PDF" : "Ver Guia"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                  <h3 className="text-xl font-semibold mb-4 col-span-full">Biblioteca de Guias</h3>
                  {guides
                    .filter(guide => !guide.featured)
                    .map(guide => (
                      <Card 
                        key={guide.id} 
                        className="overflow-hidden border-lfcom-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContentClick('guias', guide.id)}
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={guide.image} 
                            alt={guide.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {guide.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">{guide.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <CardDescription className="text-sm line-clamp-2">
                            {guide.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <span className="text-xs text-lfcom-gray-500">{guide.pages} páginas</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            {guide.downloadable ? "Baixar" : "Ler"}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Newsletter Section */}
        <div className="bg-lfcom-gray-100 py-12 mt-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-lfcom-black">Receba conteúdo exclusivo por email</h2>
              <p className="text-lfcom-gray-600 mb-6">
                Assine nossa newsletter e receba semanalmente as melhores dicas, análises de mercado e oportunidades.
              </p>
              <form className="flex w-full max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Seu endereço de email"
                  className="h-12"
                  required
                />
                <Button type="submit" className="ml-2 h-12 bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
