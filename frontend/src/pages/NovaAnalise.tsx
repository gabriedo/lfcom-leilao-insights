import Layout from "@/components/Layout";
import AnalysisForm from "@/components/AnalysisForm";

export default function NovaAnalise() {
  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Análise de Imóvel</h1>
              <p className="text-lg text-muted-foreground">
                Cole o link do imóvel para extrair automaticamente os dados e iniciar a análise.
              </p>
            </div>
            <AnalysisForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
