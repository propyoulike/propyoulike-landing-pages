// src/components/widgets/HomeSizeAdvisor/types.ts
export type ApplicantType = "salaried" | "business";


export type HouseholdInput = {
adults: number;
kids: number;
elderly: number;
};


export type LifestyleInput = {
wfh: boolean;
guests: "rare" | "sometimes" | "frequent";
};


export type Applicant = {
age: number; // integer years
type: ApplicantType; // salaried | business
};


export type TenureInput = {
primary: Applicant;
coApplicant?: Applicant | null;
preferred?: number; // user-chosen, years
};


export type WidgetInput = {
household: HouseholdInput;
lifestyle: LifestyleInput;
tenure: TenureInput;
};


export type Recommendation = {
type: string; // e.g., '3 BHK'
size: string; // textual sqft or capacity
rationale: string[];
};


export type CalculatorOutput = {
primary: Recommendation;
backup: Recommendation;
roomsNeeded: number;
multiUnitSuggestion?: string | null;
maxTenureAllowed: number;
spacePressureScore: number; // 0-100
};