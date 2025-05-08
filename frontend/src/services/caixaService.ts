import { Property, PropertyFilters } from "@/types/property";

const API_URL = "https://scraphub.comercify.shop/api/items/2";
const API_KEY = import.meta.env.VITE_CAIXA_API_KEY;

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

export const caixaService = {
  async listarImoveis(filters: PropertyFilters, page: number): Promise<ApiResponse> {
    try {
      const url = new URL(API_URL);
      url.searchParams.set("page", page.toString());

      // Aplicar filtros
      if (filters.city && filters.city !== "all-cities") {
        url.searchParams.set("city", filters.city);
      }

      if (filters.state && filters.state !== "all-states") {
        url.searchParams.set("state", filters.state);
      }

      if (filters.propertyType && filters.propertyType !== "all-types") {
        url.searchParams.set("type", filters.propertyType);
      }

      if (filters.modality && filters.modality !== "all-modalities") {
        url.searchParams.set("modality", filters.modality);
      }

      if (filters.priceMin > 0 || filters.priceMax < 1000000) {
        url.searchParams.set("preco_avaliacao__lte", filters.priceMax.toString());
        url.searchParams.set("preco_avaliacao__gte", filters.priceMin.toString());
      }

      if (filters.bedrooms > 0) {
        url.searchParams.set("quartos", filters.bedrooms.toString());
      }

      if (filters.parking > 0) {
        url.searchParams.set("garagem", filters.parking.toString());
      }

      if (filters.acceptsFinancing !== null) {
        url.searchParams.set("aceita_financiamento__isnull", "false");
      }

      if (filters.acceptsFGTS !== null) {
        url.searchParams.set("aceita_FGTS__isnull", "false");
      }

      if (filters.minDiscount > 0) {
        url.searchParams.set("desconto__gte", filters.minDiscount.toString());
      }

      if (filters.areaMin > 0) {
        url.searchParams.set("private_area__gte", filters.areaMin.toString());
      }

      // Ordenação
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-asc":
            url.searchParams.set("ordering", "preco_avaliacao");
            break;
          case "price-desc":
            url.searchParams.set("ordering", "-preco_avaliacao");
            break;
          case "discount-desc":
            url.searchParams.set("ordering", "-desconto");
            break;
          case "end-date-asc":
            url.searchParams.set("ordering", "fim_venda_online");
            break;
        }
      }

      console.log('URL da requisição:', url.toString());
      console.log('Headers:', { "X-Api-Key": API_KEY });

      const response = await fetch(url.toString(), {
        headers: {
          "X-Api-Key": API_KEY,
        },
      });

      if (!response.ok) {
        console.error('Erro na resposta:', response.status, response.statusText);
        throw new Error(`Erro ao buscar imóveis: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resposta da API:', data);
      
      return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: data.results,
      };
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      throw error;
    }
  },

  async buscarImovelPorId(id: string): Promise<Property> {
    try {
      let page = 1;
      let found = false;
      let property: Property | null = null;
      
      console.log('Buscando imóvel com ID:', id);

      while (!found) {
        const url = new URL(API_URL);
        url.searchParams.set("page", page.toString());
        
        console.log('URL da requisição:', url.toString());
        console.log('Headers:', { "X-Api-Key": API_KEY });

        const response = await fetch(url.toString(), {
          headers: {
            "X-Api-Key": API_KEY,
          },
        });

        if (!response.ok) {
          console.error('Erro na resposta:', response.status, response.statusText);
          throw new Error(`Erro ao buscar imóvel: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta da API página', page, ':', data);
        
        // Procura o imóvel com o ID específico nos resultados
        property = data.results.find((p: Property) => p.id.toString() === id);
        
        if (property) {
          found = true;
          break;
        }

        // Se não há mais páginas, para a busca
        if (!data.next) {
          break;
        }

        page++;
      }
      
      if (!property) {
        console.error('Imóvel não encontrado. Verifique se o ID está correto:', id);
        throw new Error(`Imóvel com ID ${id} não encontrado. Verifique se o ID está correto.`);
      }

      return property;
    } catch (error) {
      console.error("Erro ao buscar imóvel:", error);
      throw error;
    }
  }
}; 