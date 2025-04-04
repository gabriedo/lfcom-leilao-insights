
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

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

interface FileWithPreview extends File {
  preview?: string;
}

export default function AnalysisForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <Card className="lfcom-card">
        <CardHeader>
          <CardTitle>Nova Análise de Imóvel</CardTitle>
          <CardDescription>
            Preencha as informações e faça upload dos documentos para análise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Tipo de Imóvel</Label>
            <Select>
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Selecione o tipo de imóvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartamento</SelectItem>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
                <SelectItem value="land">Terreno</SelectItem>
                <SelectItem value="rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auctionType">Tipo de Leilão/Venda</Label>
            <Select>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBid">Lance Mínimo (R$)</Label>
              <Input id="minBid" type="text" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluatedValue">Valor de Avaliação (R$)</Label>
              <Input id="evaluatedValue" type="text" placeholder="0,00" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Textarea id="address" placeholder="Digite o endereço completo do imóvel" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Documentos</Label>
            <div className="border-2 border-dashed border-lfcom-gray-300 rounded-lg p-6 text-center bg-lfcom-gray-50">
              <Input
                id="fileUpload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2 text-lfcom-gray-500" />
                <span className="text-sm font-medium mb-1">
                  Clique para fazer upload dos documentos
                </span>
                <span className="text-xs text-lfcom-gray-500">
                  Edital, Matrícula, Fotos, Certidões, etc.
                </span>
              </Label>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Arquivos selecionados</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-lfcom-gray-100 p-2 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        {file.preview ? (
                          <div className="w-8 h-8 rounded overflow-hidden">
                            <img 
                              src={file.preview} 
                              alt={file.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-lfcom-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs">{file.name.split('.').pop()}</span>
                          </div>
                        )}
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)} 
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-lfcom-black text-white hover:bg-lfcom-gray-800"
              disabled={loading || files.length === 0}
            >
              {loading ? "Processando..." : "Iniciar Análise Completa"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
