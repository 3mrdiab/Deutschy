// Data model for all six CEFR levels. Only levels with status "live" have lessons; the rest are marked as upcoming.
export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Level = { id: LevelId; status: 'live' | 'soon'; nameAr: string; descAr: string; plannedAr: string[] };

export const levels: Level[] = [
  { id: 'A1', status: 'live', nameAr: 'مبتدئ', descAr: 'الأساسيات: التحيات، الأرقام، العيلة، الأكل، البيت، المواصلات. بتبدأ تتكلم جمل بسيطة.', plannedAr: [] },
  { id: 'A2', status: 'soon', nameAr: 'أساسي', descAr: 'الروتين اليومي، التسوق، السفر، الماضي البسيط (Perfekt)، الحديث عن الصحة والشغل.', plannedAr: ['الماضي بـ Perfekt', 'حروف الجر مع الأماكن', 'الشغل والصحة', 'التسوق والسفر'] },
  { id: 'B1', status: 'soon', nameAr: 'متوسط', descAr: 'تعبّر عن رأيك، تحكي تجارب، وتفهم الأخبار والمحادثات الواضحة.', plannedAr: ['جمل Nebensatz (weil, dass, wenn)', 'Konjunktiv II الأساسي', 'الأخبار والإعلام', 'العمل والدراسة'] },
  { id: 'B2', status: 'soon', nameAr: 'فوق المتوسط', descAr: 'نقاشات معقدة، مقالات، ومواضيع مجردة بطلاقة مقبولة.', plannedAr: ['المبني للمجهول (Passiv)', 'Konjunktiv I والكلام المنقول', 'الكتابة الرسمية', 'مواضيع المجتمع'] },
  { id: 'C1', status: 'soon', nameAr: 'متقدم', descAr: 'تتكلم وتكتب بدقة وأسلوب، وتفهم نصوص طويلة ومعقدة.', plannedAr: ['الأسلوب الأكاديمي', 'التعبيرات الاصطلاحية', 'النصوص الأدبية'] },
  { id: 'C2', status: 'soon', nameAr: 'إتقان', descAr: 'مستوى قريب من الناطق الأصلي: فروق دقيقة في المعنى والأسلوب.', plannedAr: ['فروق المعنى الدقيقة', 'اللهجات والأساليب', 'الترجمة والتلخيص'] },
];
export const levelOf = (id: string) => levels.find((l) => l.id === id);
// Every topic in data/vocab.json belongs to a level; for now all existing topics are A1.
export const topicLevel = (_topic: string): LevelId => 'A1';
