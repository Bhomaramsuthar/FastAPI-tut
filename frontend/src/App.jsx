import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Weight,
  Ruler,
  Building2,
  Cigarette,
  IndianRupee,
  Briefcase,
  HeartPulse,
  Info,
} from "lucide-react";

const OCCUPATION_OPTIONS = [
  { value: "retired", label: "Retired" },
  { value: "freelancer", label: "Freelancer" },
  { value: "student", label: "Student" },
  { value: "government_job", label: "Government Job" },
  { value: "business_owner", label: "Business Owner" },
  { value: "unemployed", label: "Unemployed" },
  { value: "private_job", label: "Private Job" },
];

function App() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    city: "",
    smoker: false,
    income_lpa: "",
    occupation: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      city: formData.city,
      smoker: Boolean(formData.smoker),
      income_lpa: Number(formData.income_lpa),
      occupation: formData.occupation,
    };

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail ||
            `Server responded with status ${res.status}`
        );
      }

      const data = await res.json();
      setResult(data.predicted_category);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ──── tiny reusable pieces ──── */

  const labelClasses =
    "flex items-center gap-2 text-sm font-semibold text-slate-300 mb-1.5";

  const inputClasses =
    "w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none hover:border-slate-600";

  const iconProps = { size: 15, className: "text-blue-400" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12 font-[Inter,system-ui,sans-serif]">
      {/* ─── Ambient glow circles ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* ─── Card ─── */}
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* ─── Header ─── */}
          <div className="border-b border-slate-800/60 px-8 pt-10 pb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Insurance Premium Predictor
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              Fill out the details below and our AI model will predict your
              insurance premium category instantly.
            </p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="px-8 pt-8 pb-10 space-y-7">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Age */}
              <div>
                <label htmlFor="age" className={labelClasses}>
                  <User {...iconProps} /> Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  required
                  placeholder="e.g., 30"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className={labelClasses}>
                  <Weight {...iconProps} /> Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g., 72"
                  value={formData.weight}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Height */}
              <div>
                <label htmlFor="height" className={labelClasses}>
                  <Ruler {...iconProps} /> Height (in meters)
                </label>
                <div className="relative">
                  <input
                    id="height"
                    name="height"
                    type="number"
                    step="any"
                    required
                    placeholder="e.g., 1.75"
                    value={formData.height}
                    onChange={handleChange}
                    className={inputClasses + " pr-10"}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 group cursor-pointer">
                    <Info size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-slate-700 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                      Enter height in meters. The backend calculates BMI as
                      weight&nbsp;/&nbsp;(height²).
                    </span>
                  </div>
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className={labelClasses}>
                  <Building2 {...iconProps} /> City of Residence
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g., Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Income */}
              <div>
                <label htmlFor="income_lpa" className={labelClasses}>
                  <IndianRupee {...iconProps} /> Income (LPA)
                </label>
                <input
                  id="income_lpa"
                  name="income_lpa"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g., 8.5"
                  value={formData.income_lpa}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className={labelClasses}>
                  <Briefcase {...iconProps} /> Occupation
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleChange}
                  className={inputClasses + " appearance-none cursor-pointer"}
                >
                  <option value="" disabled>
                    Select occupation…
                  </option>
                  {OCCUPATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Smoker toggle — full width */}
            <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/40 px-5 py-4">
              <label
                htmlFor="smoker"
                className="flex items-center gap-2.5 text-sm font-semibold text-slate-300 cursor-pointer select-none"
              >
                <Cigarette size={16} className="text-orange-400" />
                Are you a smoker?
              </label>
              {/* Custom toggle switch */}
              <button
                type="button"
                role="switch"
                id="smoker"
                aria-checked={formData.smoker}
                onClick={() =>
                  setFormData((p) => ({ ...p, smoker: !p.smoker }))
                }
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  formData.smoker ? "bg-blue-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                    formData.smoker ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
              {/* Hidden checkbox for form semantics */}
              <input
                type="checkbox"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
                className="sr-only"
                tabIndex={-1}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <HeartPulse size={18} />
                  Predict Premium
                </>
              )}
            </button>
          </form>

          {/* ─── Result ─── */}
          {result && (
            <div className="mx-8 mb-8 animate-[fadeSlideIn_0.4s_ease-out]">
              <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-6 py-5 shadow-lg shadow-emerald-900/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
                    Predicted Premium Category
                  </p>
                  <p className="mt-1 text-xl font-bold capitalize text-emerald-300">
                    {result}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Error ─── */}
          {error && (
            <div className="mx-8 mb-8 animate-[fadeSlideIn_0.4s_ease-out]">
              <div className="flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-950/40 px-6 py-5 shadow-lg shadow-red-900/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20">
                  <AlertCircle size={22} className="text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400/80">
                    Error
                  </p>
                  <p className="mt-1 text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Powered by FastAPI &amp; Machine Learning
        </p>
      </div>
    </div>
  );
}

export default App;
