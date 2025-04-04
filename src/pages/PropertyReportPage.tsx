
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyReport from "@/components/PropertyReport";

export default function PropertyReportPage() {
  const { id } = useParams();

  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Relatório de Análise</h1>
            <p className="text-lfcom-gray-600 mt-1">
              Análise completa e detalhada do imóvel
            </p>
          </div>
          
          <PropertyReport />
        </div>
      </div>
    </Layout>
  );
}
