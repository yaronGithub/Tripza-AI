import React, { useState } from 'react';
import { MessageSquare, Mic, Send, Sparkles, Globe, VolumeX, Volume2, Copy, Loader2 } from 'lucide-react';

interface AILanguageAssistantProps {
  destination: string;
  className?: string;
}

export function AILanguageAssistant({ destination, className = '' }: AILanguageAssistantProps) {
  const [phrase, setPhrase] = useState('');
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Determine local language based on destination
  const getLocalLanguage = (destination: string): string => {
    const languageMap: Record<string, string> = {
      'paris': 'French',
      'tokyo': 'Japanese',
      'rome': 'Italian',
      'barcelona': 'Spanish',
      'berlin': 'German',
      'amsterdam': 'Dutch',
      'beijing': 'Chinese',
      'seoul': 'Korean',
      'moscow': 'Russian',
      'cairo': 'Arabic',
      'athens': 'Greek',
      'istanbul': 'Turkish',
      'bangkok': 'Thai',
      'vienna': 'German',
      'prague': 'Czech',
      'budapest': 'Hungarian',
      'warsaw': 'Polish',
      'lisbon': 'Portuguese',
      'stockholm': 'Swedish',
      'oslo': 'Norwegian',
      'helsinki': 'Finnish',
      'copenhagen': 'Danish',
      'dublin': 'Irish',
      'mexico city': 'Spanish',
      'rio de janeiro': 'Portuguese',
      'buenos aires': 'Spanish',
      'lima': 'Spanish',
      'santiago': 'Spanish',
      'bogota': 'Spanish',
      'havana': 'Spanish'
    };
    
    const destinationLower = destination.toLowerCase();
    
    for (const [city, language] of Object.entries(languageMap)) {
      if (destinationLower.includes(city)) {
        return language;
      }
    }
    
    return 'Local language';
  };

  const localLanguage = getLocalLanguage(destination);

  // Common travel phrases
  const commonPhrases = [
    'Hello',
    'Thank you',
    'Where is the bathroom?',
    'How much does this cost?',
    'I need help',
    'Where is the train station?'
  ];

  const translatePhrase = async (text: string = phrase) => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call an AI translation API
      // For demo purposes, we'll simulate translations
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const translationMap: Record<string, Record<string, string>> = {
        'French': {
          'Hello': 'Bonjour',
          'Thank you': 'Merci',
          'Where is the bathroom?': 'Où sont les toilettes?',
          'How much does this cost?': 'Combien ça coûte?',
          'I need help': "J'ai besoin d'aide",
          'Where is the train station?': 'Où est la gare?'
        },
        'Japanese': {
          'Hello': 'こんにちは (Konnichiwa)',
          'Thank you': 'ありがとう (Arigatou)',
          'Where is the bathroom?': 'お手洗いはどこですか? (Otearai wa doko desu ka?)',
          'How much does this cost?': 'これはいくらですか? (Kore wa ikura desu ka?)',
          'I need help': '助けてください (Tasukete kudasai)',
          'Where is the train station?': '駅はどこですか? (Eki wa doko desu ka?)'
        },
        'Spanish': {
          'Hello': 'Hola',
          'Thank you': 'Gracias',
          'Where is the bathroom?': '¿Dónde está el baño?',
          'How much does this cost?': '¿Cuánto cuesta esto?',
          'I need help': 'Necesito ayuda',
          'Where is the train station?': '¿Dónde está la estación de tren?'
        },
        'Italian': {
          'Hello': 'Ciao',
          'Thank you': 'Grazie',
          'Where is the bathroom?': 'Dov\'è il bagno?',
          'How much does this cost?': 'Quanto costa questo?',
          'I need help': 'Ho bisogno di aiuto',
          'Where is the train station?': 'Dov\'è la stazione ferroviaria?'
        },
        'German': {
          'Hello': 'Hallo',
          'Thank you': 'Danke',
          'Where is the bathroom?': 'Wo ist die Toilette?',
          'How much does this cost?': 'Wie viel kostet das?',
          'I need help': 'Ich brauche Hilfe',
          'Where is the train station?': 'Wo ist der Bahnhof?'
        }
      };
      
      // Get translation if available, or generate a placeholder
      let translation = '';
      if (translationMap[localLanguage]?.[text]) {
        translation = translationMap[localLanguage][text];
      } else {
        // Generate a fake translation for demo purposes
        translation = `[${localLanguage} translation would appear here]`;
      }
      
      // Add to translations list
      const newTranslation = {
        original: text,
        translated: translation,
        language: localLanguage,
        timestamp: new Date().toISOString()
      };
      
      setTranslations([newTranslation, ...translations]);
      setPhrase('');
    } catch (error) {
      console.error('Error translating phrase:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakPhrase = (text: string) => {
    if (!window.speechSynthesis) return;
    
    setSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const languageCodeMap: Record<string, string> = {
      'French': 'fr',
      'Japanese': 'ja',
      'Spanish': 'es',
      'Italian': 'it',
      'German': 'de'
    };
    
    const languageCode = languageCodeMap[localLanguage];
    if (languageCode) {
      const voice = voices.find(v => v.lang.startsWith(languageCode));
      if (voice) utterance.voice = voice;
    }
    
    utterance.onend = () => {
      setSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Language Assistant</h3>
            <p className="text-indigo-100 text-sm">Translate to {localLanguage} for {destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            translatePhrase();
          }}
          className="mb-6"
        >
          <div className="flex">
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Enter a phrase to translate..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !phrase.trim()}
              className="px-4 py-3 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {/* Common Phrases */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Common Travel Phrases</h4>
          <div className="flex flex-wrap gap-2">
            {commonPhrases.map((p) => (
              <button
                key={p}
                onClick={() => translatePhrase(p)}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Translations */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Translations</h4>
          
          {translations.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {translations.map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-indigo-600 font-medium">English → {item.language}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(item.translated)}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => speakPhrase(item.translated)}
                        disabled={speaking}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                      >
                        {speaking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-1">{item.original}</p>
                  <p className="text-indigo-700 font-medium">{item.translated}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600 mb-2">No translations yet</p>
              <p className="text-sm text-gray-500">Try translating a common phrase</p>
            </div>
          )}
        </div>

        {/* AI Features */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-800">AI Powered</span>
            </div>
            <p className="text-xs text-indigo-700">Accurate translations with cultural context</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-1">
              <Volume2 className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Pronunciation</span>
            </div>
            <p className="text-xs text-blue-700">Hear correct native pronunciation</p>
          </div>
        </div>
      </div>
    </div>
  );
}