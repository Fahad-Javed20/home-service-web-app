import HeroSection from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import PopularBusiness from "./_components/PopularBussiness";
import StatsBanner from "./_components/StatusBanner";
import WhyChooseUs from "./_components/WhyChooseUs";
import NewsLetter from "./_components/NewsLetter";
import Testimonials from "./_components/Testimonials";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <PopularBusiness />
      <HowItWorks />
      <WhyChooseUs />
      <StatsBanner />
      <Testimonials />
      <NewsLetter />
    </div>
  );
}
