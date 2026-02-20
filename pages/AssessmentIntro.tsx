import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/UI';
import { getCandidateById } from '../services/storageService';
import { Briefcase, ArrowRight } from 'lucide-react';

const AssessmentIntro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getCandidateById(id)
      .then((c) => {
        if (c && (c.status === 'assessment_complete' || c.assessment)) {
          setAlreadyCompleted(true);
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (alreadyCompleted) {
    return (
      <Layout>
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">You&apos;ve already completed the assessment</h2>
            <p className="text-gray-600">Thank you. Our Leadership Team will review your responses and contact you regarding next steps.</p>
            <Button fullWidth onClick={() => navigate('/thank-you')}>Go to thank you page</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-[#005EB8]">
          <Briefcase size={36} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Overview Session<br/>Invitation</h2>

        <div className="max-w-sm space-y-4 text-gray-600 mb-8">
          <p>You&apos;ve been invited to attend the Career Overview Session with our CEO.</p>
          <p>Please complete the assessment below while you wait.</p>
        </div>

        <Button
          onClick={() => navigate(`/assessment/${id}`)}
          className="w-full max-w-sm"
        >
          Begin Leadership & Career Assessment <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </Layout>
  );
};

export default AssessmentIntro;
