import { trVal } from "../../shared/translations";
import { getJobDescriptionsData } from "./jobDescriptions.repository";

export async function getJobDescriptions() {
  const { dbDepts, dbJobs, deptTr, jobTr } = await getJobDescriptionsData();

  const departmentList = dbDepts.map(d => ({
    id: d.code,
    name: trVal(deptTr, d.id, "name", "ar"),
    nameEn: trVal(deptTr, d.id, "name", "en"),
    icon: trVal(deptTr, d.id, "icon", "ar") || "📁",
    color: trVal(deptTr, d.id, "color", "ar") || "oklch(0.55 0.18 200)",
    description: trVal(deptTr, d.id, "description", "ar"),
  }));

  const jobList = dbJobs.map(j => {
    const dept = dbDepts.find(d => d.id === j.departmentId);
    const responsibilitiesRaw = trVal(jobTr, j.id, "responsibilities", "ar");
    const qualificationsRaw = trVal(jobTr, j.id, "qualifications", "ar");
    const skillsRaw = trVal(jobTr, j.id, "skills", "ar");
    return {
      id: j.code,
      title: trVal(jobTr, j.id, "title", "ar"),
      titleEn: trVal(jobTr, j.id, "title", "en"),
      department: dept ? trVal(deptTr, dept.id, "name", "ar") : "",
      departmentId: dept?.code ?? "",
      level: j.level,
      summary: trVal(jobTr, j.id, "summary", "ar"),
      responsibilities: (() => { try { return JSON.parse(responsibilitiesRaw); } catch { return responsibilitiesRaw ? [responsibilitiesRaw] : []; } })(),
      qualifications: (() => { try { return JSON.parse(qualificationsRaw); } catch { return qualificationsRaw ? [qualificationsRaw] : []; } })(),
      skills: (() => { try { return JSON.parse(skillsRaw); } catch { return skillsRaw ? [skillsRaw] : []; } })(),
      experience: trVal(jobTr, j.id, "experience", "ar"),
      education: trVal(jobTr, j.id, "education", "ar"),
    };
  });

  return { departments: departmentList, jobs: jobList };
}
