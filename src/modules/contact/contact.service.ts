import { notifyOwner } from "../../lib/notification";

export type SubmitRequestInput = {
  requestType: "individual" | "company";
  name: string;
  phone: string;
  email?: string;
  university?: string;
  major?: string;
  semester?: string;
  companyName?: string;
  sector?: string;
  workersCount?: string;
  traineesNeeded?: string;
  trainingDuration?: string;
  trainingField?: string;
  notes?: string;
};

export async function submitRequest(input: SubmitRequestInput) {
  const isIndividual = input.requestType === "individual";
  const typeLabel = isIndividual ? "فرد متدرب" : "شركة / منشأة";

  let details = "";
  if (isIndividual) {
    details = [
      `الاسم: ${input.name}`,
      `الجوال: ${input.phone}`,
      input.email ? `البريد: ${input.email}` : null,
      input.university ? `الجامعة: ${input.university}` : null,
      input.major ? `التخصص: ${input.major}` : null,
      input.semester ? `الفصل الدراسي: ${input.semester}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    details = [
      `اسم الشركة: ${input.companyName || "-"}`,
      `المسؤول: ${input.name}`,
      `الجوال: ${input.phone}`,
      input.email ? `البريد: ${input.email}` : null,
      input.sector ? `القطاع: ${input.sector}` : null,
      input.workersCount ? `عدد الموظفين: ${input.workersCount}` : null,
      input.traineesNeeded ? `عدد المتدربين المطلوبين: ${input.traineesNeeded}` : null,
      input.trainingDuration ? `مدة التدريب: ${input.trainingDuration}` : null,
      input.trainingField ? `مجال التدريب: ${input.trainingField}` : null,
      input.notes ? `ملاحظات: ${input.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const title = `طلب تدريب جديد — ${typeLabel}: ${isIndividual ? input.name : (input.companyName || input.name)}`;
  const content = `نوع الطلب: ${typeLabel}\n\n${details}\n\n---\nتم الإرسال من منصة مواكبة للموارد البشرية`;

  try {
    await notifyOwner({ title, content });
  } catch (err) {
    console.error("[Contact] Failed to notify owner:", err);
    // لا نُوقف العملية — نعيد نجاحاً للمستخدم دائماً
  }

  return { success: true };
}
