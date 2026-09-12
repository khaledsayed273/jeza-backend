import { invokeLLM } from "../../lib/llm";

export type GenerateLetterInput = {
  companyName: string;
  crNumber: string;
  recipientType: "قطاع_خاص" | "بنك" | "جهة_حكومية";
  recipientName: string;
  letterIdea: string;
};

export async function generateLetter(input: GenerateLetterInput): Promise<{ letter: string }> {
  const recipientLabel =
    input.recipientType === "قطاع_خاص"
      ? "شركة / منشأة قطاع خاص"
      : input.recipientType === "بنك"
      ? "بنك"
      : "جهة حكومية";

  const systemPrompt = `أنت متخصص في صياغة الخطابات الرسمية للموارد البشرية باللغة العربية الفصحى.

عند صياغة الخطاب:
- استخدم اللغة العربية الفصحى الرسمية
- اتبع الهيكل الرسمي: التاريخ، المرسل إليه، الموضوع، المقدمة، الصلب، الخاتمة، التوقيع
- أضف التاريخ الهجري والميلادي في الأعلى
- اجعل الخطاب مهنياً ومحترماً
- لا تضف أي تعليقات أو ملاحظات خارج نص الخطاب
- أعد فقط نص الخطاب الجاهز للطباعة`;

  const userPrompt = `صِغ خطاباً رسمياً بالمعلومات التالية:

المُرسِل:
- اسم المنشأة: ${input.companyName}
- رقم السجل التجاري / الرقم الوطني الموحد: ${input.crNumber}

موجّه إلى:
- نوع الجهة: ${recipientLabel}
- اسم الجهة / المستلم: ${input.recipientName}

فكرة الخطاب:
${input.letterIdea}

أنشئ مسودة خطاب رسمي كامل وجاهز للاستخدام.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const letter = (response as any)?.choices?.[0]?.message?.content ?? "";
  return { letter };
}
