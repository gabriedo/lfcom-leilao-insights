
import Layout from "@/components/Layout";
import AnalysisForm from "@/components/AnalysisForm";

export default function NovaAnalise() {
  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Nova Análise de Imóvel</h1>
              <p className="text-lfcom-gray-600">
                Preencha os dados e anexe os documentos para iniciar a análise completa do imóvel.
              </p>
            </div>
            <AnalysisForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
