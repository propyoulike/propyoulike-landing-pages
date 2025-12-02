import { useState, useEffect } from "react";

/* ----------------------------------------------------
   UTIL FUNCTIONS
---------------------------------------------------- */
const monthlyRate = (annualRatePercent: number) =>
  annualRatePercent / 100 / 12;

const loanFromEmi = (emi: number, annualRatePercent: number, years: number) => {
  if (emi <= 0) return 0;
  const r = monthlyRate(annualRatePercent);
  const n = years * 12;
  if (r === 0) return emi * n;
  return (emi * (1 - Math.pow(1 + r, -n))) / r;
};

const computeAge = (dobStr: string) => {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  return age;
};

const retirementAgeFor = (type: "salaried" | "business") =>
  type === "salaried" ? 60 : 65;

const maxTenureByAge = (age: number | null, type: "salaried" | "business") => {
  if (age === null) return 30;
  const retire = retirementAgeFor(type);
  const rem = Math.max(0, retire - age);
  return Math.min(Math.max(5, rem), 30);
};

const formatINR = (n: number) =>
  n <= 0 ? "₹0" : `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/* ----------------------------------------------------
   TYPES
---------------------------------------------------- */
export interface Applicant {
  type: "salaried" | "business";
  dob: string;
  income: number;
  existingEmis?: number;
}

export interface ComputedLoan {
  totalMaxEmi: number;
  loanEligibility: number;
  effectiveTenure: number;
  propertyAffordability: number;
  requiredDownPayment: number;
}

/* ----------------------------------------------------
   HOOK: loan calculations
---------------------------------------------------- */
export const useLoanCalculator = (
  applicants: Applicant[],
  interestRate: number,
  tenureYears: number
) => {
  const [computed, setComputed] = useState<ComputedLoan>({
    totalMaxEmi: 0,
    loanEligibility: 0,
    effectiveTenure: tenureYears,
    propertyAffordability: 0,
    requiredDownPayment: 0,
  });

  useEffect(() => {
    const maxEmis = applicants.map((a) => {
      const age = computeAge(a.dob);
      const foir = a.type === "salaried" ? 0.55 : 0.45;
      const maxEmi = Math.max(
        0,
        (a.income || 0) * foir - (a.existingEmis || 0)
      );
      return maxEmi;
    });

    const totalMaxEmi = maxEmis.reduce((sum, m) => sum + m, 0);

    const effectiveTenure = Math.min(
      tenureYears,
      ...applicants.map((a) =>
        maxTenureByAge(computeAge(a.dob), a.type)
      )
    );

    const loanEligibility = loanFromEmi(
      totalMaxEmi,
      interestRate,
      effectiveTenure
    );

    setComputed({
      totalMaxEmi,
      loanEligibility,
      effectiveTenure,
      propertyAffordability: loanEligibility,
      requiredDownPayment: 0,
    });
  }, [applicants, interestRate, tenureYears]);

  return computed;
};

/* ----------------------------------------------------
   COMPONENT: Applicant Card
---------------------------------------------------- */
export const ApplicantCard = ({
  applicant,
  onChange,
  label = "Applicant",
}: {
  applicant: Applicant;
  onChange: (field: keyof Applicant, value: any) => void;
  label?: string;
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-3">
      <h4 className="font-semibold">{label}</h4>

      <div className="grid grid-cols-2 gap-3">
        <label>
          Type
          <select
            value={applicant.type}
            onChange={(e) =>
              onChange("type", e.target.value as "salaried" | "business")
            }
            className="input"
          >
            <option value="salaried">Salaried</option>
            <option value="business">Business / Self-employed</option>
          </select>
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={applicant.dob}
            onChange={(e) => onChange("dob", e.target.value)}
            className="input"
          />
        </label>

        <label>
          Monthly Income
          <input
            type="number"
            value={applicant.income}
            onChange={(e) => onChange("income", Number(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Existing EMIs
          <input
            type="number"
            value={applicant.existingEmis || 0}
            onChange={(e) => onChange("existingEmis", Number(e.target.value))}
            className="input"
          />
        </label>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   COMPONENT: Loan Parameters
---------------------------------------------------- */
export const LoanParametersCard = ({
  interestRate,
  tenureYears,
  onInterestChange,
  onTenureChange,
  maxTenure,
}: {
  interestRate: number;
  tenureYears: number;
  onInterestChange: (v: number) => void;
  onTenureChange: (v: number) => void;
  maxTenure: number;
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-3">
      <h4 className="font-semibold">Loan Parameters</h4>

      <label>
        Interest Rate (%)
        <input
          type="number"
          value={interestRate}
          onChange={(e) => onInterestChange(Number(e.target.value))}
          className="input"
        />
      </label>

      <label>
        Tenure (yrs)
        <input
          type="number"
          min={1}
          max={maxTenure}
          value={tenureYears}
          onChange={(e) => onTenureChange(Number(e.target.value))}
          className="input"
        />
      </label>
    </div>
  );
};

/* ----------------------------------------------------
   COMPONENT: Loan Outputs
---------------------------------------------------- */
export const LoanOutputCard = ({ computed }: { computed: ComputedLoan }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-3">
      <h4 className="font-semibold">Loan Summary</h4>

      <div>Max EMI: {formatINR(computed.totalMaxEmi)}</div>
      <div>Loan Eligibility: {formatINR(computed.loanEligibility)}</div>
      <div>Effective Tenure: {computed.effectiveTenure} yrs</div>
    </div>
  );
};

/* ----------------------------------------------------
   MAIN GENERIC WIDGET
---------------------------------------------------- */
const GenericLoanWidget = ({ onCtaClick }: { onCtaClick: () => void }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    { type: "salaried", dob: "", income: 0 },
  ]);

  const [interestRate, setInterestRate] = useState(8);
  const [tenureYears, setTenureYears] = useState(20);

  const computed = useLoanCalculator(applicants, interestRate, tenureYears);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        {applicants.map((a, idx) => (
          <ApplicantCard
            key={idx}
            applicant={a}
            label={`Applicant ${idx + 1}`}
            onChange={(field, value) => {
              const copy = [...applicants];
              copy[idx] = { ...copy[idx], [field]: value };
              setApplicants(copy);
            }}
          />
        ))}

        <button
          className="btn btn-primary"
          onClick={() =>
            setApplicants([
              ...applicants,
              { type: "salaried", dob: "", income: 0 },
            ])
          }
        >
          Add Applicant
        </button>

        <LoanParametersCard
          interestRate={interestRate}
          tenureYears={tenureYears}
          maxTenure={30}
          onInterestChange={setInterestRate}
          onTenureChange={setTenureYears}
        />

        <button className="btn btn-primary" onClick={onCtaClick}>
          Check Full Report
        </button>
      </div>

      <LoanOutputCard computed={computed} />
    </div>
  );
};

export default GenericLoanWidget;
