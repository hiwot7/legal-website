export type Lang = "en" | "am" | "om";

export type PracticeArea = { t: string; d: string };

export type Translation = {
  nav: string[];
  firm: string;
  firmSub: string;
  cities: string;
  heroKicker: string;
  heroTitle: string;
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statCases: string;
  statYears: string;
  statPartners: string;
  workEyebrow: string;
  workTitle: string;
  discuss: string;
  areas: PracticeArea[];
  teamEyebrow: string;
  teamTitle: string;
  lookupEyebrow: string;
  lookupTitle: string;
  lookupSub: string;
  lookupPlaceholder: string;
  search: string;
  searching: string;
  resultClient: string;
  resultAttorney: string;
  resultStatus: string;
  resultKetero: string;
  resultCourt: string;
  noResultHint: string;
  lookupNotFound: string;
  aiTitle: string;
  aiDisclaimer: string;
  aiPlaceholder: string;
  aiOpenLabel: string;
  aiGreeting: string;
  aiUnavailable: string;
  insightsEyebrow: string;
  insightsTitle: string;
  readMore: string;
  share: string;
  copied: string;
  contactEyebrow: string;
  contactTitle: string;
  contactSub: string;
  formName: string;
  formEmail: string;
  formPhone: string;
  formArea: string;
  formAreaSelect: string;
  formMessage: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccessTitle: string;
  formSuccessBody: string;
  formDisclaimer: string;
  footerRights: string;
  footerNote: string;
};

