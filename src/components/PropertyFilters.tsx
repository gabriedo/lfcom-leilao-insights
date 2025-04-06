
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyFiltersProps {
  filters: {
    city: string;
    propertyType: string;
    priceMin: number;
    priceMax: number;
    bedrooms: number;
    status: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    city: string;
    propertyType: string;
    priceMin: number;
    priceMax: number;
    bedrooms: number;
    status: string;
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
  const propertyTypes = ["Apartamento", "Casa", "Terreno", "Comercial", "Rural"];
  const statusOptions = ["Todos", "Ocupado", "Desocupado"];
  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const cities = ["Todas", "São Paulo", "Osasco", "Guarulhos", "Campinas", "Santo André", "Sorocaba"];

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceMin: value[0],
      priceMax: value[1] || 1000000,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      priceMin: 0,
      priceMax: 1000000,
      bedrooms: 0,
      status: ""
    });
  };

  return (
    <Card className="w-full border-muted shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Select 
              value={filters.city} 
              onValueChange={(value) => setFilters({...filters, city: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city === "Todas" ? "" : city}>
                    {city}
                  </SelectItem>
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
                <SelectItem value="">Todos os tipos</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="status">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status === "Todos" ? "" : status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
