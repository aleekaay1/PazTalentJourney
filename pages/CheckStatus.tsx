import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input } from '../components/UI';
import { getCandidateByEmail } from '../services/storageService';
import { Candidate, PipelineStage } from '../types';
import { CheckCircle, Clock, XCircle, Calendar, FileText, Mail } from 'lucide-react';

const CheckStatus: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const getStatusInfo = (stage: PipelineStage) => {
    const statusMap: Record<PipelineStage, { label: string; color: string; bgColor: string; icon: React.ReactNode; message: string }> = {
      'Applied': {
        label: 'Application Received',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: <FileText className="w-6 h-6 text-blue-600" />,
        message: 'Thank you for your application. We have received your information and it is currently under review.'
      },
      'Screening': {
        label: 'Under Review',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50 border-amber-200',
        icon: <Clock className="w-6 h-6 text-amber-600" />,
        message: 'Your application is being reviewed by our team. We will contact you soon with next steps.'
      },
      'Interview Scheduled': {
        label: 'Interview Scheduled',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-200',
        icon: <Calendar className="w-6 h-6 text-purple-600" />,
        message: 'Great news! An interview has been scheduled for you. Please check your email for details.'
      },
      'Interviewed': {
        label: 'Interview Completed',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50 border-indigo-200',
        icon: <CheckCircle className="w-6 h-6 text-indigo-600" />,
        message: 'Thank you for completing your interview. Our team is evaluating candidates and will be in touch soon.'
      },
      'Offer': {
        label: 'Offer Extended',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        message: 'Congratulations! We have extended an offer to you. Please check your email for details and next steps.'
      },
      'Hired': {
        label: 'Hired',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        message: 'Congratulations! You have been hired. Welcome to the team! Please check your email for onboarding information.'
      },
      'Rejected': {
        label: 'Not Selected',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-200',
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        message: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates at this time.'
      },
      'Withdrawn': {
        label: 'Application Withdrawn',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50 border-gray-200',
        icon: <FileText className="w-6 h-6 text-gray-600" />,
        message: 'Your application has been withdrawn. If you would like to reapply, please contact us.'
      }
    };
    return statusMap[stage];
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = email.trim().toLowerCase();
    
    if (!emailValue) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const found = await getCandidateByEmail(emailValue);
      
      if (!found) {
        setError('No application found with this email address. Please verify your email or contact our team if you believe this is an error.');
        setCandidate(null);
        return;
      }

      setCandidate(found);
    } catch (err) {
      console.error(err);
      setError('There was an issue checking your status. Please try again or contact our team.');
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#005EB8]">Application Status Check</h1>
            <p className="text-gray-600">Enter your email address to view your current application status</p>
          </div>

          <form onSubmit={handleCheckStatus} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !candidate ? error : undefined}
              required
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Checking Status...' : 'Check Status'}
            </Button>
          </form>

          {candidate && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').icon}
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {candidate.firstName} {candidate.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
              </div>

              {candidate.adminData?.questionnaireDisqualified && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 mb-1">Application Not Eligible</p>
                      <p className="text-sm text-red-700">{candidate.adminData.questionnaireDisqualified.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {!candidate.adminData?.questionnaireDisqualified && (
                <>
                  <div className={`rounded-lg border p-4 ${getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').bgColor}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').icon}
                      <h3 className={`text-lg font-bold ${getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').color}`}>
                        {getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').label}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {getStatusInfo(candidate.adminData?.pipelineStage || 'Applied').message}
                    </p>
                  </div>

                  {candidate.adminData?.interviewScheduledAt && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-800 mb-1">Interview Scheduled</p>
                          <p className="text-sm text-blue-700">
                            {new Date(candidate.adminData.interviewScheduledAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {candidate.adminData?.nextStep && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Next Steps</p>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.adminData.nextStep}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Application submitted: {new Date(candidate.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {candidate.adminData?.resumeReviewedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resume reviewed: {new Date(candidate.adminData.resumeReviewedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {error && !candidate && (
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckStatus;
