import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExtractionReportPage from './ExtractionReportPage';

const mockReport = {
  total: 100,
  por_portal: {
    'portal1.com': 50,
    'portal2.com': 50
  },
  por_status: {
    success: 80,
    fallback_used: 10,
    partial: 5,
    failed: 5
  },
  ultimos_logs: Array.from({ length: 100 }, (_, i) => ({
    url: `https://portal${i % 2 + 1}.com/imovel${i}`,
    status: i % 4 === 0 ? 'success' : i % 4 === 1 ? 'fallback_used' : i % 4 === 2 ? 'partial' : 'failed',
    missing_fields: i % 4 === 3 ? ['preco', 'area'] : undefined,
    timestamp: `2024-05-${String(i + 1).padStart(2, '0')}T10:00:00Z`
  }))
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ExtractionReportPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockReport)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o componente corretamente', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Relatório de Extração')).toBeInTheDocument();
      expect(screen.getByText('Total de Extrações')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('filtra logs por domínio', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      expect(screen.getByText('https://portal1.com/imovel0')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText('Filtrar por domínio...');
    fireEvent.change(filterInput, { target: { value: 'portal1' } });

    await waitFor(() => {
      expect(screen.getByText('https://portal1.com/imovel0')).toBeInTheDocument();
      expect(screen.queryByText('https://portal2.com/imovel1')).not.toBeInTheDocument();
    });
  });

  it('filtra logs por status', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    const statusFilter = screen.getByRole('combobox');
    fireEvent.click(statusFilter);
    
    const failedOption = screen.getByText('Falha');
    fireEvent.click(failedOption);

    await waitFor(() => {
      expect(screen.getByText('https://portal1.com/imovel3')).toBeInTheDocument();
      expect(screen.queryByText('https://portal1.com/imovel0')).not.toBeInTheDocument();
    });
  });

  it('filtra logs por data', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      expect(screen.getByText('https://portal1.com/imovel0')).toBeInTheDocument();
    });

    const startDatePicker = screen.getAllByRole('button')[0];
    fireEvent.click(startDatePicker);
    
    const startDate = screen.getByText('5');
    fireEvent.click(startDate);

    await waitFor(() => {
      expect(screen.getByText('https://portal1.com/imovel0')).toBeInTheDocument();
      expect(screen.getByText('https://portal2.com/imovel1')).toBeInTheDocument();
    });

    const endDatePicker = screen.getAllByRole('button')[1];
    fireEvent.click(endDatePicker);
    
    const endDate = screen.getByText('4');
    fireEvent.click(endDate);

    await waitFor(() => {
      expect(screen.queryByText('https://portal1.com/imovel0')).not.toBeInTheDocument();
      expect(screen.queryByText('https://portal2.com/imovel1')).not.toBeInTheDocument();
    });
  });

  it('ordena logs por data', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    const dateHeader = screen.getByText('Data/Hora').closest('div');
    fireEvent.click(dateHeader!);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('https://portal1.com/imovel99');
      expect(rows[2]).toHaveTextContent('https://portal2.com/imovel98');
    });
  });

  it('navega entre páginas', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Página 1 de 10')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Próximo');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Página 2 de 10')).toBeInTheDocument();
    });

    const prevButton = screen.getByText('Anterior');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('Página 1 de 10')).toBeInTheDocument();
    });
  });

  it('exporta dados para CSV', async () => {
    const createObjectURL = jest.fn();
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    renderWithQueryClient(<ExtractionReportPage />);
    
    const exportButton = screen.getByText('Exportar CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
    });
  });

  it('mostra mensagem de erro quando a API falha', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('renderiza apenas os itens visíveis na viewport', async () => {
    renderWithQueryClient(<ExtractionReportPage />);
    
    await waitFor(() => {
      const visibleRows = screen.getAllByRole('row');
      expect(visibleRows.length).toBeLessThanOrEqual(10); // ITEMS_PER_PAGE
    });
  });
}); 