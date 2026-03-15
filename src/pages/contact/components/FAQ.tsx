import Button from '@/components/UI/Button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [

  {
    question: 'What types of projects do you take on?',
    answer: (
      <>
        I specialize in web development projects including custom websites, web applications,
        e-commerce solutions, and API integrations. My expertise covers frontend (React, Vue)
        and backend (Node.js, Django) development. I'm particularly interested in projects
        that solve real-world problems with innovative technical solutions.
      </>
    ),
  },
  {
    question: 'What is your typical turnaround time?',
    answer: (
      <>
        <p>Project timelines vary based on complexity, but most projects follow this general timeframe:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Small websites: 2-4 weeks</li>
          <li>Web applications: 4-12 weeks</li>
          <li>Complex systems: 3-6 months</li>
        </ul>
        <p className="mt-3">
          After our initial consultation, I'll provide a detailed timeline specific to your project.
        </p>
      </>
    ),
  },
  {
    question: 'Do you work with clients remotely?',
    answer: (
      <>
        <p>Yes, I work with clients worldwide. My workflow is optimized for remote collaboration with:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Weekly video calls for progress updates</li>
          <li>Project management tools for task tracking</li>
          <li>Regular code demos and staging deployments</li>
          <li>Flexible communication via email, Slack, or your preferred channel</li>
        </ul>
        <p className="mt-3">
          I'm available in the Pacific Time Zone but can accommodate different time zones when needed.
        </p>
      </>
    ),
  },
  {
    question: 'What are your payment terms?',
    answer: (
      <>
        <p>For most projects, I require:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>30% deposit to begin work</li>
          <li>30% at project midpoint</li>
          <li>40% upon completion</li>
        </ul>
        <p className="mt-3">
          For larger projects, I offer flexible payment schedules. I accept payments via bank transfer,
          PayPal, and cryptocurrency. All payments are outlined in our contract before work begins.
        </p>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
    const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
        <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 mx-auto mt-4 rounded"></div>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Common questions about working with me
        </p>
      </div>

      <div className="space-y-6">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.question}</h3>
                <i
                  className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500 dark:text-gray-400`}
                ></i>
              </button>
              <div className={`mt-4 text-gray-600 dark:text-gray-300 ${isOpen ? '' : 'hidden'}`}>
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Have more questions? Don't hesitate to reach out!
        </p>
        <Button
          onClick={() => navigate(`/contact`)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <i className="fa-solid fa-envelope mr-2"></i> Contact Me
        </Button>
      </div>
    </div>
  );
};

export default FAQ;