import React from 'react';
import { FileText, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PropertyExtrasProps {
  documents?: Array<{
    name: string;
    url: string;
    type?: string;
  }>;
  auctions?: Array<{
    name: string;
    url: string;
    date?: string;
  }>;
}

const PropertyExtras: React.FC<PropertyExtrasProps> = ({ documents = [], auctions = [] }) => {
  console.log('[PropertyExtras] Dados recebidos:', { documents, auctions });

  const hasDocuments = Array.isArray(documents) && documents.length > 0;
  const hasAuctions = Array.isArray(auctions) && auctions.length > 0;

  if (!hasDocuments && !hasAuctions) {
    return (
      <div className="text-sm text-gray-500">
        Nenhum documento ou lance disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasDocuments && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documentos ({documents.length})
          </h4>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <Card key={`doc-${index}`} className="p-2">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{doc.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                      >
                        Acessar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {hasDocuments && hasAuctions && <Separator />}

      {hasAuctions && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Gavel className="h-4 w-4 mr-2" />
            Lances ({auctions.length})
          </h4>
          <div className="space-y-2">
            {auctions.map((auction, index) => (
              <Card key={`auction-${index}`} className="p-2">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div>{auction.name}</div>
                      {auction.date && (
                        <div className="text-xs text-gray-500">
                          Data: {auction.date}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a
                        href={auction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                      >
                        Acessar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyExtras; 