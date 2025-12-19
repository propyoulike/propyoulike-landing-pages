import { ProjectSchema } from "../../../src/content/schema/project.schema";
import { AUTHORING_RULES } from "./authoring.rules";
import type { AuthoringSchema } from "./authoring.types";
import { ZodTypeAny } from "zod";

function deriveField(schema: ZodTypeAny): any {
  const def: any = schema._def;

  switch (def.typeName) {
    case "ZodString":
      return { type: "string", visible: true, requiredForAuthoring: false };

    case "ZodNumber":
      return { type: "number", visible: true, requiredForAuthoring: false };

    case "ZodBoolean":
      return { type: "boolean", visible: true, requiredForAuthoring: false };

    case "ZodEnum":
      return {
        type: "enum",
        enumValues: def.values,
        visible: true,
        requiredForAuthoring: true,
      };

    case "ZodArray":
      return {
        type: "array",
        visible: true,
        requiredForAuthoring: def.minLength?.value > 0,
      };

    case "ZodObject": {
      const shape = def.shape();
      const fields: any = {};

      for (const key in shape) {
        fields[key] = deriveField(shape[key]);
      }

      return {
        type: "object",
        visible: true,
        requiredForAuthoring: false,
        fields,
      };
    }

    case "ZodOptional":
    case "ZodDefault":
      return deriveField(def.innerType);

    case "ZodEffects":
      return deriveField(def.schema);

    default:
      return { type: "unknown", visible: false };
  }
}

export function deriveAuthoringSchema(): AuthoringSchema {
  const shape = (ProjectSchema as any)._def.shape();
  const schema: AuthoringSchema = {};

  for (const key in shape) {
    schema[key] = {
      ...deriveField(shape[key]),
	visible: true,
      ...AUTHORING_RULES[key],
    };
  }

  return schema;
}
