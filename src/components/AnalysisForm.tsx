
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Upload, X, Link as LinkIcon, Loader2, MapPin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StepIndicator from "./StepIndicator";
import PropertyTypeSelector from "./PropertyTypeSelector";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

export default function AnalysisForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Fonte", "Detalhes", "Documentos", "Revisão"];
  
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [propertyUrl, setPropertyUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Form fields
  const [propertyType, setPropertyType] = useState("");
  const [auctionType, setAuctionType] = useState("");
  const [minBid, setMinBid] = useState("");
  const [evaluatedValue, setEvaluatedValue] = useState("");
  const [address, setAddress] = useState("");
  const [auctionDate, setAuctionDate] = useState<Date | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      const filesWithPreview = selectedFiles.map(file => {
        // Create preview URL for images
        if (file.type.startsWith("image/")) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
        }
        return file;
      });
      
      setFiles(prev => [...prev, ...filesWithPreview]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files => {
      const newFiles = [...files];
      // Revoke object URL if it exists to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

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
    
    // Simulando a extração de dados (em produção, aqui seria uma chamada à API)
    try {
      // Simulação de tempo para extração
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulação de dados extraídos
      const mockExtractedData = {
        propertyType: "apartment",
        auctionType: "judicial",
        minBid: "150000",
        evaluatedValue: "280000",
        address: "Av. Paulista, 1000, Apto 123, São Paulo - SP",
        // Aqui simularíamos arquivos extraídos também
      };
      
      // Atualiza o formulário com os dados extraídos
      setPropertyType(mockExtractedData.propertyType);
      setAuctionType(mockExtractedData.auctionType);
      setMinBid(mockExtractedData.minBid);
      setEvaluatedValue(mockExtractedData.evaluatedValue);
      setAddress(mockExtractedData.address);
      
      setExtractionResult({
        success: true,
        message: "Dados extraídos com sucesso! Os campos foram preenchidos automaticamente.",
      });
      
      toast({
        title: "Extração concluída",
        description: "Os dados do imóvel foram extraídos com sucesso.",
      });
      
      // Avança para o próximo passo após extração bem-sucedida
      setCurrentStep(1);
    } catch (error) {
      console.error("Erro na extração:", error);
      setExtractionResult({
        success: false,
        message: "Não foi possível extrair os dados do imóvel. Verifique a URL ou preencha os dados manualmente.",
      });
      
      toast({
        title: "Erro na extração",
        description: "Não foi possível extrair os dados do imóvel.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Análise iniciada",
        description: "Seu relatório estará pronto em breve.",
      });
      // Here you would typically redirect to a results page
    }, 2000);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Format currency values
  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    
    if (!onlyNumbers) return "";
    
    const number = parseInt(onlyNumbers, 10) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(number);
  };
  
  const handleMinBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setMinBid("");
      return;
    }
    
    const formatted = formatCurrency(value);
    setMinBid(formatted);
  };
  
  const handleEvaluatedValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setEvaluatedValue("");
      return;
    }
    
    const formatted = formatCurrency(value);
    setEvaluatedValue(formatted);
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card className="lfcom-card mb-6">
            <CardHeader>
              <CardTitle>Link do imóvel</CardTitle>
              <CardDescription>
                Cole o link do imóvel para extração automática dos dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Input 
                    type="url" 
                    placeholder="https://www.sitedeleilao.com.br/imovel/123"
                    value={propertyUrl}
                    onChange={(e) => setPropertyUrl(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleExtractData} 
                  disabled={extracting || !propertyUrl} 
                  className="whitespace-nowrap"
                >
                  {extracting ? 
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extraindo...
                    </> : 
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Extrair dados
                    </>
                  }
                </Button>
              </div>
              
              {extractionResult && (
                <Alert variant={extractionResult.success ? "default" : "destructive"}>
                  <AlertDescription>
                    {extractionResult.message}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setCurrentStep(1)}>
                  Preencher manualmente
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card className="lfcom-card mb-6">
            <CardHeader>
              <CardTitle>Detalhes do imóvel</CardTitle>
              <CardDescription>
                Preencha as informações básicas do imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Tipo de Imóvel</Label>
                <PropertyTypeSelector value={propertyType} onChange={setPropertyType} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auctionType">Tipo de Leilão/Venda</Label>
                <Select value={auctionType} onValueChange={setAuctionType}>
                  <SelectTrigger id="auctionType">
                    <SelectValue placeholder="Selecione o tipo de leilão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="judicial">Leilão Judicial</SelectItem>
                    <SelectItem value="extrajudicial">Leilão Extrajudicial</SelectItem>
                    <SelectItem value="bank">Venda Direta (Banco)</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minBid">Lance Mínimo</Label>
                  <Input 
                    id="minBid" 
                    type="text"
                    placeholder="R$ 0,00"
                    value={minBid}
                    onChange={handleMinBidChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluatedValue">Valor de Avaliação</Label>
                  <Input 
                    id="evaluatedValue" 
                    type="text"
                    placeholder="R$ 0,00"
                    value={evaluatedValue}
                    onChange={handleEvaluatedValueChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data do Leilão</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !auctionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {auctionDate ? (
                          format(auctionDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={auctionDate}
                        onSelect={setAuctionDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  Endereço Completo
                </Label>
                <Textarea 
                  id="address" 
                  placeholder="Digite o endereço completo do imóvel"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button onClick={nextStep}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="lfcom-card mb-6">
            <CardHeader>
              <CardTitle>Documentos do imóvel</CardTitle>
              <CardDescription>
                Faça upload dos documentos relacionados ao imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Anexar documentos</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/10">
                  <Input
                    id="fileUpload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium mb-1">
                      Clique para fazer upload dos documentos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Edital, Matrícula, Fotos, Certidões, etc.
                    </span>
                  </Label>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Arquivos selecionados ({files.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {files.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-muted/20 p-3 rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            {file.preview ? (
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img 
                                  src={file.preview} 
                                  alt={file.name}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-muted/40 rounded flex items-center justify-center">
                                <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)} 
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button onClick={nextStep}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="lfcom-card mb-6">
            <CardHeader>
              <CardTitle>Revisão</CardTitle>
              <CardDescription>
                Revise os dados antes de iniciar a análise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Detalhes do imóvel</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <span className="text-sm font-medium">
                        {propertyType === "apartment" ? "Apartamento" : 
                         propertyType === "house" ? "Casa" : 
                         propertyType === "commercial" ? "Comercial" : 
                         propertyType === "land" ? "Terreno" : 
                         propertyType === "rural" ? "Rural" : "Não especificado"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Leilão:</span>
                      <span className="text-sm font-medium">
                        {auctionType === "judicial" ? "Judicial" : 
                         auctionType === "extrajudicial" ? "Extrajudicial" : 
                         auctionType === "bank" ? "Venda Direta (Banco)" : 
                         auctionType === "other" ? "Outro" : "Não especificado"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lance mínimo:</span>
                      <span className="text-sm font-medium">{minBid || "Não informado"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor avaliado:</span>
                      <span className="text-sm font-medium">{evaluatedValue || "Não informado"}</span>
                    </li>
                    {auctionDate && (
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Data do leilão:</span>
                        <span className="text-sm font-medium">
                          {format(auctionDate, "PPP", { locale: ptBR })}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Endereço</h3>
                  <p className="text-sm">{address || "Não informado"}</p>
                  
                  <h3 className="text-sm font-semibold mt-4 mb-2">Documentos</h3>
                  {files.length > 0 ? (
                    <p className="text-sm">{files.length} {files.length === 1 ? "arquivo anexado" : "arquivos anexados"}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum documento anexado</p>
                  )}
                </div>
              </div>
              
              <div className="pt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSubmit}
                  disabled={loading || files.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Iniciar Análise Completa"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-3xl mx-auto">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
      />
      {getStepContent(currentStep)}
    </form>
  );
}
