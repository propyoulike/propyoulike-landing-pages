import * as fs from "fs";
import {
  AUTHORING_SCHEMA_PATH,
  PROJECT_TEMPLATE_PATH,
  TEMPLATE_DIR,
} from "./paths.ts";

try {
  /* -------------------------------------------------
     Load authoring schema
  ------------------------------------------------- */
  if (!fs.existsSync(AUTHORING_SCHEMA_PATH)) {
    throw new Error(
      `Authoring schema not found at ${AUTHORING_SCHEMA_PATH}`
    );
  }

  const authoringSchema = JSON.parse(
    fs.readFileSync(AUTHORING_SCHEMA_PATH, "utf-8")
  );

  /* -------------------------------------------------
     Value generator
  ------------------------------------------------- */
  function generateValue(field: any): any {
    switch (field.type) {
      case "string":
        return field.format === "url" ? null : "";

      case "number":
        return 0;

      case "boolean":
        return false;

      case "enum":
        return field.enumValues?.[0] ?? "";

      case "array":
        return [];

      case "object": {
        const obj: any = {};
        if (field.fields) {
          for (const key in field.fields) {
            obj[key] = generateValue(field.fields[key]);
          }
        }
        if (field.note) obj._note = field.note;
        return obj;
      }

      default:
        return undefined;
    }
  }

  /* -------------------------------------------------
     Build project template
  ------------------------------------------------- */
  const template: any = {};

  for (const key in authoringSchema) {
    const field = authoringSchema[key];
    if (!field || field.visible === false) continue;
    template[key] = generateValue(field);
  }

  /* -------------------------------------------------
     Write output
  ------------------------------------------------- */
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });

  fs.writeFileSync(
    PROJECT_TEMPLATE_PATH,
    JSON.stringify(template, null, 2),
    "utf-8"
  );

  console.log("✅ Project template written to:");
  console.log("   ", PROJECT_TEMPLATE_PATH);

} catch (err) {
  console.error("❌ generateTemplatesFromAuthoring failed");

  if (err instanceof Error) {
    console.error(err.message);
    console.error(err.stack);
  } else {
    console.error("Non-error thrown:");
    console.error(JSON.stringify(err, null, 2));
  }

  process.exit(1);
}
