import React from 'react';
import { ShieldCheck, CheckCircle2, Wrench, Layers } from 'lucide-react';
import { CreatorVerification } from '../types/index.ts';

interface VerificationBadgeProps {
  verification: CreatorVerification;
  compact?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verification, compact = false }) => {
  const { toolsVerified, workflowVerified, pastWorkVerified } = verification;
  const verifiedCount = [toolsVerified, workflowVerified, pastWorkVerified].filter(Boolean).length;

  if (verifiedCount === 0) {
    return (
      <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
        Standard Creator
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
        Verified AI Creator
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {toolsVerified && (
        <div
          title="Creator submitted tool usage evidence for platform review."
          className="inline-flex items-center text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md"
        >
          <Wrench className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
          <span>Tools Verified</span>
        </div>
      )}
      {workflowVerified && (
        <div
          title="Creator submitted a production workflow for review."
          className="inline-flex items-center text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md"
        >
          <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          <span>Workflow Reviewed</span>
        </div>
      )}
      {pastWorkVerified && (
        <div
          title="Past project information has been reviewed."
          className="inline-flex items-center text-xs font-medium text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
          <span>Past Work Confirmed</span>
        </div>
      )}
    </div>
  );
};
