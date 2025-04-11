'use client';

import { useState } from 'react';
import axios from 'axios';

type Flashcard = {
  question: string;
  answer: string;
};

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  const generateNotes = async () => {
    if (!inputText.trim()) return;
    setLoadingNotes(true);
    try {
      const res = await axios.get('/api/user/Notes', {
        params: { text: inputText },
      });
      setSummary(res.data?.message || 'No summary generated.');
      setFlashcards([]);
    } catch (error) {
      console.error(error);
      setSummary('Error generating summary.');
    } finally {
      setLoadingNotes(false);
    }
  };

  const generateFlashcards = async () => {
    if (!summary.trim()) return;
    setLoadingFlashcards(true);
    try {
      const res = await axios.get('/api/user/flashcards', {
        params: { summary },
      });

      const raw = res.data?.message || '';
      const parsed: Flashcard[] = raw
        .split('Flashcard')
        .filter((line: string) => line.includes('Q:') && line.includes('A:'))
        .map((card: string) => {
          const qMatch = card.match(/Q:\s*(.+?)\n/);
          const aMatch = card.match(/A:\s*(.+)/);
          return {
            question: qMatch?.[1]?.trim() || 'Unknown question',
            answer: aMatch?.[1]?.trim() || 'Unknown answer',
          };
        });

      setFlashcards(parsed);
    } catch (error) {
      console.error(error);
      setFlashcards([]);
    } finally {
      setLoadingFlashcards(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-green-100 p-4">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border-4 border-dashed border-orange-300 text-center">
        <div className="mb-6 flex flex-col items-center">
          <img
            src="https://images.hindustantimes.com/tech/img/2021/10/22/960x540/f7569ca6-32a3-11ec-a581-90b85644888b_1634879649792_1634879664519.jpg"
            alt="Modi Ji"
            className="w-32 h-32 object-cover rounded-full border-4 border-orange-400 shadow-lg"
          />
          <h1 className="text-4xl font-extrabold text-orange-700 mt-4">ModiBot 🤖</h1>
          <p className="italic text-lg text-gray-700 mt-2">
            "Main Narendra Modi, aapka digital saathi."
          </p>
        </div>

        <textarea
          spellCheck={false}
          className="w-full h-52 bg-white/95 p-6 border-2 border-orange-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition mb-6 text-gray-800 placeholder:text-orange-500 text-lg shadow-md"
          placeholder="Desh ke hit mein sawaal pesh kijiye..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={generateNotes}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all mb-8 shadow-md"
          disabled={loadingNotes}
        >
          {loadingNotes ? 'Rashtra ke liye soch raha hoon...' : 'Prashna Poochhiye'}
        </button>

        <div className="mb-10 text-left">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">📝 Uttar:</h2>
          <div className="bg-white p-5 rounded-xl border border-orange-200 whitespace-pre-wrap text-gray-800 shadow-md min-h-[120px]">
            {summary || 'Abhi tak koi uttar nahi mila hai...'}
          </div>
        </div>

        {summary && (
          <button
            onClick={generateFlashcards}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition mb-10 shadow-md"
            disabled={loadingFlashcards}
          >
            {loadingFlashcards ? 'Sankalan tayar ho raha hai...' : 'Flashcards Prastut Kijiye'}
          </button>
        )}

        {flashcards.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">
              🃏 Flashcards:
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white via-orange-50 to-green-50 border border-orange-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition"
                >
                  <p className="font-bold text-orange-700 mb-2">Q: {card.question}</p>
                  <p className="text-gray-800">A: {card.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center italic mt-12 text-green-700 text-md">
          "Yuvaon ko nayi soch dena, naye vikalp dikhana... yahi hamara mission hai." – Narendra Modi
        </p>
      </div>
    </main>
  );
}
