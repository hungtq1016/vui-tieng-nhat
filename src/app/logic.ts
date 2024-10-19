/* eslint-disable @typescript-eslint/no-explicit-any */
import data from '@/db/rule.json';
const conjugationRules: any = data as unknown;

export function conjugateVerb(verb: string, group: number) {
    // Xử lý động từ đặc biệt
    if (verb === '来る') {
        return createConjugationResult(verb, '', conjugationRules.Kuru);
    } else if (verb === '行く') {
        return createConjugationResult(verb, '行', conjugationRules.Iku);
    }else if (verb === '有る') {
        return createConjugationResult(verb, '', conjugationRules.Aru);
    }
    const stem = verb.slice(0, group === 3 ? -2 : -1);
    const forms = group === 1 ? conjugationRules.Godan : group === 2 ? conjugationRules.Ichidan : conjugationRules.Suru;

    if (group === 1) {
        for (const ending in forms) {
            if (verb.endsWith(ending)) {
                return createConjugationResult(verb, stem, forms[ending]);
            }
        }
    } else if (group === 2 || group === 3) {
        return createConjugationResult(verb, stem, forms);
    }

    // Default return for unsupported verb types
    return createConjugationResult(verb, verb, Array(11).fill(verb));
}

function createConjugationResult(verb: string, stem: string, forms: string[]) {
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
        ro: forms[9] ? stem + forms[9] : '',
        runa: forms[10] ? stem + forms[10] : '',
    };
}
