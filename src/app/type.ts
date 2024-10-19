
export type WordData = {
    index: number;
    word: string;
    kana: string;
    romaji: string;
    type: string;
    jlpt: number;
    card: string;
    final_index: number;
    group: number;
    isTransitive: boolean;
};

export type WordDictionary = {
    [key: string]: WordData;
};

export type TType = {
    value: string
    kanji: string
}

export type TGroup = {
    value: number;
    name: string;
}