import Image from "next/image";
import { Briefcase, MapPin, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { getServiceProviderById } from "@/backend/queries/providers";
import BookingPanel from "./BookingPanel";

type ServiceDetailPageProps = {
  params: Promise<{
    providerId: string;
  }>;
  searchParams: Promise<{
    error?: string;
    status?: string;
  }>;
};

export default async function ServiceDetailPage({
  params,
  searchParams,
}: ServiceDetailPageProps) {
  const [{ providerId }, query] = await Promise.all([params, searchParams]);
  const provider = await getServiceProviderById(providerId);

  if (!provider) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          Service Details
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900">{provider.serviceName}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Complete service information, gallery, and appointment booking.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 sm:h-96">
            <Image
              src={provider.galleryImages[0] ?? "/file.svg"}
              alt={provider.serviceName}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">
              <ShieldCheck size={12} className="text-emerald-500" />
              Verified Provider
            </span>
          </div>

          {provider.galleryImages.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {provider.galleryImages.slice(1).map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="relative h-32 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                >
                  <Image
                    src={imageUrl}
                    alt={provider.serviceName}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <article className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">About This Service</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {provider.serviceDescription ??
                "A complete professional service by a verified expert with trusted quality standards."}
            </p>
            {provider.bio ? <p className="mt-3 text-sm leading-6 text-gray-600">{provider.bio}</p> : null}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Category</p>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Briefcase size={14} className="text-primary" />
                  {provider.categoryName}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Base Price
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">${provider.basePrice.toFixed(0)}</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
                <div className="mt-1 flex items-start gap-2 text-sm text-gray-700">
                  <MapPin size={14} className="mt-0.5 text-primary shrink-0" />
                  <span>{provider.location}</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rating</p>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({provider.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <BookingPanel
          providerId={provider.id}
          providerName={provider.providerName}
          serviceName={provider.serviceName}
          categoryName={provider.categoryName}
          location={provider.location}
          error={query.error}
          status={query.status}
        />
      </div>
    </section>
  );
}