export const T: Record<Lang, Translation> = {
  en: {
    nav: ["What We Do", "Our Team", "Case Lookup", "Insights", "Contact"],
    firm: "Beka Law Firm",
    firmSub: "Law Firm LLP",
    cities: "Addis Ababa, Ethiopia",
    heroKicker: "Championing Justice and Excellence for Over 35 Years",
    heroTitle: "Built for Complex Decisions & Modern Practice.",
    heroSub:
      "Thirty-five years of Ethiopian legal expertise, paired with the kind of client tools most firms still don't offer — live case tracking, instant guidance, and counsel that answers.",
    ctaPrimary: "Track My Case",
    ctaSecondary: "Consult AI Assistant",
    statCases: "Cases Resolved",
    statYears: "Years in Practice",
    statPartners: "Partners",
    workEyebrow: "What We Do",
    workTitle: "Practice Areas",
    discuss: "Discuss a dispute",
    areas: [
      { t: "Commercial Arbitration", d: "Strategic representation in complex commercial disputes and arbitration proceedings." },
      { t: "Court Proceedings", d: "Dedicated representation in litigation with disciplined case preparation and advocacy." },
      { t: "Commercial Matters", d: "Comprehensive legal support for business operations, contracts, and transactions." },
      { t: "Trademark Registration", d: "End-to-end trademark registration, portfolio protection, and enforcement support." },
      { t: "Taxation", d: "Tax advisory and planning for businesses, projects, and investment activities." },
      { t: "Investment", d: "Guidance for market entry, licensing, incentives, and investor compliance." },
      { t: "Employment", d: "Workforce structuring, labor compliance, disputes, and employment documentation." },
      { t: "Immigration", d: "Legal support for work permits, residency pathways, and related compliance." },
      { t: "Intellectual Property", d: "IP strategy, filing, licensing, and protection for commercial rights." },
    ],
    teamEyebrow: "Our Team",
    teamTitle: "Meet the Attorneys",
    lookupEyebrow: "Case Status",
    lookupTitle: "Track Your Case",
    lookupSub: "Enter your Case ID or the phone number on file to see where things stand.",
    lookupPlaceholder: "e.g. CASE-2026-89 or 09xx xxx xxx",
    search: "Search",
    searching: "Searching…",
    resultClient: "Client",
    resultAttorney: "Assigned Attorney",
    resultStatus: "Court Status",
    resultKetero: "Next Hearing (Ketero)",
    resultCourt: "Court",
    noResultHint: "Enter the Case ID or phone number on file for your matter.",
    lookupNotFound: "We couldn't find a case matching that Case ID or phone number. Please double-check it, or contact us directly.",
    aiTitle: "AI Legal Assistant",
    aiDisclaimer: "For informational purposes only. Consult a licensed attorney for formal legal advice.",
    aiPlaceholder: "Ask about contracts, disputes, timelines…",
    aiOpenLabel: "Consult AI Assistant",
    aiGreeting:
      "Hello — I'm the virtual assistant for Beka Law Firm. I can answer general questions about our practice areas or help you describe your legal matter. How can I help today?",
    aiUnavailable: "The AI assistant isn't configured yet. Please contact the firm directly.",
    insightsEyebrow: "Legal Insights",
    insightsTitle: "Analysis & Commentary",
    readMore: "Read the brief",
    share: "Share",
    copied: "Link Copied!",
    contactEyebrow: "Get in Touch",
    contactTitle: "Contact Us",
    contactSub: "Schedule your free consultation, or send us a message and we'll respond within one business day.",
    formName: "Full name",
    formEmail: "Email",
    formPhone: "Phone (optional)",
    formArea: "Practice area",
    formAreaSelect: "Select one",
    formMessage: "How can we help?",
    formSubmit: "Send Message",
    formSubmitting: "Sending…",
    formSuccessTitle: "Thank you for reaching out.",
    formSuccessBody: "We've received your message and will get back to you within one business day.",
    formDisclaimer: "Submitting this form does not create an attorney-client relationship.",
    footerRights: "All rights reserved.",
    footerNote: "Advocates admitted to practice before the Federal Courts of Ethiopia.",
  },
  am: {
    nav: ["የምናከናውነው", "ቡድናችን", "የክስ ማጣራት", "ጠቃሚ መረጃዎች", "አግኙን"],
    firm: "ቤካ ሎው ፈርም",
    firmSub: "የህግ ድርጅት",
    cities: "አዲስ አበባ፣ ኢትዮጵያ",
    heroKicker: "ከ35 ዓመታት በላይ ፍትህን እና ብቃትን በማስፈን",
    heroTitle: "ውስብስብ ውሳኔዎችና ለዘመናዊ ተግባር የተገነባ።",
    heroSub:
      "ሠላሳ አምስት ዓመታት የኢትዮጵያ የህግ ልምድ፣ ብዙ ድርጅቶች ገና ያላቀረቧቸው የደንበኞች መሣሪያዎች ጋር ተዳምሮ — ቀጥታ የክስ ክትትል፣ ፈጣን መረጃ፣ እና ምላሽ የሚሰጥ አማካሪነት።",
    ctaPrimary: "ጉዳዬን ተከታተል",
    ctaSecondary: "ከ AI አማካሪ ጠይቅ",
    statCases: "የተፈቱ ጉዳዮች",
    statYears: "የስራ ዓመታት",
    statPartners: "አጋር ጠበቆች",
    workEyebrow: "የምናከናውነው",
    workTitle: "የህግ ዘርፎች",
    discuss: "ጉዳይዎን ያማክሩ",
    areas: [
      { t: "የንግድ ግልግል (አርቢትሬሽን)", d: "ውስብስብ የንግድ ክርክሮች እና የግልግል ሂደቶች ስትራቴጂያዊ ውክልና።" },
      { t: "ክርክር (ፍርድ ቤት)", d: "በጥንቃቄ የተዘጋጀ የክስ አያያዝና ተሟጋችነት ያለው የፍርድ ቤት ውክልና።" },
      { t: "የንግድ ጉዳዮች", d: "ለንግድ ስራ አሰራር፣ ውሎች እና ግብይቶች ሁሉን አቀፍ የህግ ድጋፍ።" },
      { t: "የንግድ ምልክት ምዝገባ", d: "ከጅምር እስከ መጨረሻ የንግድ ምልክት ምዝገባ፣ የፖርትፎሊዮ ጥበቃ እና አፈጻጸም ድጋፍ።" },
      { t: "ግብር", d: "ለንግድ ድርጅቶች፣ ፕሮጀክቶች እና ኢንቨስትመንት እንቅስቃሴዎች የግብር ምክርና ዕቅድ።" },
      { t: "ኢንቨስትመንት", d: "ለገበያ መግቢያ፣ ፍቃድ፣ ማበረታቻዎች እና ባለሀብት ተገዢነት መመሪያ።" },
      { t: "የስራ ቅጥር", d: "የሰራተኛ አደረጃጀት፣ የስራ ህግ ተገዢነት፣ ክርክሮች እና የስራ ሰነዶች።" },
      { t: "ስደት", d: "ለስራ ፈቃድ፣ የመኖሪያ ፈቃድ መንገዶች እና ተያያዥ ተገዢነት የህግ ድጋፍ።" },
      { t: "አዕምሯዊ ንብረት", d: "ለንግድ መብቶች ስትራቴጂ፣ ማመልከቻ፣ ፍቃድ አሰጣጥ እና ጥበቃ።" },
    ],
    teamEyebrow: "ቡድናችን",
    teamTitle: "ጠበቆቻችንን ይተዋወቁ",
    lookupEyebrow: "የክስ ሁኔታ",
    lookupTitle: "ጉዳይዎን ይከታተሉ",
    lookupSub: "የክስ መለያዎን ወይም የተመዘገበውን ስልክ ቁጥር ያስገቡ።",
    lookupPlaceholder: "ለምሳሌ CASE-2026-89 ወይም 09xx xxx xxx",
    search: "ፍለጋ",
    searching: "እየፈለገ ነው…",
    resultClient: "ደንበኛ",
    resultAttorney: "የተመደበ ጠበቃ",
    resultStatus: "የፍርድ ቤት ሁኔታ",
    resultKetero: "የሚቀጥለው ችሎት (ቀጠሮ)",
    resultCourt: "ፍርድ ቤት",
    noResultHint: "የተመዘገበውን የክስ መለያ ወይም ስልክ ቁጥር ያስገቡ።",
    lookupNotFound: "ከዚያ የክስ መለያ ወይም ስልክ ቁጥር ጋር የሚዛመድ ጉዳይ አላገኘንም። እባክዎ ያረጋግጡ ወይም በቀጥታ ያግኙን።",
    aiTitle: "AI ህግ አማካሪ",
    aiDisclaimer: "ለመረጃ አገልግሎት ብቻ የቀረበ ነው። መደበኛ የህግ ምክር ለማግኘት ፈቃድ ያለው ጠበቃ ያማክሩ።",
    aiPlaceholder: "ስለ ውሎች፣ ክርክሮች፣ የጊዜ ሰሌዳዎች ይጠይቁ…",
    aiOpenLabel: "ከ AI አማካሪ ጠይቅ",
    aiGreeting: "ሰላም — እኔ የቤካ ሎው ፈርም ምናባዊ አማካሪ ነኝ። ስለ አገልግሎቶቻችን ጠይቁኝ ወይም ጉዳይዎን ይግለጹልኝ።",
    aiUnavailable: "AI አማካሪው እስካሁን አልተዋቀረም። እባክዎ በቀጥታ ድርጅቱን ያግኙ።",
    insightsEyebrow: "የህግ ግንዛቤዎች",
    insightsTitle: "ትንታኔ እና አስተያየት",
    readMore: "ሙሉውን ያንብቡ",
    share: "አጋራ",
    copied: "ሊንክ ተቀድቷል!",
    contactEyebrow: "ያግኙን",
    contactTitle: "አግኙን",
    contactSub: "ነጻ ምክክርዎን ያስይዙ፣ ወይም መልእክት ይላኩልን በአንድ የስራ ቀን ውስጥ እንመልስልዎታለን።",
    formName: "ሙሉ ስም",
    formEmail: "ኢሜይል",
    formPhone: "ስልክ (አማራጭ)",
    formArea: "የህግ ዘርፍ",
    formAreaSelect: "አንዱን ይምረጡ",
    formMessage: "እንዴት ልንረዳዎ እንችላለን?",
    formSubmit: "መልእክት ላክ",
    formSubmitting: "እየተላከ ነው…",
    formSuccessTitle: "ስላገኙን እናመሰግናለን።",
    formSuccessBody: "መልእክትዎን ተቀብለናል በአንድ የስራ ቀን ውስጥ እንመልስልዎታለን።",
    formDisclaimer: "ይህን ቅጽ መላክ የጠበቃ-ደንበኛ ግንኙነት አይፈጥርም።",
    footerRights: "ሁሉም መብቶች የተጠበቁ ናቸው።",
    footerNote: "በኢትዮጵያ ፌደራል ፍርድ ቤቶች ፊት ለመቆም የተፈቀደላቸው ጠበቆች።",
  },
  om: {
    nav: ["Waan Hojjennu", "Garee Keenya", "Sakatta'a Dhimmaa", "Odeeffannoo", "Nu Qunnamaa"],
    firm: "Beka Law Firm",
    firmSub: "Dhaabbata Seeraa",
    cities: "Addis Ababaa, Itoophiyaa",
    heroKicker: "Waggoota 35 Oliif Haqaa fi Ol'aantummaa Kabajuu",
    heroTitle: "Murtoowwan Walxaxaa fi Hojii Ammayyaaf Ijaarame.",
    heroSub:
      "Muuxannoo seera Itoophiyaa kan waggaa 35 ol ta'e, meeshaalee ammayyaa maamiltootaaf ijaaramaniin walitti dhufe — hordoffii dhimmaa yeroo dhugaa, gorsa dafaa, fi tajaajila deebii kennu.",
    ctaPrimary: "Dhimma Koo Hordofi",
    ctaSecondary: "Gorsaa AI Gaafadhu",
    statCases: "Dhimmoota Xumuraman",
    statYears: "Waggoota Hojii",
    statPartners: "Hiriyoota Abukaatoo",
    workEyebrow: "Waan Hojjennu",
    workTitle: "Damee Tajaajilaa",
    discuss: "Dhimma kee mari'adhu",
    areas: [
      { t: "Araarsummaa Daldalaa", d: "Bakka bu'iinsa istiraatejiidhaan wal falmii daldalaa walxaxaa fi adeemsa araarsummaa keessatti." },
      { t: "Falmii Mana Murtii", d: "Bakka bu'iinsa falmii keessatti qophii dhimmaa fi falmii cimaa qabu." },
      { t: "Dhimmoota Daldalaa", d: "Deeggarsa seeraa guutuu hojii daldalaa, waliigaltee, fi daldalaaf." },
      { t: "Galmeessa Mallattoo Daldalaa", d: "Galmeessa mallattoo daldalaa, eegumsa qabeenyaa, fi deeggarsa raawwii guutuu." },
      { t: "Gibira", d: "Gorsaa fi karoora gibiraa dhaabbilee, piroojektota, fi sochii invastimantiif." },
      { t: "Invastimantii", d: "Qajeelfama seensa gabaa, hayyama, jajjabeessaa, fi hordoffii invastaroota." },
      { t: "Hojii", d: "Ijaarsa hojjettootaa, hordoffii seera hojii, wal falmii, fi sanadoota hojii." },
      { t: "Godaansa", d: "Deeggarsa seeraa hayyama hojii, karaa jireenyaa, fi hordoffii walqabatu." },
      { t: "Qabeenya Sammuu", d: "Istiraatejii, iyyata, hayyama, fi eegumsa mirga daldalaa." },
      { t: "Seera Maatii", d: "Hiikkaa, kunuunsa daa'immanii, fi dhimma dhaalaa xiyyeeffannaan raawwatama." },
    ],
    teamEyebrow: "Garee Keenya",
    teamTitle: "Abukaatoota Keenya Beekaa",
    lookupEyebrow: "Haala Dhimmaa",
    lookupTitle: "Dhimma Kee Hordofi",
    lookupSub: "Lakkoofsa Dhimmaa kee ykn bilbila galmeeffame galchi.",
    lookupPlaceholder: "fkn CASE-2026-89 ykn 09xx xxx xxx",
    search: "Barbaadi",
    searching: "Barbaadaa jira…",
    resultClient: "Maamila",
    resultAttorney: "Abukaatoo Ramadame",
    resultStatus: "Haala Mana Murtii",
    resultKetero: "Dhaddacha Itti Aanu (Ketero)",
    resultCourt: "Mana Murtii",
    noResultHint: "Lakkoofsa Dhimmaa ykn bilbila galmeeffame galchi.",
    lookupNotFound: "Lakkoofsa Dhimmaa ykn bilbilaa sana waliin kan walqabatu hin argamne. Maaloo mirkaneessi ykn kallattiin nu qunnamaa.",
    aiTitle: "Gorsaa Seeraa AI",
    aiDisclaimer: "Kun qofa odeeffannoodhaaf. Gorsa seeraa dhugaa argachuuf abukaatoo hayyama qabu gaafadhaa.",
    aiPlaceholder: "Waa'ee waliigaltee, falmii, yeroo gaafadhu…",
    aiOpenLabel: "Gorsaa AI Gaafadhu",
    aiGreeting:
      "Akkam — ani gorsaa virtual Beka Law Firm ti. Waa'ee tajaajila keenyaa na gaafadhaa ykn dhimma kee naa ibsi.",
    aiUnavailable: "Gorsaan AI amma hin qindaa'ne. Maaloo dhaabbata kallattiin qunnamaa.",
    insightsEyebrow: "Hubannaa Seeraa",
    insightsTitle: "Xiinxala fi Yaada",
    readMore: "Guutuu dubbisi",
    share: "Qooddu",
    copied: "Liinkiin Garagalfame!",
    contactEyebrow: "Nu Qunnamaa",
    contactTitle: "Nu Qunnamaa",
    contactSub: "Gorsa bilisaa keessan haa qopheessinu, ykn ergaa nuu ergaa guyyaa hojii tokko keessatti deebii argattu.",
    formName: "Maqaa guutuu",
    formEmail: "Imeelii",
    formPhone: "Bilbila (filannoo)",
    formArea: "Damee seeraa",
    formAreaSelect: "Tokko filadhu",
    formMessage: "Akkamitti si gargaaruu dandeenya?",
    formSubmit: "Ergaa Ergi",
    formSubmitting: "Ergaa jira…",
    formSuccessTitle: "Nu qunnamuu keessaniif galatoomaa.",
    formSuccessBody: "Ergaa keessan argatneerra, guyyaa hojii tokko keessatti deebii isiniif kennina.",
    formDisclaimer: "Foormii kana erguun walitti dhufeenya abukaatoo-maamilaa hin uumu.",
    footerRights: "Mirgi hundi seeraan eegamaadha.",
    footerNote: "Abukaatoo Mana Murtii Federaalaa Itoophiyaa duratti dhaabbachuuf hayyamamaniidha.",
  },
};
