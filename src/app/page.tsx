import Navbar from "@/components/navbar";
import ProductList from "@/components/product-list";
import WelcomeUser from "@/components/welcomepage";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                Welcome <WelcomeUser/> to <span className="text-primary">EcomStore</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Discover amazing products at unbeatable prices. Your one-stop
                shop for everything you need.
              </p>
            </div>

            <ProductList />
          </div>
        </section>
      </main>
    </div>
  );
}
