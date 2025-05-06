import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analysisService } from "@/services/analysis";
import PropertyPreview from "./PropertyPreview";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/useDebounce";
import { validatePropertyUrl, getUrlErrorMessage } from "@/utils/validators";
import { ExtractedPropertyData, ExtractionResult, PropertyDataSchema } from "@/types/property";
import { cacheService } from "@/services/cache";
import { validateDocumentUrl } from "@/utils/urlValidator";

console.log("AnalysisForm.tsx iniciado");

// Função de retry com backoff exponencial
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fetchFn();
  } catch (err) {
    if (retries === 0) throw err;
    console.log(`Tentativa falhou. Tentando novamente em ${delay}ms...`);
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(fetchFn, retries - 1, delay * 2);
  }
}

export default function AnalysisForm() {
  const { toast } = useToast();
  const [propertyUrl, setPropertyUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [propertyData, setPropertyData] = useState<ExtractedPropertyData | null>(null);
  const [progress, setProgress] = useState(0);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingAttempt, setPollingAttempt] = useState(0);
  const [maxPollingAttempts] = useState(15); // 30 segundos total
  const [isDataReady, setIsDataReady] = useState(false);

  // Aplica debounce na URL para validação
  const debouncedUrl = useDebounce(propertyUrl, 500);

  // Valida a URL quando ela muda (com debounce)
  useEffect(() => {
    const errorMessage = getUrlErrorMessage(debouncedUrl);
    setUrlError(errorMessage);
  }, [debouncedUrl]);

  // Reset do estado quando a URL muda
  useEffect(() => {
    setPropertyData(null);
    setExtractionResult(null);
    setError(null);
    setIsDataReady(false);
  }, [propertyUrl]);

  const isUrlValid = !urlError && validatePropertyUrl(debouncedUrl);

  const handleExtractData = async () => {
    if (!isUrlValid) {
      toast({
        title: "URL inválida",
        description: "Por favor, informe uma URL válida para o imóvel.",
        variant: "destructive",
      });
      return;
    }

    setExtracting(true);
    setExtractionResult(null);
    setPropertyData(null);
    setProgress(0);
    setError(null);
    setPollingAttempt(0);
    setIsDataReady(false);
    
    try {
      console.log('Iniciando extração para:', propertyUrl);
      
      // Sempre força nova análise, ignorando cache local
      // (Opcional: pode-se limpar o cache local para evitar inconsistência)
      cacheService.remove(propertyUrl);

      // Atualizar o progresso a cada segundo
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 3.33, 90)); // 90% máximo durante o polling
      }, 1000);

      // Atualizar o contador de tentativas
      const pollingInterval = setInterval(() => {
        setPollingAttempt(prev => Math.min(prev + 1, maxPollingAttempts));
      }, 2000);

      // Chama o backend com force=true
      const result = await fetchWithRetry(() => 
        analysisService.extractDataFromUrl(propertyUrl, { force: true })
      );
      
      console.log('Resultado da extração:', result);
      
      clearInterval(progressInterval);
      clearInterval(pollingInterval);
      setProgress(100);
      
      if (result?.success && result?.data) {
        // Validar os dados com Zod
        const parsed = PropertyDataSchema.safeParse(result.data);
        if (!parsed.success) {
          console.error("Erro ao validar resposta da API:", parsed.error.format());
          throw new Error("Dados do imóvel inválidos ou incompletos");
        }

        // Validar URLs dos documentos
        if (parsed.data?.documents) {
          for (const doc of parsed.data.documents) {
            if (doc?.url) {
              const urlValidation = await validateDocumentUrl(doc.url);
              if (!urlValidation.isValid) {
                console.warn(`URL inválida para documento ${doc.name}: ${urlValidation.error}`);
              }
            }
          }
        }

        // Salvar no cache
        cacheService.set(propertyUrl, parsed.data);

        setPropertyData(parsed.data);
        setExtractionResult({
          success: true,
          message: "Dados extraídos com sucesso!",
          data: parsed.data
        });
        setIsDataReady(true);
        
        toast({
          title: "Extração concluída",
          description: "Os dados do imóvel foram extraídos com sucesso.",
        });
      } else {
        throw new Error(result?.message || 'Dados da consulta não disponíveis');
      }
    } catch (error) {
      console.error("Erro na extração:", error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível extrair os dados do imóvel.";
      setError(errorMessage);
      setExtractionResult({
        success: false,
        message: errorMessage,
      });
      setIsDataReady(false);
      
      toast({
        title: "Erro na extração",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirm = () => {
    // TODO: Implementar redirecionamento para página de pagamento
    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para a página de pagamento.",
    });
  };

  if (propertyData) {
    console.log("propertyData em AnalysisForm:", propertyData);
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Input 
            type="url" 
            placeholder="Cole a URL do imóvel aqui"
            value={propertyUrl}
            onChange={(e) => setPropertyUrl(e.target.value)}
            disabled={extracting}
            className={`flex-1 ${urlError ? 'border-red-500' : ''}`}
            aria-label="URL do imóvel"
          />
          <Button 
            type="button" 
            onClick={handleExtractData} 
            disabled={extracting || !isUrlValid} 
            className="whitespace-nowrap"
            aria-busy={extracting}
          >
            {extracting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4 mr-2" />
                Analisar
              </>
            )}
          </Button>
        </div>
        {urlError && (
          <Alert variant="destructive">
            <AlertDescription>{urlError}</AlertDescription>
          </Alert>
        )}
      </div>

      {extracting && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-500 text-center">
            {progress < 100 ? "Extraindo dados do imóvel..." : "Finalizando..."}
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isDataReady && propertyData && (
        <PropertyPreview
          id={propertyData.id || "temp-id"}
          title={propertyData.title || "Título não disponível"}
          address={propertyData.address || ""}
          city={propertyData.city || ""}
          state={propertyData.state || ""}
          minBid={propertyData.minBid || ""}
          evaluatedValue={propertyData.evaluatedValue || ""}
          propertyType={propertyData.propertyType || ""}
          auctionType={propertyData.auctionType || ""}
          auctionDate={propertyData.auctionDate || ""}
          description={propertyData.description || ""}
          images={Array.isArray(propertyData.images) ? propertyData.images : []}
          documents={Array.isArray(propertyData.documents) ? propertyData.documents : []}
          auctions={Array.isArray(propertyData.auctions) ? propertyData.auctions : []}
          extractionStatus={propertyData.extractionStatus || "success"}
          onRefresh={handleExtractData}
        />
      )}
    </div>
  );
}
