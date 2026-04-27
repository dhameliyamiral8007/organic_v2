// Manually editable translations. Add or change strings here.
export type Lang = "en" | "hi" | "gu";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
];

export const dict = {
  "nav.home": { en: "Home", hi: "होम", gu: "હોમ" },
  "nav.shop": { en: "Shop", hi: "शॉप", gu: "શોપ" },
  "nav.about": { en: "About", hi: "हमारे बारे में", gu: "અમારા વિશે" },
  "nav.blog": { en: "Blog", hi: "ब्लॉग", gu: "બ્લોગ" },
  "nav.faq": { en: "FAQ", hi: "प्रश्न", gu: "પ્રશ્નો" },
  "nav.contact": { en: "Contact", hi: "संपर्क", gu: "સંપર્ક" },

  "header.tagline": {
    en: "Free delivery on orders above ₹499 · 100% Certified Organic",
    hi: "₹499 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी · 100% प्रमाणित जैविक",
    gu: "₹499 થી વધુના ઓર્ડર પર મફત ડિલિવરી · 100% પ્રમાણિત ઓર્ગેનિક",
  },
  "header.search": {
    en: "Search organic foods, herbs, fertilizers...",
    hi: "जैविक खाद्य, जड़ी-बूटियाँ, उर्वरक खोजें...",
    gu: "ઓર્ગેનિક ખોરાક, જડીબુટ્ટીઓ, ખાતર શોધો...",
  },
  "header.signin": { en: "Sign in", hi: "साइन इन", gu: "સાઇન ઇન" },

  "hero.badge": {
    en: "Certified Organic · Farm to Door",
    hi: "प्रमाणित जैविक · खेत से घर तक",
    gu: "પ્રમાણિત ઓર્ગેનિક · ખેતરથી ઘર સુધી",
  },
  "hero.title.a": { en: "Pure goodness,", hi: "शुद्ध अच्छाई,", gu: "શુદ્ધ ભલાઈ," },
  "hero.title.b": { en: "rooted", hi: "जड़ें", gu: "મૂળ" },
  "hero.title.c": { en: "in nature.", hi: "प्रकृति में।", gu: "પ્રકૃતિમાં." },
  "hero.subtitle": {
    en: "Hand-picked organic produce, herbs and pantry staples — sourced directly from trusted Indian farms, delivered to your home with care.",
    hi: "हाथ से चुने गए जैविक उत्पाद, जड़ी-बूटियाँ और किराने का सामान — सीधे विश्वसनीय भारतीय खेतों से।",
    gu: "હાથથી પસંદ કરાયેલા ઓર્ગેનિક ઉત્પાદનો, જડીબુટ્ટીઓ — સીધા વિશ્વસનીય ભારતીય ખેતરોથી.",
  },
  "hero.cta": { en: "Shop the harvest", hi: "खरीदारी करें", gu: "ખરીદી કરો" },

  "trust.organic": { en: "100% Organic", hi: "100% जैविक", gu: "100% ઓર્ગેનિક" },
  "trust.delivery": { en: "Fast Delivery", hi: "तेज़ डिलीवरी", gu: "ઝડપી ડિલિવરી" },
  "trust.customers": { en: "500+ Happy Customers", hi: "500+ खुश ग्राहक", gu: "500+ ખુશ ગ્રાહકો" },
  "trust.eco": { en: "Eco Friendly", hi: "इको फ्रेंडली", gu: "ઇકો ફ્રેન્ડલી" },

  "section.featured": { en: "This week's harvest", hi: "इस सप्ताह की फसल", gu: "આ અઠવાડિયાની લણણી" },
  "section.categories": { en: "Pick your aisle", hi: "श्रेणी चुनें", gu: "કેટેગરી પસંદ કરો" },
  "section.recent": { en: "Just landed", hi: "अभी आया", gu: "હમણાં આવ્યું" },
  "section.testimonials": { en: "What customers say", hi: "ग्राहक क्या कहते हैं", gu: "ગ્રાહકો શું કહે છે" },

  "checkout.title": { en: "Checkout", hi: "चेकआउट", gu: "ચેકઆઉટ" },
  "checkout.email": { en: "Email address", hi: "ईमेल पता", gu: "ઇમેઇલ સરનામું" },
  "checkout.send_otp": { en: "Send verification code", hi: "OTP भेजें", gu: "OTP મોકલો" },
  "checkout.verify": { en: "Verify code", hi: "कोड सत्यापित करें", gu: "કોડ ચકાસો" },
  "checkout.otp_sent": { en: "We sent a 6-digit code to", hi: "हमने 6 अंकों का कोड भेजा है", gu: "અમે 6 અંકનો કોડ મોકલ્યો છે" },
  "checkout.details": { en: "Your details", hi: "आपका विवरण", gu: "તમારી વિગતો" },
  "checkout.address": { en: "Delivery address", hi: "वितरण पता", gu: "ડિલિવરી સરનામું" },
  "checkout.payment": { en: "Payment method", hi: "भुगतान विधि", gu: "ચુકવણી પદ્ધતિ" },
  "checkout.place_order": { en: "Place order", hi: "ऑर्डर दें", gu: "ઓર્ડર આપો" },

  "common.loading": { en: "Loading...", hi: "लोड हो रहा है...", gu: "લોડ થઈ રહ્યું છે..." },
} as const;

export type DictKey = keyof typeof dict;
