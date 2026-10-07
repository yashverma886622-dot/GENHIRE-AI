import { GoogleGenAI } from '@google/genai';

export interface GeneratedBriefData {
  title: string;
  description: string;
  contentType: string;
  styles: string[];
  aspectRatio: string;
  platform: string;
  targetAudience: string;
  commercialUse: boolean;
  preferredTools: string[];
  creatorRequirements: string[];
  suggestedBudget: number;
  isAiGenerated: boolean;
}

export async function generateBriefFromPrompt(promptText: string): Promise<GeneratedBriefData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are a creative campaign director for GenHire, an AI Content Creator Marketplace in India.
Convert natural language brand briefs into structured creative campaign specifications.
Always output valid JSON conforming to this schema:
{
  "title": string (engaging campaign title),
  "description": string (detailed 2-3 sentence campaign brief),
  "contentType": string (e.g., "Video Ad", "Fashion Film", "Product Commercial", "Animation", "Brand Film"),
  "styles": string[] (e.g., ["Cinematic", "Luxury", "Futuristic"]),
  "aspectRatio": string (one of "9:16", "16:9", "1:1", "4:5"),
  "platform": string (e.g., "Instagram", "YouTube", "Digital OOH", "LinkedIn"),
  "targetAudience": string (e.g., "Urban Indian Gen Z & Millennials, ages 18-28"),
  "commercialUse": boolean,
  "preferredTools": string[] (e.g., ["Runway Gen-3 Alpha", "Midjourney v6", "Flux.1 Pro", "Kling AI"]),
  "creatorRequirements": string[] (3 specific creator qualification criteria),
  "suggestedBudget": number (in Indian Rupees INR ₹, between 15000 and 60000)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        return {
          title: parsed.title || 'AI Creative Campaign',
          description: parsed.description || promptText,
          contentType: parsed.contentType || 'Video Ad',
          styles: Array.isArray(parsed.styles) && parsed.styles.length ? parsed.styles : ['Cinematic', 'Modern'],
          aspectRatio: parsed.aspectRatio || (promptText.toLowerCase().includes('vertical') ? '9:16' : '16:9'),
          platform: parsed.platform || (promptText.toLowerCase().includes('instagram') ? 'Instagram' : 'YouTube'),
          targetAudience: parsed.targetAudience || 'Modern digital audience',
          commercialUse: typeof parsed.commercialUse === 'boolean' ? parsed.commercialUse : true,
          preferredTools: Array.isArray(parsed.preferredTools) && parsed.preferredTools.length ? parsed.preferredTools : ['Runway Gen-3 Alpha', 'Midjourney v6'],
          creatorRequirements: Array.isArray(parsed.creatorRequirements) && parsed.creatorRequirements.length ? parsed.creatorRequirements : ['Proven portfolio in generative AI video', 'Commercial rights delivery'],
          suggestedBudget: typeof parsed.suggestedBudget === 'number' ? parsed.suggestedBudget : 30000,
          isAiGenerated: true,
        };
      }
    } catch (err: unknown) {
      console.warn('[GenHire AI] Gemini call failed or timed out. Using deterministic fallback parser.', err);
    }
  }

  // Robust deterministic rule-based fallback
  return parseBriefDeterministically(promptText);
}

