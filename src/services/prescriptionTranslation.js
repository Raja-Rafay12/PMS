/**
 * Professional Bilingual (English + Urdu) translation utilities for medical prescriptions & doctor instructions
 */

export const urduDigits = (num) => {
  if (num === null || num === undefined) return '';
  const str = String(num);
  const urduNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => urduNums[d]);
};

export const translateDoseType = (doseType) => {
  if (!doseType) return '';
  const dt = doseType.trim().toLowerCase();
  if (dt.includes('tablet') || dt === 'tab') return 'گولی';
  if (dt.includes('capsule') || dt === 'cap') return 'کیپسول';
  if (dt.includes('syrup') || dt === 'syp') return 'شربت';
  if (dt.includes('injection') || dt === 'inj') return 'انجکشن';
  if (dt.includes('drop')) return 'قطرے';
  if (dt.includes('cream')) return 'مرہم / کریم';
  if (dt.includes('ointment')) return 'مرہم';
  if (dt.includes('inhaler')) return 'انہیلر';
  if (dt.includes('sachet')) return 'ساشے';
  if (dt.includes('solution')) return 'محلول';
  return 'دوا';
};

export const translateFrequency = (frequency) => {
  if (!frequency) return '';
  const f = frequency.trim().toLowerCase();
  if (f.includes('twice daily') || f.includes('bd') || f.includes('bid') || f.includes('2 times')) {
    return 'دن میں دو بار (صبح اور شام)';
  }
  if (f.includes('3 times daily') || f.includes('tds') || f.includes('tid') || f.includes('thrice')) {
    return 'دن میں تین بار (صبح، دوپہر، شام)';
  }
  if (f.includes('4 times daily') || f.includes('qid') || f.includes('4 times')) {
    return 'دن میں چار بار (ہر ۶ گھنٹے بعد)';
  }
  if (f.includes('once daily') || f.includes('od') || f.includes('qd') || f.includes('1 time')) {
    return 'روزانہ ایک بار (ایک وقت)';
  }
  if (f.includes('every 6 hours')) return 'ہر ۶ گھنٹے بعد';
  if (f.includes('every 8 hours')) return 'ہر ۸ گھنٹے بعد';
  if (f.includes('every 12 hours')) return 'ہر ۱۲ گھنٹے بعد';
  if (f.includes('bedtime') || f.includes('hs') || f.includes('at night')) {
    return 'رات کو سوتے وقت';
  }
  if (f.includes('as needed') || f.includes('prn') || f.includes('sos')) {
    return 'بوقتِ ضرورت (تکلیف یا درد پر)';
  }
  if (f.includes('morning')) return 'صبح کے وقت';
  if (f.includes('evening')) return 'شام کے وقت';
  return 'ڈاکٹر کے بتائے گئے اوقات پر';
};

export const translateRoute = (route) => {
  if (!route) return '';
  const r = route.trim().toLowerCase();
  if (r.includes('oral')) return 'منہ کے ذریعے لیں';
  if (r.includes('topical')) return 'متاثرہ جگہ پر لگائیں';
  if (r.includes('inhal')) return 'سانس کے ذریعے کھینچیں';
  if (r.includes('iv') || r.includes('intravenous')) return 'ڈرپ یا رگ میں لگائیں';
  if (r.includes('im') || r.includes('intramuscular')) return 'گوشت کا انجکشن';
  if (r.includes('sublingual')) return 'زبان کے نیچے رکھیں';
  if (r.includes('eye') || r.includes('ear') || r.includes('drop')) return 'آنکھ یا کان میں ٹپکائیں';
  if (r.includes('rectal')) return 'مقعد کے ذریعے';
  return 'بتائے گئے طریقے سے';
};

export const translateDuration = (days) => {
  if (!days) return '';
  const n = parseInt(days, 10);
  if (isNaN(n)) return `${days} دن`;
  const ud = urduDigits(n);
  if (n === 7) return `${ud} دن (ایک ہفتہ)`;
  if (n === 14) return `${ud} دن (دو ہفتے)`;
  if (n === 30) return `${ud} دن (ایک ماہ)`;
  return `${ud} دن تک`;
};

