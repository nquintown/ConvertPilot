import Header from "@/components/Header";
import ConversionPanel from "@/components/ConversionPanel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <section className="pt-10 pb-6 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          Convertissez vos fichiers
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Images, vidéos, audio, documents et plus encore — convertis côté serveur, téléchargés instantanément.
        </p>
      </section>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-16">
        <ConversionPanel />
      </main>
    </div>
  );
}
