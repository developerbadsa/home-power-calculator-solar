import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { HowItWorks, Guides, Faq } from "@/components/home-sections";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export default function Home() {
  return (
    <>
      <ServiceWorkerRegister />
      <Header />
      <main id="main" className="flex-1">
        <Hero />

        {/* The unified calculator (§5–6) */}
        <section
          id="calculator"
          aria-label="Calculator"
          className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8"
        >
          <CalculatorWizard />
        </section>

        <HowItWorks />
        <Guides />
        <Faq />
      </main>
      <Footer />
    </>
  );
}