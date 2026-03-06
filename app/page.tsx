import HeroSection from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import PopularBusiness from "./_components/PopularBussiness";
import StatsBanner from "./_components/StatusBanner";
import WhyChooseUs from "./_components/WhyChooseUs";
import NewsLetter from "./_components/NewsLetter";
import Testimonials from "./_components/Testimonials";
import {
  getHeroCategories,
  getPopularProviders,
  getStats,
  getTestimonials,
} from "@/backend/queries/home";

export default async function Home() {
  const [categories, popularProviders, testimonials, stats] = await Promise.all([
    getHeroCategories(),
    getPopularProviders(),
    getTestimonials(),
    getStats(),
  ]);

  return (
    <div>
      <HeroSection categories={categories} />
      <PopularBusiness providers={popularProviders} />
      <HowItWorks />
      <WhyChooseUs />
      <StatsBanner stats={stats} />
      <Testimonials testimonials={testimonials} />
      <NewsLetter />
    </div>
  );
}
