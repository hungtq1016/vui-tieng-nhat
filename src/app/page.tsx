/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import data from '@/db/verbs.json';
import en from '@/db/en.json';
import types from '@/db/types.json'

import { useState } from 'react';
import { conjugateVerb } from './logic';
import { TType, WordData, WordDictionary } from './type';
// Type assertion for TypeScript
const jsonData = data as unknown as WordDictionary;
const meaning = en as any; // Specify a more precise type if possible
const formTypes = types as TType[]
// Filter for verbs
const verbs: WordData[] = Object.values(jsonData);

export default function Home() {
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [verbType, setVerbType] = useState<string>('all');
  const [jlptLevel, setJlptLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedForms((prevForms) => 
      checked ? [...prevForms, value] : prevForms.filter((form) => form !== value)
    );
  };

  const handleVerbTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVerbType(event.target.value);
  };

  const handleJlptLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJlptLevel(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVerbs = verbs.filter((verb) => {
    const matchesType = verbType === 'all' || verb.type.includes(verbType);
    const matchesJlpt = jlptLevel === 'all' || verb.jlpt.toString() === jlptLevel;
    const matchesSearch = Object.values(verb).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesType && matchesJlpt && matchesSearch;
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Verb Conjugator</h1>

      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
      />

      <div className="mb-4">
        <label className="block mb-2">Chọn loại động từ:</label>
        <select
          value={verbType}
          onChange={handleVerbTypeChange}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="all">Tất cả</option>
          <option value="Ichidan verb">Động từ Ichidan</option>
          <option value="Godan verb">Động từ Godan</option>
          <option value="Suru verb">Động từ Suru</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Chọn cấp độ JLPT:</label>
        <select
          value={jlptLevel}
          onChange={handleJlptLevelChange}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="all">Tất cả</option>
          <option value="5">N5</option>
          <option value="4">N4</option>
          <option value="3">N3</option>
          <option value="2">N2</option>
          <option value="1">N1</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Chọn các dạng chia:</label>
        {formTypes.map((formType) => (
          <div key={formType.value}>
            <label>
              <input
                type="checkbox"
                value={formType.value}
                checked={selectedForms.includes(formType.value)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {meaning.forms[formType.value]}
            </label>
          </div>
        ))}
      </div>

      <ul>
        {filteredVerbs.map((verb) => {
          const conjugated:any = conjugateVerb(verb.word, verb.group);

          return (
            <li key={verb.index} className="border-b border-gray-300 py-2">
              <p className="font-semibold">{verb.word} ({verb.kana})</p>
              <p>{meaning.verbs[verb.romaji]}</p>
              <ul className="pl-4">
                {selectedForms.map((form) => (
                  <li key={form}>
                    {meaning.forms[formTypes.find(f => f.value === form)?.value??"notfinding"]}: {conjugated[form]}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
