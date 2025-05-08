import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, AlertCircle, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AutoSizer, List } from 'react-virtualized';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePicker } from '@/components/ui/date-picker';

interface ExtractionLog {
  url: string;
  status: string;
  missing_fields?: string[];
  timestamp: string;
}

interface ExtractionReport {
  total: number;
  por_portal: Record<string, number>;
  por_status: Record<string, number>;
  ultimos_logs: ExtractionLog[];
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

type SortField = 'url' | 'status' | 'timestamp';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;
const ROW_HEIGHT = 48; // Altura de cada linha em pixels

const ExtractionReportPage: React.FC = () => {
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const debouncedDomainFilter = useDebounce(domainFilter, 300);

  const { data: report, isLoading, error, refetch } = useQuery<ExtractionReport>({
    queryKey: ['extractionReport'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/v1/extraction-report');
      if (!response.ok) {
        throw new Error('Erro ao buscar relatório');
      }
      return response.json();
    }
  });

  const filteredLogs = React.useMemo(() => {
    if (!report?.ultimos_logs) return [];

    return report.ultimos_logs
      .filter(log => {
        const matchesDomain = debouncedDomainFilter
          ? log.url.toLowerCase().includes(debouncedDomainFilter.toLowerCase())
          : true;
        
        const matchesStatus = statusFilter
          ? log.status === statusFilter
          : true;

        const logDate = parseISO(log.timestamp);
        const matchesStartDate = startDate
          ? logDate >= startDate
          : true;
        
        const matchesEndDate = endDate
          ? logDate <= endDate
          : true;

        return matchesDomain && matchesStatus && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortField === 'timestamp') {
          return sortOrder === 'asc'
            ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
            : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
        }
        
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [report?.ultimos_logs, debouncedDomainFilter, statusFilter, sortField, sortOrder, startDate, endDate]);

  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['URL', 'Status', 'Campos Faltantes', 'Data/Hora'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.url,
        log.status,
        log.missing_fields?.join(';') || '',
        format(parseISO(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extraction-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const renderRow = ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
    const log = paginatedLogs[index];
    return (
      <div key={key} style={style} className="flex border-t">
        <div className="p-2 flex-1">{log.url}</div>
        <div className="p-2 flex-1 capitalize">{log.status.replace('_', ' ')}</div>
        <div className="p-2 flex-1">{log.missing_fields?.join(', ') || '-'}</div>
        <div className="p-2 flex-1">
          {format(parseISO(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatório de Extração</h1>
        <Button onClick={() => refetch()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error instanceof Error ? error.message : 'Erro desconhecido'}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Extrações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{report?.total || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(report?.por_status || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge variant={statusColors[status as keyof typeof statusColors]}>
                    {statusLabels[status as keyof typeof statusLabels]}
                  </Badge>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Domínio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(report?.por_portal || {}).map(([domain, total]) => ({
                domain,
                total,
                ...Object.entries(report?.por_status || {}).reduce((acc, [status, count]) => ({
                  ...acc,
                  [status]: count
                }), {})
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(statusColors).map((status) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    name={statusLabels[status as keyof typeof statusLabels]}
                    fill={`hsl(var(--${statusColors[status as keyof typeof statusColors]}))`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Extrações</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Filtrar por domínio..."
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <DatePicker
                  date={startDate}
                  onDateChange={setStartDate}
                  className="w-full"
                />
                <DatePicker
                  date={endDate}
                  onDateChange={setEndDate}
                  className="w-full"
                />
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="flex font-medium">
                <div
                  className="p-2 flex-1 cursor-pointer"
                  onClick={() => handleSort('url')}
                >
                  URL {sortField === 'url' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div
                  className="p-2 flex-1 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="p-2 flex-1">Campos Faltantes</div>
                <div
                  className="p-2 flex-1 cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  Data/Hora {sortField === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </div>
              <div style={{ height: '400px' }}>
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={paginatedLogs.length}
                      rowHeight={ROW_HEIGHT}
                      rowRenderer={renderRow}
                    />
                  )}
                </AutoSizer>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {paginatedLogs.length} de {filteredLogs.length} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="text-sm">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractionReportPage; 