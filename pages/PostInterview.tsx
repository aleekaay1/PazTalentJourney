import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Card } from '../components/UI';
import { getCandidateById, saveCandidate } from '../services/storageService';
import { Candidate } from '../types';

const PostInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [interviewCompleted, setInterviewCompleted] = useState<boolean | null>(null);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [ceoInvite, setCeoInvite] = useState<'yes' | 'no' | 'declined' | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        try {
          const c = await getCandidateById(id);
          if (c) setCandidate(c);
          else navigate('/');
        } catch (err) {
          console.error(err);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchCandidate();
    }
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!candidate || interviewCompleted === null || consent === null || ceoInvite === null) return;

    const updatedCandidate: Candidate = {
      ...candidate,
      status: 'interview_complete',
      postInterview: {
        interviewCompleted,
        consent,
        ceoInvite
      }
    };
    try {
      setSaving(true);
      await saveCandidate(updatedCandidate);
      if (ceoInvite === 'yes') {
        navigate(`/assessment-intro/${candidate.id}`);
      } else {
        navigate('/thank-you');
      }
    } catch (err) {
      console.error(err);
      alert('There was an issue saving your responses. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!candidate) return null;

  if (candidate.status === 'assessment_complete' || candidate.assessment) {
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

  const OptionButton: React.FC<{ selected: boolean; onClick: () => void; label: string }> = ({ selected, onClick, label }) => (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-lg border-2 font-medium transition-all ${
        selected 
          ? 'border-[#005EB8] bg-blue-50 text-[#005EB8]' 
          : 'border-gray-200 hover:border-blue-200 text-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto w-full space-y-8 pb-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post-Interview Confirmation</h2>
          <p className="text-gray-500 mt-2">Please answer the following questions.</p>
        </div>

        <Card className="space-y-6">
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">Has your initial interview been completed by a member of the Management Team?</p>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton label="Yes" selected={interviewCompleted === true} onClick={() => setInterviewCompleted(true)} />
              <OptionButton label="No" selected={interviewCompleted === false} onClick={() => setInterviewCompleted(false)} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-800">Do you consent to stay in communication for future openings?</p>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton label="Yes" selected={consent === true} onClick={() => setConsent(true)} />
              <OptionButton label="No" selected={consent === false} onClick={() => setConsent(false)} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-800">Were you invited to attend the Career Overview Session with the CEO?</p>
            <div className="space-y-2">
              <OptionButton label="Yes" selected={ceoInvite === 'yes'} onClick={() => setCeoInvite('yes')} />
              <OptionButton label="No" selected={ceoInvite === 'no'} onClick={() => setCeoInvite('no')} />
              <OptionButton label="I elected not to participate" selected={ceoInvite === 'declined'} onClick={() => setCeoInvite('declined')} />
            </div>
          </div>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-10">
          <div className="max-w-lg mx-auto">
            <Button 
              fullWidth 
              onClick={handleSubmit} 
              disabled={saving || interviewCompleted === null || consent === null || ceoInvite === null}
            >
              {saving ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostInterview;