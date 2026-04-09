'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, Home, MessageCircle } from 'lucide-react';
import { waLink } from '@/lib/utils';

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return { emi, totalInterest, totalPayment };
}

function formatINR(n: number) {
  if (!isFinite(n) || n <= 0) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState<number>(2500000);   // 25 L default
  const [rate, setRate] = useState<number>(8.5);                  // 8.5% default
  const [years, setYears] = useState<number>(20);                 // 20 yrs default

  const { emi, totalInterest, totalPayment } = useMemo(
    () => calcEMI(principal, rate, years),
    [principal, rate, years]
  );

  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div
        className="text-white py-14 px-4"
        style={{
          background:
            'linear-gradient(150deg, var(--color-navy-dark), var(--color-navy) 60%, var(--color-navy-light))'
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[var(--color-amber-light)] text-xs font-bold uppercase tracking-wider">
            <Calculator size={14} /> Free Tool
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black mt-4">Home Loan EMI Calculator</h1>
          <p className="text-white/70 mt-3 max-w-xl mx-auto text-sm">
            Estimate your monthly home loan EMI before you commit. Adjust loan amount, interest rate, and tenure to see how your payment changes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Loan Details</h2>

            <Slider
              label="Loan Amount"
              value={principal}
              onChange={setPrincipal}
              min={100000}
              max={50000000}
              step={50000}
              format={formatINR}
              quickValues={[1000000, 2500000, 5000000, 10000000]}
              quickFormat={(n) => (n >= 10000000 ? `₹${n / 10000000}Cr` : `₹${n / 100000}L`)}
            />

            <Slider
              label="Interest Rate"
              value={rate}
              onChange={setRate}
              min={1}
              max={20}
              step={0.05}
              format={(n) => `${n.toFixed(2)}% per annum`}
              quickValues={[7.5, 8.5, 9.5, 10.5]}
              quickFormat={(n) => `${n}%`}
            />

            <Slider
              label="Loan Tenure"
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              format={(n) => `${n} year${n === 1 ? '' : 's'}`}
              quickValues={[5, 10, 15, 20, 25, 30]}
              quickFormat={(n) => `${n}y`}
            />
          </div>

          {/* Result */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] text-white rounded-2xl p-6 shadow-xl">
              <div className="text-xs uppercase tracking-wider text-white/60 font-bold">Monthly EMI</div>
              <div className="font-display text-4xl font-black text-[var(--color-amber-light)] mt-2">
                {formatINR(emi)}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
                <Row label="Principal" value={formatINR(principal)} />
                <Row label="Total Interest" value={formatINR(totalInterest)} />
                <Row label="Total Payment" value={formatINR(totalPayment)} bold />
              </div>

              {/* Visual interest/principal ratio */}
              <div className="mt-5">
                <div className="text-xs text-white/60 mb-2">
                  Interest is <strong className="text-[var(--color-amber-light)]">{interestPercent.toFixed(1)}%</strong> of total payment
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="bg-[var(--color-amber)]" style={{ width: `${100 - interestPercent}%` }} />
                  <div className="bg-rose-400" style={{ width: `${interestPercent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Principal</span>
                  <span>Interest</span>
                </div>
              </div>
            </div>

            <a
              href={waLink('917396979572', `Hi SMA Builders! I used your EMI calculator. Loan: ${formatINR(principal)}, EMI: ${formatINR(emi)}/month. Please share suitable property options.`)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--color-wa)] text-white font-bold hover:opacity-90"
            >
              <MessageCircle size={16} /> Discuss on WhatsApp
            </a>

            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border-2 border-gray-200 text-gray-800 font-bold hover:bg-gray-50"
            >
              <Home size={16} /> Browse Properties
            </Link>
          </aside>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>Disclaimer:</strong> This calculator provides indicative figures only. Actual loan terms, eligibility, processing fees, insurance, and prepayment charges depend on your bank or housing finance company. Consult your lender for exact figures before making any financial decisions.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{label}</span>
      <span className={bold ? 'text-white font-bold' : 'text-white/90'}>{value}</span>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  quickValues: number[];
  quickFormat: (v: number) => string;
}

function Slider({ label, value, onChange, min, max, step, format, quickValues, quickFormat }: SliderProps) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        <span className="font-display text-lg font-black text-[var(--color-navy)]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full bg-gray-200 appearance-none cursor-pointer accent-[var(--color-navy)]"
      />
      <div className="flex flex-wrap gap-1.5 mt-3">
        {quickValues.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-3 py-1 rounded-md text-xs font-bold border ${
              Math.abs(value - v) < step * 0.5
                ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[var(--color-navy)]'
            }`}
          >
            {quickFormat(v)}
          </button>
        ))}
      </div>
    </div>
  );
}
