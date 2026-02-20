import React from 'react';
import Layout from '../components/Layout';
import { CheckCircle } from 'lucide-react';

const ThankYou: React.FC = () => {
  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-[#37B06D] animate-bounce-slow">
          <CheckCircle size={48} />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Thank You</h2>
        
        <div className="max-w-md space-y-4 text-gray-600">
          <p className="text-lg">
            Your information has been submitted.
          </p>
          <div className="h-px bg-gray-200 w-1/2 mx-auto my-6"></div>
          <p>
            If you have just checked in, please wait to be called by a member of the Management Team.
          </p>
          <p>
            If you have completed the assessment, our Leadership Team will review your responses and contact you regarding next steps.
          </p>
          <p className="text-sm text-gray-400 mt-8">Thank you for your time and professionalism.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;