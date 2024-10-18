import data from '@/db/rule.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const  conjugationRules: any = data as unknown

export function conjugateVerb(verb: string, group: number) {
    const stem = verb.slice(0, group == 3 ? -2 : -1);
    
    if (group == 1) {
      for (const ending in conjugationRules.Godan) {
        if (verb.endsWith(ending)) {
          const forms = conjugationRules.Godan[ending];
          return {
            ru: verb,
            masu: stem + forms[0],
            te: stem + forms[1],
            ta: stem + forms[2],
            nai: stem + forms[3],
            ba: stem + forms[4],
            you: stem + forms[5],
            rare: forms[6] ? stem + forms[6] : '',
            rareru: forms[7] ? stem + forms[7] : '',
            saseru: forms[8] ? stem + forms[8] : '',
          };
        }
      }
    } else if (group == 2) {
      const forms = conjugationRules.Ichidan;
      return {
        ru: verb,
        masu: stem + forms[0],
        te: stem + forms[1],
        ta: stem + forms[2],
        nai: stem + forms[3],
        ba: stem + forms[4],
        you: forms[5] ? stem + forms[5] : '',
        rare: forms[6] ? stem + forms[6] : '',
        rareru: forms[7] ? stem + forms[7] : '',
        saseru: forms[8] ? stem + forms[8] : '',
      };
    } else if (group == 3) {
      const forms = conjugationRules.Suru;
      return {
        ru: verb,
        masu: verb.slice(0, -2) + forms[0],
        te: verb.slice(0, -2) + forms[1],
        ta: verb.slice(0, -2) + forms[2],
        nai: verb.slice(0, -2) + forms[3],
        ba: verb.slice(0, -2) + forms[4],
        rare: verb.slice(0, -2) + forms[5],
        rareru: verb.slice(0, -2) + forms[6],
        saseru: verb.slice(0, -2) + forms[7],
      };
    }
  
    return {
      ru: verb,
      masu: verb,
      te: verb,
      ta: verb,
      nai: verb,
      ba: verb,
      you: verb,
      rare: verb,
      rareru: verb,
      saseru: verb,
    };
  }