import { ZodTypeAny } from "zod";

export function zodToJsonTemplate(schema: ZodTypeAny): any {
  const def: any = schema._def;

  switch (def.typeName) {
    case "ZodObject": {
      const shape = def.shape();
      const out: any = {};
      for (const key in shape) {
        out[key] = zodToJsonTemplate(shape[key]);
      }
      return out;
    }

    case "ZodArray":
      return [];

    case "ZodString":
      return "";

    case "ZodNumber":
      return 0;

    case "ZodBoolean":
      return false;

    case "ZodEnum":
      return def.values[0];

    case "ZodOptional":
      // ✅ Optional fields should be omitted, not null
      return undefined;

    case "ZodNullable":
      return null;

    case "ZodDefault":
      return def.defaultValue();

    case "ZodUnion":
      return zodToJsonTemplate(def.options[0]);

    case "ZodLiteral":
      return def.value;

    /* -----------------------------
       URL strings need valid values
    ----------------------------- */
    case "ZodEffects": {
      // handles z.string().url(), refinements, etc.
      return zodToJsonTemplate(def.schema);
    }

    default:
      return undefined;
  }
}
