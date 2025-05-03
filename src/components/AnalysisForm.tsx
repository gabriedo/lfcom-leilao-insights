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

  // Aplica debounce na URL para validação
  const debouncedUrl = useDebounce(propertyUrl, 500);

  // Valida a URL quando ela muda (com debounce)
  useEffect(() => {
    const errorMessage = getUrlErrorMessage(debouncedUrl);
    setUrlError(errorMessage);
  }, [debouncedUrl]);

  const isUrlValid = !urlError && validatePropertyUrl(propertyUrl);

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
    
    try {
      console.log('Iniciando extração para:', propertyUrl);
      
      // Verificar cache
      const cachedData = cacheService.get(propertyUrl);
      if (cachedData) {
        console.log('Dados encontrados no cache');
        setPropertyData(cachedData);
        setExtractionResult({
          success: true,
          message: "Dados recuperados do cache",
          data: cachedData
        });
        setProgress(100);
        return;
      }

      // Atualizar o progresso a cada segundo
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 3.33, 90)); // 90% máximo durante o polling
      }, 1000);

      const result = await fetchWithRetry(() => 
        analysisService.extractDataFromUrl(propertyUrl)
      );
      
      console.log('Resultado da extração:', result);
      
      clearInterval(progressInterval);
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
        
        toast({
          title: "Extração concluída",
          description: "Os dados do imóvel foram extraídos com sucesso.",
        });
      } else {
        throw new Error(result?.error || 'Dados da consulta não disponíveis');
      }
    } catch (error) {
      console.error("Erro na extração:", error);
      setExtractionResult({
        success: false,
        message: error instanceof Error ? error.message : "Não foi possível extrair os dados do imóvel.",
      });
      
      toast({
        title: "Erro na extração",
        description: error instanceof Error ? error.message : "Não foi possível extrair os dados do imóvel.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Input 
            type="url" 
            placeholder="https://www.sitedeleilao.com.br/imovel/123"
            value={propertyUrl}
            onChange={(e) => setPropertyUrl(e.target.value)}
            disabled={extracting}
            className={`flex-1 ${urlError ? 'border-red-500' : ''}`}
          />
          <Button 
            type="button" 
            onClick={handleExtractData} 
            disabled={extracting || !isUrlValid} 
            className="whitespace-nowrap"
          >
            {extracting ? 
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </> : 
              <>
                <LinkIcon className="h-4 w-4 mr-2" />
                Analisar Imóvel
              </>
            }
          </Button>
        </div>
        {urlError && (
          <p className="text-sm text-red-500 mt-1">
            {urlError}
          </p>
        )}
      </div>
      
      {extracting && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Extraindo dados do imóvel... {progress}%
          </p>
        </div>
      )}
      
      {extractionResult && (
        <Alert variant={extractionResult.success ? "default" : "destructive"}>
          <AlertDescription>
            {extractionResult.message}
          </AlertDescription>
        </Alert>
      )}
      
      {propertyData && <PropertyPreview data={propertyData} />}
    </div>
  );
}
