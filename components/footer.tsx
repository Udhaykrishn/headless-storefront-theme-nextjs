import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="xl:grid xl:grid-cols-3 xl:gap-24">
          <div className="space-y-8">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              NEXT<span className="text-indigo-600">STORE</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Premium tech essentials for the modern lifestyle. Quality gear, expert support, and global shipping.
            </p>
            <div className="flex space-x-6">
              {['Facebook', 'Instagram', 'X'].map((social) => (
                <a key={social} href="/" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <span className="text-xs font-semibold uppercase">{social}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6">Shop</h3>
              <ul className="space-y-4">
                {['Laptops', 'Tablets', 'Accessories', 'New Arrival'].map((item) => (
                  <li key={item}>
                    <Link href="/shop" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                       {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6">Support</h3>
              <ul className="space-y-4">
                {['Track Order', 'Shipping', 'Returns', 'FAQ'].map((item) => (
                  <li key={item}>
                    <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                       {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6">Company</h3>
              <ul className="space-y-4">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms'].map((item) => (
                  <li key={item}>
                    <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                       {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            &copy; 2026 NEXTSTORE. All rights reserved. Premium tech commerce.
          </p>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span>English (US)</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
