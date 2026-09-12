import { type MySqlTable } from "drizzle-orm/mysql-core";
import {
  declarations,
  updateSources,
  hcKpiCategories,
  hcBuiltinIndicators,
  hrCategories,
  hrSources,
  hrImages,
  departments,
  jobDescriptions,
  policyCategories,
  policies,
  quizCategories,
  quizQuestions,
  templateCategories,
  hrForms,
} from "../../../drizzle/schema";

export type IdColumn = "code" | "key" | "id";

export interface FkColumn {
  column: string;
  parentModule: string;
  parentSub: string;
}

export interface ContentSubEntity {
  module: string;
  sub: string;
  table: MySqlTable;
  entityType: string;
  idColumn: IdColumn;
  columns: string[];
  numberColumns?: string[];
  jsonColumns?: string[];
  translatedFields: string[];
  translatedJsonFields?: string[];
  fkColumns?: FkColumn[];
}

export const contentRegistry: ContentSubEntity[] = [
  {
    module: "declarations",
    sub: "declaration",
    table: declarations,
    entityType: "declaration",
    idColumn: "id",
    columns: ["sortOrder", "items", "fileUrl"],
    numberColumns: ["sortOrder"],
    jsonColumns: ["items"],
    translatedFields: ["title", "intro"],
  },
  {
    module: "updates",
    sub: "update_source",
    table: updateSources,
    entityType: "update_source",
    idColumn: "code",
    columns: ["code", "url", "type", "color", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name", "description"],
  },
  {
    module: "hc-indicators",
    sub: "category",
    table: hcKpiCategories,
    entityType: "hc_kpi_category",
    idColumn: "code",
    columns: ["code", "color", "icon", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "hc-indicators",
    sub: "indicator",
    table: hcBuiltinIndicators,
    entityType: "hc_builtin_indicator",
    idColumn: "key",
    columns: ["key", "higherIsBetter", "sortOrder"],
    numberColumns: ["higherIsBetter", "sortOrder"],
    translatedFields: ["name", "benchmark", "description", "unit"],
    fkColumns: [{ column: "categoryId", parentModule: "hc-indicators", parentSub: "category" }],
  },
  {
    module: "hr-explainers",
    sub: "category",
    table: hrCategories,
    entityType: "hr_category",
    idColumn: "code",
    columns: ["code", "color", "icon", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "hr-explainers",
    sub: "source",
    table: hrSources,
    entityType: "hr_source",
    idColumn: "code",
    columns: ["code", "url", "color", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
    fkColumns: [{ column: "categoryId", parentModule: "hr-explainers", parentSub: "category" }],
  },
  {
    module: "hr-explainers",
    sub: "image",
    table: hrImages,
    entityType: "hr_image",
    idColumn: "code",
    columns: ["code", "url", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "job-descriptions",
    sub: "department",
    table: departments,
    entityType: "department",
    idColumn: "code",
    columns: ["code", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name", "icon", "color", "description"],
  },
  {
    module: "job-descriptions",
    sub: "job",
    table: jobDescriptions,
    entityType: "job_description",
    idColumn: "code",
    columns: ["code", "level", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["title", "summary", "experience", "education", "responsibilities", "qualifications", "skills"],
    translatedJsonFields: ["responsibilities", "qualifications", "skills"],
    fkColumns: [{ column: "departmentId", parentModule: "job-descriptions", parentSub: "department" }],
  },
  {
    module: "policies",
    sub: "category",
    table: policyCategories,
    entityType: "policy_category",
    idColumn: "code",
    columns: ["code", "color", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "policies",
    sub: "policy",
    table: policies,
    entityType: "policy",
    idColumn: "code",
    columns: ["code", "chapterNum", "sortOrder"],
    numberColumns: ["chapterNum", "sortOrder"],
    jsonColumns: ["objectives", "policiesData", "proceduresData"],
    translatedFields: ["name"],
    fkColumns: [{ column: "categoryId", parentModule: "policies", parentSub: "category" }],
  },
  {
    module: "quiz",
    sub: "category",
    table: quizCategories,
    entityType: "quiz_category",
    idColumn: "code",
    columns: ["code", "color", "bgColor", "borderColor", "icon", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "quiz",
    sub: "question",
    table: quizQuestions,
    entityType: "quiz_question",
    idColumn: "id",
    columns: ["correctAnswer", "sortOrder"],
    numberColumns: ["correctAnswer", "sortOrder"],
    translatedFields: ["question", "option_0", "option_1", "option_2", "option_3", "explanation"],
    fkColumns: [{ column: "categoryId", parentModule: "quiz", parentSub: "category" }],
  },
  {
    module: "templates",
    sub: "category",
    table: templateCategories,
    entityType: "template_category",
    idColumn: "code",
    columns: ["code", "icon", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
  },
  {
    module: "templates",
    sub: "form",
    table: hrForms,
    entityType: "hr_form",
    idColumn: "code",
    columns: ["code", "fileUrl", "ext", "sortOrder"],
    numberColumns: ["sortOrder"],
    translatedFields: ["name"],
    fkColumns: [{ column: "categoryId", parentModule: "templates", parentSub: "category" }],
  },
];
