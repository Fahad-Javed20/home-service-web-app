import Image from "next/image";
import Link from "next/link";
import { Briefcase, MapPin, ShieldCheck, Star } from "lucide-react";
import { getServiceProviders } from "@/lib/data/providers";
import { getHeroCategories } from "@/lib/data/home";
import BookNowButton from "@/app/_components/BookNowButton";

type ServicesPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const categories = await getHeroCategories(6);

  const isValidCategory = categories.some(
    (category) => category.id === params.category
  );
  const activeCategoryId = isValidCategory ? params.category : undefined;
  const providers = await getServiceProviders({
    categoryId: activeCategoryId,
  });

  const activeCategoryName =
    categories.find((category) => category.id === activeCategoryId)?.name ?? "All Services";

  return (
    <section className="bg-white py-12 px-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
          Verified Experts
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900">Service Providers</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Browse verified professionals and book trusted help near you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="rounded-2xl border border-gray-200 bg-[#F8F7FF] p-4 h-fit lg:sticky lg:top-24">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
            Categories
          </p>

          <nav className="flex flex-col gap-2">
            <Link
              href="/serviceproviders"
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                !activeCategoryId
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              All Services
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/serviceproviders?category=${category.id}`}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  activeCategoryId === category.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-500">
              Showing providers for{" "}
              <span className="font-semibold text-gray-800">{activeCategoryName}</span>
            </p>
            <p className="text-sm text-gray-400">{providers.length} results</p>
          </div>

          {providers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
              No verified providers available in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <article
                  key={provider.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="relative h-48 bg-purple-50">
                    <Image
                      src={provider.imageUrl ?? "/file.svg"}
                      alt={provider.providerName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 text-gray-700 text-xs px-2.5 py-1 border border-gray-200">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      Verified
                    </span>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-900">{provider.providerName}</h2>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={14} className="text-primary" />
                      <span>{provider.serviceName}</span>
                      <span className="text-gray-300">|</span>
                      <span>{provider.categoryName}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                      <span className="text-gray-400">
                        ({provider.totalReviews} reviews)
                      </span>
                    </div>

                    <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <p>{provider.location}</p>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {provider.yearsOfExperience
                        ? `${provider.yearsOfExperience}+ years of experience`
                        : "Experience details coming soon"}
                    </p>

                    <BookNowButton
                      providerId={provider.id}
                      className="mt-4 w-full rounded-lg bg-primary text-white text-sm font-semibold py-2.5 hover:bg-purple-600 transition-colors"
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
