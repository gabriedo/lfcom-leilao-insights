import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analysisService } from "@/services/analysis";
import PropertyPreview from "./PropertyPreview";
import { Progress } from "@/components/ui/progress";

export default function AnalysisForm() {
  const { toast } = useToast();
  const [propertyUrl, setPropertyUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleExtractData = async () => {
    if (!propertyUrl || !propertyUrl.trim()) {
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
      
      // Atualizar o progresso a cada segundo
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 3.33, 90)); // 90% máximo durante o polling
      }, 1000);

      const result = await analysisService.extractDataFromUrl(propertyUrl);
      console.log('Resultado da extração:', result);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success && result.data) {
        setPropertyData(result.data);
        setExtractionResult({
          success: true,
          message: "Dados extraídos com sucesso!",
        });
        
        toast({
          title: "Extração concluída",
          description: "Os dados do imóvel foram extraídos com sucesso.",
        });
      } else {
        throw new Error(result.error || 'Erro desconhecido na extração');
      }
    } catch (error) {
      console.error("Erro na extração:", error);
      setExtractionResult({
        success: false,
        message: error.message || "Não foi possível extrair os dados do imóvel.",
      });
      
      toast({
        title: "Erro na extração",
        description: error.message || "Não foi possível extrair os dados do imóvel.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Input 
          type="url" 
          placeholder="https://www.sitedeleilao.com.br/imovel/123"
          value={propertyUrl}
          onChange={(e) => setPropertyUrl(e.target.value)}
          disabled={extracting}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleExtractData} 
          disabled={extracting || !propertyUrl} 
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
