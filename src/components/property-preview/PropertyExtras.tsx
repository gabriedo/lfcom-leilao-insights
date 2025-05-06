import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PropertyExtrasProps {
  documents?: any[] | null;
  auctions?: any[] | null;
}

export const PropertyExtras: React.FC<PropertyExtrasProps> = ({ documents, auctions }) => (
  <div className="space-y-2">
    <div>
      <strong>Documentos:</strong> {Array.isArray(documents) ? documents.length : 0} disponível(is)
      {Array.isArray(documents) && documents.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {documents.slice(0, 3).map((doc, idx) => (
            <Badge key={idx} variant="outline">
              {doc?.name || doc?.type || 'Documento'}
            </Badge>
          ))}
          {documents.length > 3 && <span className="text-xs text-muted-foreground">+{documents.length - 3} mais</span>}
        </div>
      )}
    </div>
    <Separator />
    <div>
      <strong>Lances:</strong> {Array.isArray(auctions) ? auctions.length : 0} registrado(s)
      {Array.isArray(auctions) && auctions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {auctions.slice(0, 3).map((auc, idx) => (
            <Badge key={idx} variant="secondary">
              {auc?.label || auc?.date || 'Leilão'}
            </Badge>
          ))}
          {auctions.length > 3 && <span className="text-xs text-muted-foreground">+{auctions.length - 3} mais</span>}
        </div>
      )}
    </div>
  </div>
); 