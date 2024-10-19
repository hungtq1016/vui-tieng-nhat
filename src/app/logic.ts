/* eslint-disable @typescript-eslint/no-explicit-any */
import data from '@/db/rule.json';
import { TVerb } from './type';

const conjugationRules: any = data as unknown;
const rareruExceptionVerbs = conjugationRules.RareruForm || [];

export function conjugateVerb(verbObj: TVerb) {
    const { word, group, isTransitive } = verbObj;

    // Handle special verbs
    if (word === '来る') {
        return createConjugationResult(word, '', conjugationRules.Kuru, true);
    } else if (word === '行く') {
        return createConjugationResult(word, '行', conjugationRules.Iku, false);
    } else if (word === '有る') {
        return createConjugationResult(word, '', conjugationRules.Aru, false);
    }

    const stem = word.slice(0, group === 3 ? -2 : -1);
    const forms = group === 1 ? conjugationRules.Godan : group === 2 ? conjugationRules.Ichidan : conjugationRules.Suru;

    if (group === 1) {
        for (const ending in forms) {
            if (word.endsWith(ending)) {
                return createConjugationResult(word, stem, forms[ending], isTransitive);
            }
        }
    } else if (group === 2 || group === 3) {
        return createConjugationResult(word, stem, forms, isTransitive);
    }

    // Default return for unsupported verb types
    return createConjugationResult(word, word, Array(11).fill(word), isTransitive);
}

function createConjugationResult(verb: string, stem: string, forms: string[], isTransitive: boolean) {
    
    // Nếu động từ nằm trong danh sách RareruForm, hoặc nếu động từ là tự động từ thì không chia thể rareru
    const rareruForm = (!rareruExceptionVerbs.includes(verb) && isTransitive) ? stem + forms[7] : '';
    const rareForm = (!rareruExceptionVerbs.includes(verb) && isTransitive) ? stem + forms[6] : '';

    const sentence = {
        masu: stem + forms[0], // stem + masu form
        te: stem + forms[1],   // stem + te form
        ta: stem + forms[2],   // stem + ta form
        nai: stem + forms[3],  // stem + nai form
        ba: stem + forms[4],   // stem + ba form
        you: forms[5] ? stem + forms[5] : '', // stem + you form
        rare: rareForm, // stem + rare form
        rareru: rareruForm, // tùy thuộc vào điều kiện
        saseru: forms[8] ? stem + forms[8] : '', // stem + saseru form
        ro: forms[9] ? stem + forms[9] : '', // stem + ro form
        runa: forms[10] ? stem + forms[10] : '', // stem + runa form
    }

    return {
        show: {
            ru: verb,
            masu: sentence.masu+"ます",
            te: sentence.te,
            ta: sentence.ta,
            nai: sentence.nai+"い",
            ba: sentence.ba,
            you: sentence.you,
            rare: sentence.rare,
            rareru: sentence.rareru,
            saseru: sentence.saseru,
            ro: sentence.ro,
            runa: sentence.runa,
        },
        sentence,
    };
}