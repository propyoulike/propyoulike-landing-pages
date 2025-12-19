export type AuthoringField = {
  type: "string" | "number" | "boolean" | "array" | "object" | "enum";
  requiredForAuthoring: boolean;
  visible: boolean;
  note?: string;
  example?: any;
  enumValues?: string[];
  fields?: Record<string, AuthoringField>;
};

export type AuthoringSchema = Record<string, AuthoringField>;
