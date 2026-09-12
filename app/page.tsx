import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LeaderboardSection } from "@/components/leaderboard-section";
import { Library } from "@/components/library";
import { Method } from "@/components/method";
import { SiteNav } from "@/components/site-nav";
import { Studio } from "@/components/studio/studio";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <div className="px-4 py-10 sm:px-6 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <Studio />
          </div>
        </div>
        <Library />
        <Method />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
