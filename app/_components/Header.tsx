import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-8">

            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="relative w-10 h-10 bg-linear-to-br from-primary to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">
                  HomeServe<span className="text-primary">Pro</span>
                </span>
                <span className="text-xs text-gray-500 font-medium">Professional Services</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-4">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group">
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

          <Link href="/get-started">
            <Button className="bg-primary hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}