function parseBriefDeterministically(prompt: string): GeneratedBriefData {
  const p = prompt.toLowerCase();

  // Content type & specialization
  let contentType = 'Video Ad';
  if (p.includes('fashion') || p.includes('couture') || p.includes('apparel') || p.includes('clothing')) {
    contentType = 'Fashion Film';
  } else if (p.includes('food') || p.includes('coffee') || p.includes('beverage') || p.includes('snack') || p.includes('perfume') || p.includes('cosmetic')) {
    contentType = 'Product Commercial';
  } else if (p.includes('anime') || p.includes('cartoon') || p.includes('mascot') || p.includes('character') || p.includes('animation')) {
    contentType = 'Animation';
  } else if (p.includes('travel') || p.includes('tourism') || p.includes('documentary')) {
    contentType = 'Travel Video';
  } else if (p.includes('anthem') || p.includes('brand film') || p.includes('manifesto')) {
    contentType = 'Brand Film';
  }

  // Aspect ratio
  let aspectRatio = '16:9';
  if (p.includes('vertical') || p.includes('9:16') || p.includes('reel') || p.includes('reels') || p.includes('tiktok') || p.includes('shorts') || p.includes('story')) {
    aspectRatio = '9:16';
  } else if (p.includes('square') || p.includes('1:1') || p.includes('feed post')) {
    aspectRatio = '1:1';
  } else if (p.includes('4:5') || p.includes('portrait')) {
    aspectRatio = '4:5';
  }

  // Platform
  let platform = 'Instagram';
  if (p.includes('youtube')) platform = 'YouTube';
  else if (p.includes('tiktok')) platform = 'TikTok';
  else if (p.includes('linkedin')) platform = 'LinkedIn';
  else if (p.includes('ooh') || p.includes('billboard')) platform = 'Digital OOH';

  // Styles
  const styles: string[] = [];
  if (p.includes('cinematic')) styles.push('Cinematic');
  if (p.includes('luxury') || p.includes('premium') || p.includes('haute') || p.includes('chic')) styles.push('Luxury');
  if (p.includes('futuristic') || p.includes('cyber') || p.includes('sci-fi') || p.includes('tech')) styles.push('Futuristic');
  if (p.includes('gen z') || p.includes('glitch') || p.includes('streetwear') || p.includes('viral')) styles.push('Gen Z / Glitch');
  if (p.includes('sensory') || p.includes('tactile') || p.includes('macro')) styles.push('Sensory');
  if (p.includes('minimal') || p.includes('clean')) styles.push('Minimalist');
  if (p.includes('hyper-realistic') || p.includes('photorealistic') || p.includes('realistic')) styles.push('Hyper-realistic');

  if (styles.length === 0) {
    styles.push('Cinematic', 'Modern');
  }

  // Commercial use
  const commercialUse = !p.includes('non-commercial') && !p.includes('personal use');

  // Preferred tools
  const preferredTools: string[] = ['Runway Gen-3 Alpha', 'Midjourney v6'];
  if (p.includes('flux')) preferredTools.push('Flux.1 Pro');
  if (p.includes('kling')) preferredTools.push('Kling AI');
  if (p.includes('luma')) preferredTools.push('Luma Dream Machine');
  if (p.includes('comfy')) preferredTools.push('ComfyUI');

  // Budget estimation in INR
  let suggestedBudget = 25000;
  if (styles.includes('Luxury') || p.includes('4k') || contentType === 'Brand Film') {
    suggestedBudget = 35000;
  }
  if (p.includes('supercar') || p.includes('automotive') || p.includes('ev')) {
    suggestedBudget = 45000;
  }

  const titleWords = styles.slice(0, 2).concat([contentType]);
  const title = `${titleWords.join(' ')} — Creative Campaign`;

  return {
    title,
    description: `Structured creative brief: ${prompt.trim()}. Focus on high temporal consistency, custom art direction, and production-grade master color grading.`,
    contentType,
    styles,
    aspectRatio,
    platform,
    targetAudience: p.includes('gen z') ? 'Gen Z & Trend-forward Digital Youth in India' : 'Urban Indian Consumers & Early Adopters',
    commercialUse,
    preferredTools: Array.from(new Set(preferredTools)),
    creatorRequirements: [
      `Demonstrated capability in ${contentType} and ${aspectRatio} format`,
      'Verified toolchain usage with clean temporal coherence',
      'Delivery of high-bitrate MP4 with commercial usage clearance',
    ],
    suggestedBudget,
    isAiGenerated: false,
  };
}
