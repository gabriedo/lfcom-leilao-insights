
import React, { useState } from 'react';
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Sample data for leiloeiros
const leiloeirosMockData = [
  {
    id: 1,
    juntaComercial: "JUCESP",
    estado: "São Paulo",
    site: "https://www.leiloeiro1.com.br",
    nome: "João Silva",
    matricula: "12345",
    telefone: "(11) 98765-4321",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    email: "joao@leiloeiro.com.br",
    ativo: true,
  },
  {
    id: 2,
    juntaComercial: "JUCERJ",
    estado: "Rio de Janeiro",
    site: "https://www.leiloeiro2.com.br",
    nome: "Maria Oliveira",
    matricula: "54321",
    telefone: "(21) 98765-4321",
    endereco: "Av. Atlântica, 500",
    cidade: "Rio de Janeiro",
    email: "maria@leiloeiro.com.br",
    ativo: true,
  },
  {
    id: 3,
    juntaComercial: "JUCEMG",
    estado: "Minas Gerais",
    site: "https://www.leiloeiro3.com.br",
    nome: "Pedro Santos",
    matricula: "98765",
    telefone: "(31) 98765-4321",
    endereco: "Av. Afonso Pena, 2000",
    cidade: "Belo Horizonte",
    email: "pedro@leiloeiro.com.br",
    ativo: false,
  },
  {
    id: 4,
    juntaComercial: "JUCERS",
    estado: "Rio Grande do Sul",
    site: "https://www.leiloeiro4.com.br",
    nome: "Ana Costa",
    matricula: "45678",
    telefone: "(51) 98765-4321",
    endereco: "Av. Ipiranga, 1500",
    cidade: "Porto Alegre",
    email: "ana@leiloeiro.com.br",
    ativo: true,
  },
  {
    id: 5,
    juntaComercial: "JUCEPR",
    estado: "Paraná",
    site: "https://www.leiloeiro5.com.br",
    nome: "Carlos Ferreira",
    matricula: "87654",
    telefone: "(41) 98765-4321",
    endereco: "Rua XV de Novembro, 700",
    cidade: "Curitiba",
    email: "carlos@leiloeiro.com.br",
    ativo: true,
  },
];

const LeiloeirosPagina = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(leiloeirosMockData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = leiloeirosMockData.filter(item => 
      item.nome.toLowerCase().includes(value) || 
      item.estado.toLowerCase().includes(value) ||
      item.cidade.toLowerCase().includes(value) ||
      item.juntaComercial.toLowerCase().includes(value)
    );
    
    setFilteredData(filtered);
  };

  return (
    <Layout className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Leiloeiros Oficiais</h1>
        <p className="text-lfcom-gray-600 max-w-3xl mx-auto text-center mb-10">
          Consulte a lista de leiloeiros oficiais credenciados em todo o Brasil. Utilize o campo de busca para encontrar 
          leiloeiros por nome, estado ou cidade.
        </p>
        
        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lfcom-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Buscar por nome, estado ou cidade..."
            className="pl-10 py-6"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Leiloeiros Table */}
        <div className="bg-white rounded-lg shadow-sm border border-lfcom-gray-200 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista de leiloeiros oficiais credenciados</TableCaption>
              <TableHeader className="bg-lfcom-gray-100">
                <TableRow>
                  <TableHead className="font-semibold">JUNTA COMERCIAL</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">SITE</TableHead>
                  <TableHead className="font-semibold">NOME</TableHead>
                  <TableHead className="font-semibold">MATRÍCULA</TableHead>
                  <TableHead className="font-semibold">TELEFONE</TableHead>
                  <TableHead className="font-semibold">ENDEREÇO</TableHead>
                  <TableHead className="font-semibold">CIDADE</TableHead>
                  <TableHead className="font-semibold">EMAIL</TableHead>
                  <TableHead className="font-semibold">ATIVO?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((leiloeiro) => (
                  <TableRow key={leiloeiro.id}>
                    <TableCell>{leiloeiro.juntaComercial}</TableCell>
                    <TableCell>{leiloeiro.estado}</TableCell>
                    <TableCell>
                      <a 
                        href={leiloeiro.site} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Site
                      </a>
                    </TableCell>
                    <TableCell>{leiloeiro.nome}</TableCell>
                    <TableCell>{leiloeiro.matricula}</TableCell>
                    <TableCell>{leiloeiro.telefone}</TableCell>
                    <TableCell>{leiloeiro.endereco}</TableCell>
                    <TableCell>{leiloeiro.cidade}</TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${leiloeiro.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {leiloeiro.email}
                      </a>
                    </TableCell>
                    <TableCell className={leiloeiro.ativo ? "text-green-600" : "text-red-600"}>
                      {leiloeiro.ativo ? "Sim" : "Não"}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      Nenhum leiloeiro encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4">Precisa de ajuda com leilões?</h2>
          <p className="text-lfcom-gray-600 mb-6">
            Nossos especialistas podem ajudar você a entender como funcionam os leilões 
            e como se preparar para participar com segurança.
          </p>
          <Button className="bg-lfcom-black hover:bg-lfcom-gray-800">
            Fale com um especialista
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default LeiloeirosPagina;
