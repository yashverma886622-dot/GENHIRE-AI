import { CreatorProfile, PortfolioItem, Brief, MatchScoreBreakdown, MatchedCreator } from './types.ts';

export function calculateMatchScore(
  creator: CreatorProfile,
  creatorPortfolio: PortfolioItem[],
  brief: Brief
): MatchScoreBreakdown {
  const positiveReasons: string[] = [];
  const partialReasons: string[] = [];
  const mismatchReasons: string[] = [];

  // 1. CONTENT TYPE (Max 30)
  let contentTypeScore = 0;
  const briefContentTypeLower = (brief.contentType || '').toLowerCase();
  const hasExactContentType = creator.contentTypes.some(
    ct => ct.toLowerCase() === briefContentTypeLower || briefContentTypeLower.includes(ct.toLowerCase())
  );
  const specializationMatches =
    creator.specialization.toLowerCase().includes(briefContentTypeLower) ||
    briefContentTypeLower.includes(creator.specialization.toLowerCase());

  if (hasExactContentType || specializationMatches) {
    contentTypeScore = 30;
    positiveReasons.push(`✓ Specializes in ${brief.contentType} (${creator.specialization})`);
  } else if (creator.contentTypes.some(ct => ct.toLowerCase().includes('video') || ct.toLowerCase().includes('ad'))) {
    contentTypeScore = 20;
    partialReasons.push(`△ Creates video content, with adjacent specialization in ${creator.specialization}`);
  } else {
    contentTypeScore = 8;
    mismatchReasons.push(`✕ Primary focus is ${creator.specialization}, not specifically ${brief.contentType}`);
  }

  // 2. FORMAT / ASPECT RATIO (Max 15)
  let aspectRatioScore = 0;
  const briefAspect = brief.aspectRatio || '16:9';
  const supportsAspect = creator.supportedAspectRatios.includes(briefAspect);
  const portfolioHasAspect = creatorPortfolio.some(p => p.aspectRatio === briefAspect);

  if (supportsAspect || portfolioHasAspect) {
    aspectRatioScore = 15;
    positiveReasons.push(`✓ Fully supports requested ${briefAspect} format`);
  } else {
    aspectRatioScore = 0;
    mismatchReasons.push(`✕ Does not list ${briefAspect} among standard aspect ratios`);
  }

  // 3. STYLE (Max 15)
  let styleScore = 0;
  const briefStyles = brief.styles || [];
  const matchingStyles = briefStyles.filter(bs =>
    creator.styles.some(cs => cs.toLowerCase() === bs.toLowerCase() || cs.toLowerCase().includes(bs.toLowerCase()))
  );

  if (briefStyles.length === 0) {
    styleScore = 15;
  } else {
    const matchRatio = matchingStyles.length / briefStyles.length;
    if (matchRatio >= 0.75) {
      styleScore = 15;
      positiveReasons.push(`✓ Strong aesthetic synergy on styles: ${matchingStyles.join(', ')}`);
    } else if (matchRatio >= 0.33) {
      styleScore = 10;
      partialReasons.push(`△ Moderate style alignment on ${matchingStyles.join(', ')}`);
    } else if (matchingStyles.length > 0) {
      styleScore = 7;
      partialReasons.push(`△ Limited style overlap on ${matchingStyles.join(', ')}`);
    } else {
      styleScore = 3;
      mismatchReasons.push(`✕ Preferred styles (${briefStyles.join(', ')}) differ from creator's signature styles`);
    }
  }

  // 4. TOOLS (Max 10)
  let toolsScore = 0;
  const briefTools = brief.preferredTools || [];
  if (briefTools.length === 0) {
    toolsScore = 10;
    positiveReasons.push(`✓ Proficient in industry-standard tools (${creator.tools.slice(0, 3).join(', ')})`);
  } else {
    const matchingTools = briefTools.filter(bt =>
      creator.tools.some(ct => ct.toLowerCase().includes(bt.toLowerCase()) || bt.toLowerCase().includes(ct.toLowerCase()))
    );

    if (matchingTools.length === briefTools.length) {
      toolsScore = 10;
      positiveReasons.push(`✓ Uses all preferred AI tools: ${matchingTools.join(', ')}`);
    } else if (matchingTools.length > 0) {
      toolsScore = 8;
      positiveReasons.push(`✓ Uses preferred tools: ${matchingTools.join(', ')}`);
    } else {
      toolsScore = 4;
      partialReasons.push(`△ Uses alternative high-end AI toolchain (${creator.tools.slice(0, 2).join(', ')})`);
    }
  }

  // 5. COMMERCIAL LICENSE (Max 15)
  let commercialLicenseScore = 0;
  if (!brief.commercialUse) {
    commercialLicenseScore = 15;
    positiveReasons.push(`✓ Commercial license terms cleared`);
  } else if (creator.commercialUseReady) {
    commercialLicenseScore = 15;
    positiveReasons.push(`✓ Commercial-use ready with clear usage rights`);
  } else {
    commercialLicenseScore = 0;
    mismatchReasons.push(`✕ Commercial license readiness not certified`);
  }

  // 6. BUDGET (Max 10)
  let budgetScore = 0;
  const briefBudget = brief.budget || 25000;
  const creatorRate = creator.rateFrom || 20000;

  if (creatorRate <= briefBudget) {
    budgetScore = 10;
    positiveReasons.push(`✓ Starting rate (₹${creatorRate.toLocaleString('en-IN')}) fits within campaign budget (₹${briefBudget.toLocaleString('en-IN')})`);
  } else if (creatorRate <= briefBudget * 1.25) {
    budgetScore = 7;
    partialReasons.push(`△ Starting rate (₹${creatorRate.toLocaleString('en-IN')}) is slightly above target budget (₹${briefBudget.toLocaleString('en-IN')})`);
  } else if (creatorRate <= briefBudget * 1.5) {
    budgetScore = 4;
    partialReasons.push(`△ Starting rate (₹${creatorRate.toLocaleString('en-IN')}) exceeds budget by ~35-50%`);
  } else {
    budgetScore = 2;
    mismatchReasons.push(`✕ Rate (₹${creatorRate.toLocaleString('en-IN')}) is significantly higher than brief budget (₹${briefBudget.toLocaleString('en-IN')})`);
  }

  // 7. VERIFICATION (Max 5)
  let verificationScore = 0;
  const ver = creator.verification || { toolsVerified: false, workflowVerified: false, pastWorkVerified: false };
  const verifiedCount = [ver.toolsVerified, ver.workflowVerified, ver.pastWorkVerified].filter(Boolean).length;

  if (verifiedCount === 3) {
    verificationScore = 5;
    positiveReasons.push(`✓ Fully verified (Tools, Workflow & Past Commercial Deliveries confirmed)`);
  } else if (verifiedCount === 2) {
    verificationScore = 4;
    positiveReasons.push(`✓ 2 platform verification trust signals confirmed`);
  } else if (verifiedCount === 1) {
    verificationScore = 3;
    partialReasons.push(`△ 1 platform verification signal confirmed`);
  } else {
    verificationScore = 1;
    partialReasons.push(`△ Standard platform registration, verification in progress`);
  }

  const totalScore = Math.min(
    100,
    Math.round(
      contentTypeScore +
      aspectRatioScore +
      styleScore +
      toolsScore +
      commercialLicenseScore +
      budgetScore +
      verificationScore
    )
  );

  return {
    contentTypeScore,
    aspectRatioScore,
    styleScore,
    toolsScore,
    commercialLicenseScore,
    budgetScore,
    verificationScore,
    totalScore,
    positiveReasons,
    partialReasons,
    mismatchReasons,
  };
}

export function rankCreatorsForBrief(
  creators: CreatorProfile[],
  allPortfolios: PortfolioItem[],
  brief: Brief
): MatchedCreator[] {
  const ranked = creators.map(creator => {
    const creatorPortfolios = allPortfolios.filter(p => p.creatorId === creator._id);
    const breakdown = calculateMatchScore(creator, creatorPortfolios, brief);
    return {
      creator,
      portfolioSamples: creatorPortfolios.slice(0, 3),
      matchScore: breakdown.totalScore,
      breakdown,
    };
  });

  // Sort descending by matchScore, then by rating, then by projectsCompleted
  return ranked.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (b.creator.rating !== a.creator.rating) {
      return b.creator.rating - a.creator.rating;
    }
    return b.creator.projectsCompleted - a.creator.projectsCompleted;
  });
}
