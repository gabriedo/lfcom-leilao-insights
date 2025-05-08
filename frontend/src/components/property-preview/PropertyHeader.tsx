import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyHeaderProps {
  title: string;
  extractionStatus?: 'success' | 'fallback_used' | 'partial' | 'failed';
  onRefresh?: () => void;
}

const statusColors = {
  success: 'default',
  fallback_used: 'secondary',
  partial: 'outline',
  failed: 'destructive'
} as const;

const statusLabels = {
  success: 'Sucesso',
  fallback_used: 'Fallback',
  partial: 'Parcial',
  failed: 'Falha'
} as const;

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  extractionStatus = 'success',
  onRefresh
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="tracking-tight text-2xl font-bold truncate max-w-[70vw]">
        {title || 'Título não disponível'}
      </CardTitle>
      <div className="flex items-center space-x-2">
        <Badge variant={statusColors[extractionStatus]}>
          {statusLabels[extractionStatus]}
        </Badge>
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title="Atualizar dados"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}; 