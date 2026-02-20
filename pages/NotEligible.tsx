import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertCircle } from 'lucide-react';

const NotEligible: React.FC = () => {
  const location = useLocation();
  const reason = (location.state as { reason?: string } | null)?.reason ?? 'You do not currently meet the requirements for this role.';

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-lg w-full">
          <div className="bg-amber-50 border border-amber-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-amber-600">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Proceed</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your interest in Globe Life AIL Division and the Paz Organization.
          </p>
          <p className="text-gray-700 mb-6">
            Unfortunately, we are unable to move forward with your application at this time.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Reason (per our legal and role requirements):</p>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
          <p className="text-sm text-gray-500">
            Your information has been submitted and our team may reach out if requirements change. If you have questions, please contact Human Resources.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotEligible;
