import Image from "next/image";
import Link from "next/link";
import { Briefcase, MapPin, ShieldCheck, Star } from "lucide-react";
import { getServiceProviders } from "@/backend/queries/providers";
import { getHeroCategories } from "@/backend/queries/home";
import BookNowButton from "@/app/_components/BookNowButton";

type ServicesPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const categories = await getHeroCategories(6);

  const isValidCategory = categories.some(
    (category) => category.id === params.category
  );
  const activeCategoryId = isValidCategory ? params.category : undefined;
  const query = params.q?.trim() ?? "";
  const providers = await getServiceProviders({
    categoryId: activeCategoryId,
    query,
    perCategoryLimit: 8,
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
        <form action="/serviceproviders" className="mt-4 flex flex-wrap gap-2">
          {activeCategoryId ? <input type="hidden" name="category" value={activeCategoryId} /> : null}
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search provider, city, or service"
            className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Search
          </button>
        </form>
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
              {query ? (
                <>
                  {" "}
                  matching <span className="font-semibold text-gray-800">&quot;{query}&quot;</span>
                </>
              ) : null}
            </p>
            <p className="text-sm text-gray-400">{providers.length} results</p>
          </div>

          {providers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
              No verified providers available in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {providers.map((provider) => (
                <article
                  key={provider.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative h-40 shrink-0 bg-slate-100">
                    <Image
                      src={provider.imageUrl ?? "/file.svg"}
                      alt={provider.providerName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-2.5 py-1 text-xs text-gray-700 shadow-sm">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      Verified
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <h2 className="min-h-6 truncate text-lg font-bold leading-tight text-gray-900">
                      {provider.providerName}
                    </h2>

                    <div className="mt-1 grid min-h-11 grid-cols-[14px_1fr] gap-2 text-sm text-gray-600">
                      <Briefcase size={14} className="mt-1 text-primary" />
                      <div className="min-w-0">
                        <p className="max-h-10 overflow-hidden text-[15px] leading-5 text-gray-700">
                          {provider.serviceName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">{provider.categoryName}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1 text-sm text-gray-600">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                      <span className="text-gray-400">
                        ({provider.totalReviews} reviews)
                      </span>
                    </div>

                    <div className="mt-1.5 flex min-h-9 items-start gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <p className="max-h-10 overflow-hidden leading-5">{provider.location}</p>
                    </div>

                    <p className="mt-1.5 min-h-5 text-sm text-gray-500">
                      {provider.yearsOfExperience
                        ? `${provider.yearsOfExperience}+ years of experience`
                        : "Experience details coming soon"}
                    </p>

                    <BookNowButton
                      providerId={provider.id}
                      className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
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
