import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Chip } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  success: '#4caf50',
  fallback_used: '#ff9800',
  partial: '#9e9e9e',
  failed: '#f44336'
};

const ExtractionReport: React.FC = () => {
  const [report, setReport] = useState<ExtractionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/extraction-report');
        if (!response.ok) {
          throw new Error('Erro ao buscar relatório');
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <Typography>Carregando relatório...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erro: {error}</Typography>;
  }

  if (!report) {
    return <Typography>Nenhum dado disponível</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Relatório de Extração
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total de Extrações: {report.total}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Por Portal
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Portal</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(report.por_portal).map(([portal, count]) => (
                  <TableRow key={portal}>
                    <TableCell>{portal}</TableCell>
                    <TableCell align="right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Por Status
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(report.por_status).map(([status, count]) => (
                  <TableRow key={status}>
                    <TableCell>
                      <Chip
                        label={status}
                        sx={{
                          backgroundColor: statusColors[status as keyof typeof statusColors] || '#9e9e9e',
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Últimas Extrações
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Campos Faltantes</TableCell>
                <TableCell>Data/Hora</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.ultimos_logs.map((log) => (
                <TableRow key={log.url}>
                  <TableCell>{log.url}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      sx={{
                        backgroundColor: statusColors[log.status as keyof typeof statusColors] || '#9e9e9e',
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {log.missing_fields?.join(', ') || '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExtractionReport; 