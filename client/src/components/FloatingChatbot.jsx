import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faTimes, 
  faPaperPlane, 
  faSpinner,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

// Pre-trained FAQs and responses
const faqs = {
  general: [
    {
      question: "What is DSAlytic?",
      answer: "DSAlytic is an AI-powered platform designed to help you master Data Structures and Algorithms. It provides personalized learning paths, progress tracking, and mock interviews to enhance your coding skills."
    },
    {
      question: "How do I get started?",
      answer: "You can get started by signing up for a free account. Once registered, you'll have access to our problem sets, learning paths, and AI-powered features to begin your DSA journey."
    },
    {
      question: "Is DSAlytic free to use?",
      answer: "DSAlytic offers both free and premium features. The basic features are free, while advanced features like detailed analytics and unlimited mock interviews are available in our premium plans."
    }
  ],
  technical: [
    {
      question: "What programming languages are supported?",
      answer: "Currently, we support Java, Python, and C++. We're continuously working to add support for more programming languages."
    },
    {
      question: "How does the AI interview feature work?",
      answer: "Our AI interview feature simulates real technical interviews. It asks relevant DSA questions, evaluates your responses, and provides detailed feedback to help you improve."
    },
    {
      question: "What topics are covered in the problem sets?",
      answer: "We cover a wide range of topics including Data Structures (Arrays, Linked Lists, Trees, Graphs), Algorithms (Sorting, Searching, Dynamic Programming), and specific domains like DBMS, Computer Networks, and Operating Systems."
    }
  ],
  learning: [
    {
      question: "How does the personalized learning path work?",
      answer: "Our AI analyzes your performance, identifies your strengths and weaknesses, and creates a customized learning path. It adapts to your progress and suggests problems that will help you improve in specific areas."
    },
    {
      question: "Can I track my progress?",
      answer: "Yes! DSAlytic provides detailed analytics and progress tracking. You can view your solved problems, success rate, and areas that need improvement through our intuitive dashboard."
    },
    {
      question: "How can I prepare for technical interviews?",
      answer: "You can use our mock interview feature, practice with our curated problem sets, and review common interview questions. Our AI will provide feedback and suggestions for improvement."
    }
  ]
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI typing
  const simulateTyping = (response) => {
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < response.length) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = response.substring(0, index + 1);
          return newMessages;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
  };

  // Find best matching FAQ
  const findBestMatch = (query) => {
    const allFaqs = [...faqs.general, ...faqs.technical, ...faqs.learning];
    const normalizedQuery = query.toLowerCase();
    
    // First try exact matches
    const exactMatch = allFaqs.find(faq => 
      faq.question.toLowerCase() === normalizedQuery
    );
    if (exactMatch) return exactMatch.answer;

    // Then try partial matches
    const partialMatch = allFaqs.find(faq => 
      faq.question.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(faq.question.toLowerCase())
    );
    if (partialMatch) return partialMatch.answer;

    // If no match found, return a default response
    return "I'm not sure about that. Could you please rephrase your question or ask something else? I can help you with information about DSAlytic, technical topics, or learning resources.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Add AI message placeholder
    setMessages(prev => [...prev, {
      type: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString()
    }]);

    // Simulate AI response
    const response = findBestMatch(inputMessage);
    simulateTyping(response);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mb-4 transform transition-all duration-300 ease-in-out"
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-700 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faRobot} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                <p className="mb-2">How can I help you today?</p>
                <p className="text-sm">Try asking about:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• What is DSAlytic?</li>
                  <li>• How do I get started?</li>
                  <li>• What topics are covered?</li>
                  <li>• How does the AI interview work?</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
        aria-label="Toggle AI Chat"
      >
        <FontAwesomeIcon 
          icon={isOpen ? faTimes : faRobot} 
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default FloatingChatbot; 