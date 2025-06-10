import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict', { text });
      setResult(response.data);
    } catch (error) {
      setResult({ sentiment: 'Error', score: 'N/A' });
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return <Smile className="inline-block w-6 h-6 text-green-500" />;
      case 'negative': return <Frown className="inline-block w-6 h-6 text-red-500" />;
      case 'neutral': return <Meh className="inline-block w-6 h-6 text-yellow-500" />;
      default: return <Meh className="inline-block w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-4">
      <motion.div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">🎯 Sentiment Analyzer</h1>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="5" placeholder="Type something like: 'I'm feeling amazing today!'"
          value={text} onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="w-full bg-purple-600 text-white rounded-md p-3 text-lg font-semibold hover:bg-purple-700 transition"
          onClick={analyzeSentiment} disabled={loading}
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Sentiment'}
        </button>
        {result && (
          <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p className="text-xl font-medium">Sentiment: <span className="text-purple-700">{result.sentiment}</span> {getEmoji(result.sentiment)}</p>
            <p className="text-sm text-gray-600 mt-1">Confidence: {result.score}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
