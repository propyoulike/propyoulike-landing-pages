// scripts/jsonTemplateGenerator/assertSchemaParity.ts
import { ProjectSchema } from "@/content/schema/project.schema";
import authoringSchema from "@/content/authoring.schema.json";

const shape = (ProjectSchema as any)._def.shape();

for (const key in shape) {
  if (!authoringSchema[key]) {
    throw new Error(`❌ Missing authoring field for schema key: ${key}`);
  }
}

console.log("✅ Authoring schema covers all project schema fields");
