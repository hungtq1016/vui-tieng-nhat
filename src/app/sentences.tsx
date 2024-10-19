/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import dataForm from '@/db/forms.json';

const forms: any = dataForm

const SentenceElementView = ({ verb, currentForm }: { verb: any, currentForm: string }) => {
  const transVerbs = useTranslations('Verbs');
  const transForms = useTranslations('Forms');

  const verbData = transVerbs(verb.romaji);
  const data = verbData.split(";");

  const [currentIndex, setCurrentIndex] = useState(0); // Theo dõi index hiện tại
  const [fade, setFade] = useState(true); // State để kiểm soát hiệu ứng fade
  const [delay, setDelay] = useState(2000); // State để lưu thời gian delay

  const getRandomDelay = () => {
    return Math.floor(Math.random() * (3500 - 1500 + 1)) + 1500; // Random từ 1500 đến 3500 ms
  };

  useEffect(() => {
    // Nếu data.length < 2, không cần hiệu ứng
    if (data.length < 2) return;

    const interval = setInterval(() => {
      // Bắt đầu hiệu ứng fade-out
      setFade(false);

      // Đợi trước khi thay đổi văn bản
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
        setFade(true);
        setDelay(getRandomDelay()); // Cập nhật delay mới sau mỗi lần chuyển đổi
      }, 500); // Thời gian tương ứng với fade-out
    }, delay); // Sử dụng delay random

    return () => clearInterval(interval);
  }, [data.length, delay]);

  // Nếu data.length < 2, hiển thị nội dung mà không cần hiệu ứng
  if (data.length < 2) {
    return (
      <div
        className='text-sm'
        dangerouslySetInnerHTML={{ __html: transForms(`${verb.form}.${currentForm}`, { v: `<span style="color:red">${data[0]}</span>` }) }}
      />
    );
  }

  return (
    <div
      className={`text-sm transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
      dangerouslySetInnerHTML={{ __html: transForms(`${verb.form}.${currentForm}`, { v: `<span style="color:red">${data[currentIndex]}</span>` }) }}
    />
  );
};

const SentencesView = ({ verb }: { verb: any }) => {

  const formType = forms[verb.form]; // Access the forms based on verb.form

  if (!formType) return null; // Return null if the form type does not exist

  return formType.map((form:any) => (
    <div key={form.name} className='bg-gray-50 p-2 rounded hover:bg-gray-100'>
      <div className='font-medium'>
        <span className='font-semibold text-gray-800'>{verb.value}</span>{form.name}
      </div>
      <SentenceElementView currentForm={form.romaji} verb={verb} />
    </div>
  ));
};

export default SentencesView
