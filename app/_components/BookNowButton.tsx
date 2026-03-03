import Link from "next/link";

type BookNowButtonProps = {
  providerId: string;
  className: string;
  label?: string;
};

export default function BookNowButton({
  providerId,
  className,
  label = "Book Now",
}: BookNowButtonProps) {
  return (
    <Link
      href={`/serviceproviders/${providerId}`}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {label}
    </Link>
  );
}
