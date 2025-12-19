import fs from "fs";
import path from "path";
import { deriveAuthoringSchema } from "./deriveAuthoringSchema";
import { AUTHORING_SCHEMA_PATH } from "../paths";

/* -------------------------------------------------
   Ensure content directory exists
------------------------------------------------- */
const outDir = path.dirname(AUTHORING_SCHEMA_PATH);
fs.mkdirSync(outDir, { recursive: true });

/* -------------------------------------------------
   Generate authoring schema
------------------------------------------------- */
const schema = deriveAuthoringSchema();

fs.writeFileSync(
  AUTHORING_SCHEMA_PATH,
  JSON.stringify(schema, null, 2),
  "utf-8"
);

console.log("✅ Authoring schema written to:", AUTHORING_SCHEMA_PATH);
