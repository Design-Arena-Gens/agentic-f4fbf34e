import { NewsDashboard } from "@/components/news-dashboard";
import { carSources, fetchCarArticles } from "@/lib/carSources";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await fetchCarArticles();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <NewsDashboard articles={articles} sources={carSources} />
      </div>
    </main>
  );
}
