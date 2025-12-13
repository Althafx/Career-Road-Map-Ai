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

        const prompt = `You are a career advisor AI. Based on the following user information, provide personalized career advice:
Current Role: ${assessmentData.currentRole || 'Not specified'}
Years of Experience: ${assessmentData.yearsOfExperience || 0}
Target Role: ${assessmentData.targetRole || 'Not specified'}
Current Skills: ${skills}
Interests: ${interests}
Education: ${assessmentData.educationLevel || 'Not specified'}
Learning Style: ${assessmentData.preferredLearningStyle || 'Not specified'}
Time Commitment: ${assessmentData.timeCommitment || 'Not specified'}
Provide:
1. A brief career gap analysis (what skills are missing)
2. Top 3 recommended skills to learn
3. Estimated timeline to reach the target role
4. One motivational tip
Keep the response concise and actionable.`;
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
        return completion.choices[0].message.content;
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
Target Skills Needed: Based on ${assessmentData.targetRole || 'Unknown role'}
Available Time: ${assessmentData.timeCommitment || '10 hours/week'} (IMPORTANT: Use ONLY this amount, do not exceed it)
Learning Style: ${assessmentData.preferredLearningStyle || 'Visual'}

CRITICAL: The user can dedicate ${assessmentData.timeCommitment}. Calculate daily hours by dividing weekly hours by 7. For example, if they have 14 hours/week, that's 2 hours/day. NEVER suggest more time than they have available.

Generate a structured 12-month roadmap with 4 phases:

**Phase 1 (Months 1-3): Foundation Skills**
- List 3-5 essential skills to learn
- Recommended beginner project
- Time breakdown: X hours/week (Y hours/day) - studying, practicing, building

**Phase 2 (Months 4-6): Intermediate Skills**
- List 3-5 intermediate skills
- Recommended intermediate project
- Time breakdown: X hours/week (Y hours/day) - studying, practicing, building

**Phase 3 (Months 7-9): Advanced Skills**
- List 3-5 advanced skills
- Recommended advanced project
- Time breakdown: X hours/week (Y hours/day) - studying, practicing, building

**Phase 4 (Months 10-12): Specialization**
- Specialized skills for target role
- Capstone project
- Time breakdown: X hours/week (Y hours/day) - studying, practicing, building

Keep it realistic, actionable, and formatted in clean markdown with bullet points.`;
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
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to generate roadmap');
    }
};