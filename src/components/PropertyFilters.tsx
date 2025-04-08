
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PropertyFiltersProps {
  filters: {
    city: string;
    state: string;
    propertyType: string;
    modality: string;
    priceMin: number;
    priceMax: number;
    bedrooms: number;
    parking: number;
    acceptsFinancing: boolean | null;
    acceptsFGTS: boolean | null;
    minDiscount: number;
    areaMin: number;
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    city: string;
    state: string;
    propertyType: string;
    modality: string;
    priceMin: number;
    priceMax: number;
    bedrooms: number;
    parking: number;
    acceptsFinancing: boolean | null;
    acceptsFGTS: boolean | null;
    minDiscount: number;
    areaMin: number;
    sortBy: string;
  }>>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
};

export default function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const propertyTypes = ["Apartamento", "Casa", "Terreno", "Comercial", "Rural", "Galpão"];
  const modalities = ["Leilão SFI", "Licitação Aberta", "Venda Online", "Venda Direta Online"];
  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const parkingOptions = [0, 1, 2, 3, 4];
  const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  
  // Em um cenário real, as cidades seriam carregadas dinamicamente com base no estado selecionado
  const cities = ["São Paulo", "Osasco", "Guarulhos", "Campinas", "Santo André", "Sorocaba"];

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceMin: value[0],
      priceMax: value[1] || 1000000,
    });
  };

  const handleAreaChange = (value: number[]) => {
    setFilters({
      ...filters,
      areaMin: value[0],
    });
  };

  const handleDiscountChange = (value: number[]) => {
    setFilters({
      ...filters,
      minDiscount: value[0],
    });
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      state: "",
      propertyType: "",
      modality: "",
      priceMin: 0,
      priceMax: 1000000,
      bedrooms: 0,
      parking: 0,
      acceptsFinancing: null,
      acceptsFGTS: null,
      minDiscount: 0,
      areaMin: 0,
      sortBy: ""
    });
  };

  return (
    <Card className="w-full border-muted shadow-sm">
      <CardContent className="p-6">
        <Accordion type="single" collapsible defaultValue="basic-filters" className="w-full">
          <AccordionItem value="basic-filters">
            <AccordionTrigger className="text-lg font-semibold">Filtros básicos</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    value={filters.state} 
                    onValueChange={(value) => setFilters({...filters, state: value, city: ""})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-states">Todos os estados</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Select 
                    value={filters.city} 
                    onValueChange={(value) => setFilters({...filters, city: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-cities">Todas as cidades</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Imóvel</Label>
                  <Select 
                    value={filters.propertyType} 
                    onValueChange={(value) => setFilters({...filters, propertyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">Todos os tipos</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <Select 
                    value={filters.modality} 
                    onValueChange={(value) => setFilters({...filters, modality: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as modalidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-modalities">Todas as modalidades</SelectItem>
                      {modalities.map((modality) => (
                        <SelectItem key={modality} value={modality}>{modality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced-filters">
            <AccordionTrigger className="text-lg font-semibold">Filtros avançados</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.priceMin, filters.priceMax]}
                      max={1000000}
                      step={10000}
                      onValueChange={handlePriceChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(filters.priceMin)}</span>
                      <span>{formatCurrency(filters.priceMax)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Área Total (m²)</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.areaMin]}
                      max={500}
                      step={10}
                      onValueChange={handleAreaChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>A partir de {filters.areaMin} m²</span>
                      <span>500+ m²</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Desconto Mínimo</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.minDiscount]}
                      max={50}
                      step={5}
                      onValueChange={handleDiscountChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>A partir de {filters.minDiscount}%</span>
                      <span>50%+</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Select 
                      value={filters.bedrooms.toString()} 
                      onValueChange={(value) => setFilters({...filters, bedrooms: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Qualquer</SelectItem>
                        {bedroomOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num === 0 ? "Studio" : num === 5 ? "5+" : num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parking">Vagas de Garagem</Label>
                    <Select 
                      value={filters.parking.toString()} 
                      onValueChange={(value) => setFilters({...filters, parking: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Qualquer</SelectItem>
                        {parkingOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num === 0 ? "Sem vaga" : num === 4 ? "4+" : num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aceita-financiamento" 
                      checked={filters.acceptsFinancing === true} 
                      onCheckedChange={(checked) => 
                        setFilters({...filters, acceptsFinancing: checked ? true : null})
                      }
                    />
                    <Label htmlFor="aceita-financiamento">Aceita Financiamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aceita-fgts" 
                      checked={filters.acceptsFGTS === true}
                      onCheckedChange={(checked) => 
                        setFilters({...filters, acceptsFGTS: checked ? true : null})
                      }
                    />
                    <Label htmlFor="aceita-fgts">Aceita FGTS</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortBy">Ordenar por</Label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => setFilters({...filters, sortBy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Menor Preço</SelectItem>
                      <SelectItem value="price-desc">Maior Preço</SelectItem>
                      <SelectItem value="discount-desc">Maior Desconto</SelectItem>
                      <SelectItem value="end-date-asc">Finaliza Primeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
          <Button>
            Aplicar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
