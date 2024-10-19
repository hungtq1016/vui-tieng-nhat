/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import dataForm from '@/db/forms.json';
import { jlptLevels } from './data';

interface Verb {
  romaji: string;
  value: string;
  form: string;
}

interface FormType {
  name: string;
  romaji: string;
  jlpt: number
}

const forms: Record<string, FormType[]> = dataForm;

const SentenceElementView = ({ verb, currentForm }: { verb: Verb; currentForm: string }) => {
  const transVerbs = useTranslations('Verbs');
  const transForms = useTranslations('Forms');

  const verbData = transVerbs(verb.romaji);
  const data = verbData.split(';');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [delay, setDelay] = useState(2000);
  const [hovering, setHovering] = useState(false); // State to track hover

  const getRandomDelay = () => Math.floor(Math.random() * (3500 - 1500 + 1)) + 1500;

  useEffect(() => {
    if (data.length < 2 || hovering) return; // Stop if hovering

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
        setFade(true);
        setDelay(getRandomDelay());
      }, 500);
    }, delay);

    return () => clearInterval(interval);
  }, [data.length, delay, hovering]);

  const text = transForms(`${verb.form}.${currentForm}`, {
    v: `<span style="color:red">${data[currentIndex]}</span>`,
  });
  const sentences = text.split(';');

  return sentences.map((sentence, index) => (
    <div
      key={index}
      className={`text-sm transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
      dangerouslySetInnerHTML={{ __html: sentence }}
      onMouseEnter={() => setHovering(true)}  // Pause fade on hover
      onMouseLeave={() => setHovering(false)} // Resume fade on mouse leave
    />
  ));
};

const SentencesView = ({ verb }: { verb: Verb }) => {
  const formType = forms[verb.form];
  console.log(verb)
  if (!formType) return null;

  return (
    <>
      {formType.map((form) => (
        <div key={form.name} className={`p-2 rounded ${jlptLevels[form.jlpt].className  }`}>
          <div className="font-medium">
            <span className="font-semibold text-gray-800">{verb.value}</span>{form.name}
          </div>
          <SentenceElementView currentForm={form.romaji} verb={verb} />
        </div>
      ))}
    </>
  );
};

export default SentencesView;
