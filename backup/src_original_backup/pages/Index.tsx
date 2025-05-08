
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Metrics from "@/components/Metrics";
import Partners from "@/components/Partners";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Partners />
      <FeatureHighlights />
      <Metrics />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
