const Groq = require('groq-sdk');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Generate career advice based on assessment
exports.generateCareerAdvice = async (assessmentData) => {
  try {
    if (!assessmentData) {
      throw new Error('assessmentData is null or undefined');
    }
    console.log('AI Service received data:', JSON.stringify(assessmentData, null, 2));

    const skills = Array.isArray(assessmentData.skills) ? assessmentData.skills.join(', ') : assessmentData.skills || '';
    const interests = Array.isArray(assessmentData.interests) ? assessmentData.interests.join(', ') : assessmentData.interests || '';

    const prompt = `You are a career advisor AI. Based on the following user information, provide personalized career advice in strictly valid JSON format.
Current Role: ${assessmentData.currentRole || 'Not specified'}
Years of Experience: ${assessmentData.yearsOfExperience || 0}
Target Role: ${assessmentData.targetRole || 'Not specified'}
Current Skills: ${skills}
Interests: ${interests}
Education: ${assessmentData.educationLevel || 'Not specified'}
Learning Style: ${assessmentData.preferredLearningStyle || 'Not specified'}
Time Commitment: ${assessmentData.timeCommitment || 'Not specified'}

Output JSON structure:
{
  "gapAnalysis": "A brief analysis of skill gaps...",
  "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "estimatedTimeline": "Estimated time to reach target role...",
  "motivationalTip": "One specific motivational tip..."
}

Keep the content concise, actionable, and supportive. Use emojis where appropriate. Do not include markdown formatting like \`\`\`json. Return only the raw JSON string.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000
    });

    // Clean up markdown if present
    let content = completion.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return content;

  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate career advice');
  }
};

// Generate learning roadmap
exports.generateRoadmap = async (assessmentData) => {
  try {
    const skills = Array.isArray(assessmentData.skills) ? assessmentData.skills.join(', ') : assessmentData.skills || '';

    const prompt = `Create a detailed learning roadmap for someone transitioning from ${assessmentData.currentRole || 'Unknown role'} to ${assessmentData.targetRole || 'Unknown role'}.
Current Skills: ${skills}
Available Time: ${assessmentData.timeCommitment || '10 hours/week'}
Learning Style: ${assessmentData.preferredLearningStyle || 'Visual'}

Output strictly valid JSON with the following structure:
{
  "phases": [
    {
      "phaseTitle": "Phase 1: Foundation (Months 1-3)",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "project": "Description of beginner project...",
      "timeBreakdown": "Weekly: X hours. Daily: Y minutes/hours."
    },
    {
      "phaseTitle": "Phase 2: Intermediate (Months 4-6)",
      "skills": ["Skill 1", "Skill 2"],
      "project": "Description of intermediate project...",
      "timeBreakdown": "Weekly: X hours. Daily: Y minutes/hours."
    },
    {
      "phaseTitle": "Phase 3: Advanced (Months 7-9)",
      "skills": ["Skill 1", "Skill 2"],
      "project": "Description of advanced project...",
      "timeBreakdown": "Weekly: X hours. Daily: Y minutes/hours."
    },
    {
      "phaseTitle": "Phase 4: Capstone (Months 10-12)",
      "skills": ["Skill 1", "Skill 2"],
      "project": "Description of capstone project...",
      "timeBreakdown": "Weekly: X hours. Daily: Y minutes/hours."
    }
  ]
}

CRITICAL constraints:
1. Divide weekly hours by 7 to get daily time (e.g. 14hrs/week = 2hrs/day).
2. Never suggest more time than available.
3. Be realistic and supportive. Use emojis.
4. Do not include markdown formatting like \`\`\`json. Return only the raw JSON string.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate roadmap');
  }
};

// Generate learning resources for specific skills
exports.generateResourcesForSkills = async (skills) => {
  try {
    const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
    console.log(`🧠 Generating resources for skills: ${skillsList}`);

    const prompt = `You are a helpful expert developer and career coach.
For the following skills: "${skillsList}"

Provide a list of 3-5 high-quality, free learning resources.
Include a mix of:
1. Official Recommendation / Documentation (Articles)
2. High-quality Video Tutorials or Playlists (YouTube - specifically from channels like freeCodeCamp, Traversy Media, Net Ninja, Programming with Mosh, Fireship, etc.)

Output strictly valid JSON in this format:
[
  {
    "title": "Title of the resource",
    "description": "Brief description",
    "url": "https://valid-url.com",
    "type": "video" OR "documentation" OR "article" OR "course",
    "difficulty": "beginner" OR "intermediate" OR "advanced",
    "duration": "e.g. 10 mins OR 2 hours",
    "skills": ["Skill 1"],
    "author": "Author or Channel Name"
  }
]

CRITICAL:
- Ensure URLs are real and likely to work (standard docs or well-known videos).
- Do not make up fake URLs. If unsure, use the main documentation URL.
- Return ONLY the raw JSON array. No markdown formatting.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3, // Lower temperature for more factual URLs
      max_tokens: 1500
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const resources = JSON.parse(content);

    // Add default rating and source
    return resources.map(r => ({
      ...r,
      rating: 5,
      source: 'ai_generated'
    }));

  } catch (error) {
    console.error('Failed to generate resources:', error);
    return []; // Return empty array instead of failing
  }
};