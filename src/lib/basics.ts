// Hand-written A1 basics (greetings, numbers, calendar, colours, sein/haben, articles).
// Everything here is standard German taught at A1; Arabic is plain Egyptian colloquial.
export type Row = [de: string, ar: string];
export type Section = { id: string; title: string; ar: string; note?: string; rows: Row[]; cols?: [string, string] };

export const sections: Section[] = [
  {
    id: 'gruesse', title: 'Begrüßung', ar: 'التحيات والمجاملات',
    note: 'في ألمانيا بنقول "Guten Tag" طول النهار تقريباً، و"Hallo" للأصحاب. "Tschüs" للوداع الخفيف.',
    rows: [
      ['Hallo!', 'أهلاً!'], ['Guten Morgen!', 'صباح الخير'], ['Guten Tag!', 'يوم سعيد / مساء الخير (طول النهار)'],
      ['Guten Abend!', 'مساء الخير'], ['Gute Nacht!', 'تصبح على خير'], ['Auf Wiedersehen!', 'مع السلامة (رسمي)'],
      ['Tschüs!', 'سلام! (بين الأصحاب)'], ['Bis bald!', 'أشوفك قريب'], ['Danke!', 'شكراً'], ['Bitte!', 'عفواً / اتفضل'],
      ['Entschuldigung!', 'آسف / لو سمحت'], ['Wie geht es dir?', 'عامل إيه؟ (للصاحب)'], ['Gut, danke!', 'كويس، شكراً'],
      ['Wie heißt du?', 'اسمك إيه؟'], ['Ich heiße Mohamed.', 'اسمي محمد'], ['Woher kommst du?', 'انت منين؟'],
      ['Ich komme aus Ägypten.', 'أنا من مصر'], ['Ich spreche Arabisch und ein bisschen Deutsch.', 'أنا بتكلم عربي وشوية ألماني'],
    ],
  },
  {
    id: 'zahlen', title: 'Zahlen 0–20', ar: 'الأرقام من 0 لـ 20',
    rows: [
      ['0 – null', ''], ['1 – eins', ''], ['2 – zwei', ''], ['3 – drei', ''], ['4 – vier', ''], ['5 – fünf', ''], ['6 – sechs', ''],
      ['7 – sieben', ''], ['8 – acht', ''], ['9 – neun', ''], ['10 – zehn', ''], ['11 – elf', ''], ['12 – zwölf', ''],
      ['13 – dreizehn', ''], ['14 – vierzehn', ''], ['15 – fünfzehn', ''], ['16 – sechzehn', ''], ['17 – siebzehn', ''],
      ['18 – achtzehn', ''], ['19 – neunzehn', ''], ['20 – zwanzig', ''],
    ],
  },
  {
    id: 'zehner', title: 'Zehner und hundert', ar: 'العشرات والمية',
    note: 'من 21 فصاعداً الألماني بيقول الآحاد الأول: 21 = einundzwanzig (واحد وعشرين) و 34 = vierunddreißig (أربعة وتلاتين).',
    rows: [
      ['30 – dreißig', ''], ['40 – vierzig', ''], ['50 – fünfzig', ''], ['60 – sechzig', ''], ['70 – siebzig', ''],
      ['80 – achtzig', ''], ['90 – neunzig', ''], ['100 – hundert', ''], ['21 – einundzwanzig', ''], ['34 – vierunddreißig', ''],
    ],
  },
  {
    id: 'tage', title: 'Wochentage', ar: 'أيام الأسبوع',
    rows: [
      ['Montag', 'الاتنين'], ['Dienstag', 'التلات'], ['Mittwoch', 'الأربع'], ['Donnerstag', 'الخميس'],
      ['Freitag', 'الجمعة'], ['Samstag', 'السبت'], ['Sonntag', 'الحد'],
    ],
  },
  {
    id: 'monate', title: 'Monate', ar: 'شهور السنة الميلادية',
    rows: [
      ['Januar', 'يناير'], ['Februar', 'فبراير'], ['März', 'مارس'], ['April', 'أبريل'], ['Mai', 'مايو'], ['Juni', 'يونيو'],
      ['Juli', 'يوليو'], ['August', 'أغسطس'], ['September', 'سبتمبر'], ['Oktober', 'أكتوبر'], ['November', 'نوفمبر'], ['Dezember', 'ديسمبر'],
    ],
  },
  {
    id: 'farben', title: 'Farben', ar: 'الألوان',
    rows: [
      ['rot', 'أحمر'], ['blau', 'أزرق'], ['grün', 'أخضر'], ['gelb', 'أصفر'], ['schwarz', 'أسود'], ['weiß', 'أبيض'],
      ['braun', 'بني'], ['grau', 'رمادي'], ['orange', 'برتقالي'], ['rosa', 'وردي'], ['lila', 'بنفسجي'],
    ],
  },
  {
    id: 'pronomen', title: 'sein – Ich bin …', ar: 'الفعل sein (يكون)',
    note: 'أهم فعل في الألماني. بنستخدمه مع الاسم والجنسية والحالة: Ich bin Student. Sie ist müde.',
    rows: [
      ['ich bin', 'أنا (كذا)'], ['du bist', 'انت'], ['er / sie / es ist', 'هو / هي'], ['wir sind', 'احنا'],
      ['ihr seid', 'انتو'], ['sie / Sie sind', 'هم / حضرتك (رسمي)'],
    ],
  },
  {
    id: 'haben', title: 'haben – Ich habe …', ar: 'الفعل haben (عنده / يملك)',
    note: 'Ich habe einen Bruder. = عندي أخ. Hast du Hunger? = جعان؟ (حرفياً: عندك جوع؟)',
    rows: [
      ['ich habe', 'عندي'], ['du hast', 'عندك'], ['er / sie / es hat', 'عنده / عندها'], ['wir haben', 'عندنا'],
      ['ihr habt', 'عندكم'], ['sie / Sie haben', 'عندهم / عند حضرتك'],
    ],
  },
  {
    id: 'artikel', title: 'der – die – das', ar: 'أدوات التعريف',
    note: 'كل اسم في الألماني له جنس: مذكر (der) أو مؤنث (die) أو محايد (das). الجمع دايماً die. اتعلم الاسم دايماً مع أداته: der Tisch، مش Tisch بس. وأول حرف في كل اسم بيتكتب كابيتال.',
    rows: [
      ['der Vater – die Väter', 'مذكر – جمع'], ['die Mutter – die Mütter', 'مؤنث – جمع'], ['das Kind – die Kinder', 'محايد – جمع'],
      ['ein Mann', 'راجل (نكرة مذكر)'], ['eine Frau', 'ست (نكرة مؤنث)'], ['ein Kind', 'طفل (نكرة محايد)'],
    ],
  },
];
