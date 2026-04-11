import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Settings2, 
  RefreshCw, 
  Laptop, 
  Zap,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us & Our Process | RebootX",
  description: "Learn about RebootX's meticulous refurbishment process and our mission to provide premium, sustainable tech.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        {/* ── Hero Section ── */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <Leaf className="w-4 h-4" />
            <span>Sustainable Tech</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            Premium Laptops, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Restored to Perfection.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            At RebootX, we believe that high-performance technology shouldn't cost the earth. 
            We expertly refurbish corporate-grade laptops to give you uncompromising power, 
            complete reliability, and a greener footprint.
          </p>
        </section>

        {/* ── Our Process Section ── */}
        <section className="bg-white py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                The RebootX Process
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Every device goes through our rigorous 4-step restoration protocol 
                to ensure it meets our Grade A+ standard before it reaches your hands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Laptop,
                  title: "1. Premium Sourcing",
                  desc: "We exclusively source premium, business-grade laptops from trusted corporate off-lease programs. No consumer-grade compromises.",
                },
                {
                  icon: RefreshCw,
                  title: "2. Military-Grade Wipe",
                  desc: "Every drive undergoes a secure DOD-standard data wipe, followed by a comprehensive 50-point hardware diagnostic test.",
                },
                {
                  icon: Settings2,
                  title: "3. Precision Restoration",
                  desc: "Faulty components are replaced. Thermal paste is reapplied. Batteries are tested and upgraded. Everything is restored to peak condition.",
                },
                {
                  icon: ShieldCheck,
                  title: "4. Final Certification",
                  desc: "The laptop is deeply sanitized, re-imaged with a fresh OS, and put through heavy stress tests to earn its Grade A+ badge.",
                },
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className="relative flex flex-col p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-indigo-200 transition-transform shadow-sm">
                    <step.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 block">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The RebootX Guarantee ── */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 lg:px-20 overflow-hidden relative shadow-2xl">
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  The RebootX Guarantee
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  We stand by the quality of our work. That's why every laptop we sell comes 
                  with comprehensive protection, giving you the confidence to buy refurbished 
                  without second thoughts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: CheckCircle2, text: "Grade A+ Condition" },
                    { icon: Award, text: "1-Year Warranty Included" },
                    { icon: ShieldCheck, text: "Tested by Experts" },
                    { icon: Zap, text: "Performance Optimized" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                      <item.icon className="w-5 h-5 text-indigo-400" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:flex justify-end">
                {/* Visual representation of a sealed/certified box or badge */}
                <div className="relative w-72 h-72 rounded-full border border-indigo-500/30 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-indigo-400/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex flex-col items-center justify-center p-6 text-center shadow-lg shadow-indigo-500/30">
                      <Award className="w-12 h-12 text-white mb-2" />
                      <span className="text-white font-bold text-xl leading-tight">Certified<br/>Refurbished</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