export const translateInstructionText = (comment) => {
  if (!comment) return '';
  const c = comment.trim().toLowerCase();

  if (c.includes('after breakfast and dinner with a glass of water') || 
      (c.includes('breakfast') && c.includes('dinner') && c.includes('water'))) {
    return 'ناشتہ اور رات کھانے کے بعد پانی کے ساتھ لیں';
  }
  if (c.includes('after meals, shake well before use') || (c.includes('shake well') && c.includes('meals'))) {
    return 'کھانے کے بعد لیں، شیشی اچھی طرح ہلا کر استعمال کریں';
  }
  if (c.includes('take with warm water after meals') || (c.includes('warm water') && c.includes('meals'))) {
    return 'کھانے کے بعد نیم گرم پانی کے ساتھ لیں';
  }
  if (c.includes('30 mins before breakfast') || c.includes('before breakfast')) {
    return 'ناشتہ سے ۳۰ منٹ پہلے (نہار منہ) لیں';
  }
  if (c.includes('when pain is severe') || c.includes('for pain')) {
    return 'شدید درد یا بخار کی صورت میں لیں';
  }
  if (c.includes('complete full course')) {
    return 'دوا کا کورس بتائے گئے دنوں تک مکمل کریں';
  }
  if (c.includes('shake well before use') || c.includes('shake well')) {
    return 'استعمال سے پہلے شیشی اچھی طرح ہلائیں';
  }
  if (c.includes('take with warm water') || c.includes('warm water')) {
    return 'نیم گرم پانی کے ساتھ استعمال کریں';
  }
  if (c.includes('after meals') || c.includes('after food')) {
    return 'کھانا کھانے کے بعد لیں';
  }
  if (c.includes('before meals') || c.includes('before food') || c.includes('empty stomach')) {
    return 'کھانے سے پہلے (نہار منہ) لیں';
  }
  if (c.includes('at bedtime') || c.includes('before sleep')) {
    return 'رات کو سوتے وقت لیں';
  }
  if (c.includes('with milk')) {
    return 'دودھ کے ساتھ استعمال کریں';
  }
  if (c.includes('do not chew')) {
    return 'چبائے بغیر پانی سے نگل لیں';
  }

  return 'ہدایت کے مطابق استعمال کریں';
};

/**
 * Translates doctor's advice & follow-up instructions into clear, professional Urdu
 */
export const translateDoctorAdvice = (adviceText) => {
  if (!adviceText) return [];

  // Split lines
  const lines = adviceText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const translatedLines = lines.map((line) => {
    // Remove leading numbers like "1.", "1 -", etc.
    const cleanLine = line.replace(/^\d+[\.\-\)]\s*/, '').trim();
    const l = cleanLine.toLowerCase();

    let urdu = '';

    if (l.includes('steam inhalation') && l.includes('twice daily')) {
      urdu = 'روزانہ دو مرتبہ ۱۰ منٹ کے لیے بھاپ لیں (Steam Inhalation)۔';
    } else if (l.includes('steam inhalation')) {
      urdu = 'روزانہ نیم گرم پانی کی بھاپ لیں (Steam Inhalation)۔';
    } else if (l.includes('avoid chilled beverages') || (l.includes('chilled') && l.includes('cold'))) {
      urdu = 'ٹھنڈے مشروبات، تیز ٹھنڈی ہوا اور دھوئیں / گردوغبار سے مکمل پرہیز کریں۔';
    } else if (l.includes('warm hydration') || (l.includes('lukewarm') && l.includes('soups'))) {
      urdu = 'نیم گرم پانی، گرم سوپ اور یخنی کا کثرت سے استعمال کریں۔';
    } else if (l.includes('follow-up') && l.includes('5 days')) {
      urdu = 'افاقہ نہ ہونے یا علامات برقرار رہنے کی صورت میں ۵ دن بعد دوبارہ چیک اپ کروائیں۔';
    } else if (l.includes('follow-up') || l.includes('review after')) {
      urdu = 'ڈاکٹر کے بتائے ہوئے وقت کے بعد معائنے کے لیے دوبارہ تشریف لائیں۔';
    } else if (l.includes('salt restriction') || l.includes('low salt')) {
      urdu = 'کھانے میں نمک کا استعمال سخت طور پر محدود کریں (نمک کم کھائیں)۔';
    } else if (l.includes('walking') || l.includes('exercise')) {
      urdu = 'روزانہ کم از کم ۳۰ منٹ تیز چہل قدمی یا ورزش کا معمول بنائیں۔';
    } else if (l.includes('rest') && l.includes('fluids')) {
      urdu = 'بھرپور آرام کریں اور پانی و تازہ مائعات کا زیادہ استعمال کریں۔';
    } else if (l.includes('blood pressure') || l.includes('sugar log')) {
      urdu = 'روزانہ صبح اور شام بلڈ پریشر / شوگر چیک کر کے ڈائری پر نوٹ کریں۔';
    } else if (l.includes('diet') || l.includes('fatty food')) {
      urdu = 'تلی ہوئی اور چکنائی والی غذاؤں سے پرہیز کریں۔';
    } else {
      // Fallback
      urdu = cleanLine;
    }

    return urdu;
  });

  return translatedLines;
};
