import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/UI';
import { ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in safe-area-bottom">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4 px-2">
              <img
                src="/header.png"
                alt="Globe Life AIL Division - Paz Organization"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#005EB8]">Welcome</h2>
            <p className="text-lg sm:text-xl font-medium text-gray-700">Paz Organization</p>
            <div className="w-16 h-1 bg-[#37B06D] mx-auto rounded-full"></div>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed px-1">
              Globe Life AIL Division<br />
              Please complete the form as directed by the Management Team.
            </p>
          </div>

          <div className="pt-6 sm:pt-8 space-y-4">
            <Button
              fullWidth
              onClick={() => navigate('/interview')}
              className="text-base sm:text-lg py-4 min-h-[48px] shadow-xl touch-manipulation"
            >
              Start Applicant Questionnaire <ArrowRight className="ml-2 shrink-0" size={20} />
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => navigate('/check-status')}
              className="text-base sm:text-lg py-4 min-h-[48px] touch-manipulation"
            >
              Check Application Status
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Landing;