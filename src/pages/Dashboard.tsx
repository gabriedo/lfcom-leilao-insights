
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, Plus, FileText, Filter, Activity, Calendar, Clock, TrendingUp, AlertCircle, PieChart, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analyses");
  
  // Sample property analysis data
  const propertyAnalyses = [
    {
      id: "1",
      address: "Rua das Flores, 123 - Apto 304, Jardim América",
      city: "São Paulo/SP",
      type: "Apartamento",
      date: "10/04/2023",
      status: "complete",
      viability: "high",
      minimumBid: "R$ 245.000",
      marketValue: "R$ 410.000",
    },
    {
      id: "2",
      address: "Av. Atlântica, 2000 - Apto 1204, Copacabana",
      city: "Rio de Janeiro/RJ",
      type: "Apartamento",
      date: "22/03/2023",
      status: "complete",
      viability: "medium",
      minimumBid: "R$ 890.000",
      marketValue: "R$ 1.200.000",
    },
    {
      id: "3",
      address: "Rua Carlos Gomes, 50 - Casa, Alto da Boa Vista",
      city: "São Paulo/SP",
      type: "Casa",
      date: "01/04/2023",
      status: "processing",
      viability: "pending",
      minimumBid: "R$ 420.000",
      marketValue: "R$ 580.000",
    }
  ];

  // Sample recent activities data
  const recentActivities = [
    { id: "1", action: "Nova análise criada", property: "Rua das Flores, 123", time: "Hoje, 14:35" },
    { id: "2", action: "Relatório visualizado", property: "Av. Atlântica, 2000", time: "Hoje, 10:22" },
    { id: "3", action: "Imóvel favorito adicionado", property: "Rua Carlos Gomes, 50", time: "Ontem, 18:15" },
    { id: "4", action: "Análise atualizada", property: "Av. Paulista, 1000", time: "Ontem, 12:30" }
  ];

  // Sample upcoming auctions data
  const upcomingAuctions = [
    { id: "1", property: "Apartamento - São Paulo/SP", date: "15/04/2023", minimumBid: "R$ 320.000", viability: "high" },
    { id: "2", property: "Casa - Curitiba/PR", date: "18/04/2023", minimumBid: "R$ 480.000", viability: "medium" },
    { id: "3", property: "Terreno - Belo Horizonte/MG", date: "22/04/2023", minimumBid: "R$ 180.000", viability: "low" }
  ];

  // Filter properties based on search term
  const filteredProperties = propertyAnalyses.filter(property => 
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getViabilityBadge = (viability: string) => {
    switch (viability) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900">Média</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">Baixa</Badge>;
      default:
        return <Badge className="bg-lfcom-gray-100 text-lfcom-gray-800 hover:bg-lfcom-gray-200">Pendente</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Concluído</Badge>;
      case 'processing':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Em Processamento</Badge>;
      default:
        return <Badge className="bg-lfcom-gray-100 text-lfcom-gray-800 hover:bg-lfcom-gray-200">Pendente</Badge>;
    }
  };

  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-lfcom-gray-600 mt-2">
                Gerencie e acompanhe suas análises de imóveis em leilão.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
              <Button className="bg-lfcom-black hover:bg-lfcom-gray-800">
                <Link to="/nova-analise" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Nova Análise
                </Link>
              </Button>
            </div>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="lfcom-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Análises</CardTitle>
                <CardDescription>Todos os relatórios</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">3</p>
              </CardContent>
            </Card>

            <Card className="lfcom-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alta Viabilidade</CardTitle>
                <CardDescription>Oportunidades premium</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">1</p>
              </CardContent>
            </Card>

            <Card className="lfcom-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Em Processamento</CardTitle>
                <CardDescription>Análises em andamento</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">1</p>
              </CardContent>
            </Card>

            <Card className="lfcom-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Economia Potencial</CardTitle>
                <CardDescription>Desconto de mercado médio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">32%</p>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Content Tabs */}
          <Tabs defaultValue="analyses" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="analyses" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Minhas Análises
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Atividade Recente
              </TabsTrigger>
              <TabsTrigger value="auctions" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Próximos Leilões
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            {/* My Analyses Tab Content */}
            <TabsContent value="analyses">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lfcom-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Buscar por endereço..."
                    className="pl-10 w-full sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-lfcom-gray-500" />
                    <Select>
                      <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Tipo de Imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="commercial">Comercial</SelectItem>
                        <SelectItem value="land">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Property Analysis List */}
              <div className="space-y-4">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lfcom-gray-500">Nenhuma análise encontrada</p>
                  </div>
                ) : (
                  filteredProperties.map((property) => (
                    <Card key={property.id} className="lfcom-card hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-lfcom-gray-500 mt-1" />
                              <div>
                                <h3 className="font-medium">
                                  {property.address}
                                </h3>
                                <p className="text-sm text-lfcom-gray-500">{property.city} • {property.type}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 lg:w-auto">
                            <div className="space-y-1">
                              <p className="text-xs text-lfcom-gray-500">Lance Mínimo</p>
                              <p className="font-semibold">{property.minimumBid}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs text-lfcom-gray-500">Valor de Mercado</p>
                              <p className="font-semibold">{property.marketValue}</p>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(property.status)}
                              {property.status === 'complete' && getViabilityBadge(property.viability)}
                            </div>
                            
                            <div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-lfcom-black border-lfcom-black hover:bg-lfcom-gray-100"
                              >
                                <Link to={`/relatorio/${property.id}`}>Ver Relatório</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Recent Activity Tab Content */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>Histórico das suas últimas interações com a plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Activity className="h-5 w-5 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-lfcom-gray-500">{activity.property}</p>
                        </div>
                        <div className="flex items-center gap-1 text-lfcom-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Ver Histórico Completo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Upcoming Auctions Tab Content */}
            <TabsContent value="auctions">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Leilões</CardTitle>
                  <CardDescription>Leilões que ocorrerão nos próximos dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imóvel</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Lance Mínimo</TableHead>
                        <TableHead>Viabilidade</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAuctions.map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell>{auction.property}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-lfcom-gray-500" />
                              {auction.date}
                            </div>
                          </TableCell>
                          <TableCell>{auction.minimumBid}</TableCell>
                          <TableCell>{getViabilityBadge(auction.viability)}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              className="bg-lfcom-black hover:bg-lfcom-gray-800 text-white"
                            >
                              Analisar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Ver Todos os Leilões</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Insights Tab Content */}
            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Tipo de Imóvel</CardTitle>
                    <CardDescription>Viabilidade média por categoria</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <div className="text-center text-lfcom-gray-500">
                      <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Gráfico de Desempenho</p>
                      <p className="text-sm">Análises insuficientes para gerar visualização.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alertas e Notificações</CardTitle>
                    <CardDescription>Informações importantes sobre seus imóveis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Leilão próximo</p>
                          <p className="text-sm text-yellow-700">Imóvel em observação terá leilão em 3 dias.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Oportunidade detectada</p>
                          <p className="text-sm text-green-700">Novo imóvel com alta viabilidade encontrado.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Configurar Alertas</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
