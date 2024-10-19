/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import data from '@/db/verbs.json';
import { useTranslations } from 'next-intl';

import { useState } from 'react';
import { conjugateVerb } from './logic';
import { TType, WordData, WordDictionary } from './type';
import { groups, jlptLevels, types } from './data';
// Type assertion for TypeScript
const jsonData = data as unknown as WordDictionary;
const formTypes = types as TType[]
// Filter for verbs
const verbs: WordData[] = Object.values(jsonData);

export default function Home() {
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [verbType, setVerbType] = useState<number>(0);
  const [jlptLevel, setJlptLevel] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const transVerbs = useTranslations('Verbs');
  const transHome = useTranslations('HomePage');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedForms((prevForms) =>
      checked ? [...prevForms, value] : prevForms.filter((form) => form !== value)
    );
  };

  const handleVerbTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVerbType(Number(event.target.value));
  };

  const handleJlptLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJlptLevel(Number(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVerbs = verbs.filter((verb) => {
    const matchesType = verbType === 0 || verb.group === verbType;
    const matchesJlpt = jlptLevel === 0 || verb.jlpt === jlptLevel;
    const matchesSearch = Object.values(verb).some((value) =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesType && matchesJlpt && matchesSearch;
  });

  return (
    <div className=''>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className='pt-10 px-10 bg-white'>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          />

          <div className="mb-4">
            <label className="block mb-2">{transHome("verbtypes.label")}</label>
            <select
              value={verbType}
              onChange={handleVerbTypeChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              {groups.map(group => (<option key={group.value} value={group.value}>{transHome(`verbtypes.${group.value}`)}</option>))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">{transHome("jlpt.label")}</label>
            <select
              value={jlptLevel}
              onChange={handleJlptLevelChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              {jlptLevels.map(jlpt => (<option key={jlpt.value} value={jlpt.value}>{transHome(`jlpt.${jlpt.value}`)}</option>))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">{transHome("forms.label")}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {formTypes.map((formType) => (
                <div key={formType.value}>
                  <input
                    type="checkbox"
                    id={formType.value}
                    value={formType.value}
                    checked={selectedForms.includes(formType.value)}
                    onChange={handleCheckboxChange}
                    name="bordered-checkbox"
                    className="hidden peer"
                  />
                  <label htmlFor={formType.value}
                    className="inline-flex items-center justify-between w-full p-5  bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="block">
                      <div className="w-full text-sm">
                        <span>{transHome(`forms.${formType.value}`)}</span>
                      </div>
                      <div>
                        <span className='font-semibold'>{formType.kanji}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-y-scroll h-screen py-5">
          <div className='mx-10 md:ml-0'>
            <h1 className="text-3xl font-bold mb-4 bg-white rounded">
              <p className='px-5 py-3'>{transHome("heading.page")}</p>
            </h1>
              <div className='flex gap-2 bg-red-100 text-red-600 p-2 rounded mb-4'>
                <div className='font-bold'>{transHome("warning.label")}</div>
                <div>{transHome("warning.content")}</div>
              </div>
            <div className='flex flex-col gap-4'>
              {filteredVerbs.map((verb) => {
                const conjugated: any = conjugateVerb(verb.word, verb.group);

                return (
                  <div key={verb.index} className="bg-white p-2 rounded">
                    <div className="grid grid-cols-6 divide-x-2">
                      <p className="font-semibold">{verb.word}</p>
                      <p className="font-light pl-2">{verb.kana}</p>
                      <p className="font-light pl-2">{verb.romaji}</p>
                      <p className='pl-2 col-span-3'>{transVerbs(verb.romaji)}</p>
                    </div>

                    {
                      selectedForms.length > 0 && <ul className="mt-2">
                      {selectedForms.map((form) => (
                        <li className='odd:bg-stone-100 py-1 px-2 even:bg-stone-50'
                          key={form}>
                          <span className='text-gray-900 font-semibold'>{transHome(`forms.${formTypes.find(f => f.value === form)?.value ?? "notfinding"}`)}</span>: 
                          <span className='text-gray-600'>
                            {conjugated[form]}
                          </span>
                        </li>
                      ))}
                    </ul>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>

  );
}
