const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question'); // Adjust path if necessary

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mcq_platform';

// Utility to decode HTML entities from OpenTDB
const decodeHTMLEntities = (text) => {
    return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'")
        .replace(/&#039;/g, "'");
};

const seedQuestions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing questions before seeding
        await Question.deleteMany({});
        console.log('Cleared existing questions');

        // Fetch 50 real CS questions from OpenTDB
        console.log('Fetching questions from OpenTDB...');
        const res = await fetch('https://opentdb.com/api.php?amount=50&category=18&type=multiple');
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("Failed to fetch questions from OpenTDB");
        }

        const questionsToInsert = data.results.map((q, index) => {
            // Create an array of options combining correct and incorrect answers
            let optionsTexts = [...q.incorrect_answers, q.correct_answer];
            // Shuffle the options
            optionsTexts.sort(() => Math.random() - 0.5);

            const options = optionsTexts.map((text, i) => ({
                id: ['A', 'B', 'C', 'D'][i],
                text: decodeHTMLEntities(text)
            }));

            const correctOpt = options.find(o => o.text === decodeHTMLEntities(q.correct_answer));

            // Assign a subject to make sure it falls into existing tests
            // Since OpenTDB CS questions are general, we assign them evenly or as 'Comprehensive'
            const subjectsObj = [
                { subject: 'Operating Systems', concept_tag: 'Process Management' },
                { subject: 'Database Management Systems', concept_tag: 'SQL Queries' },
                { subject: 'Computer Networks', concept_tag: 'OSI Model' },
                { subject: 'Data Structures', concept_tag: 'Trees and Graphs' },
                { subject: 'Algorithms', concept_tag: 'Dynamic Programming' },
                { subject: 'Data Structures and DBMS', concept_tag: 'Mixed Concept' },
                { subject: 'Comprehensive', concept_tag: 'General CS' }
            ];

            const assignedSubject = subjectsObj[index % subjectsObj.length];

            return {
                question_text: decodeHTMLEntities(q.question),
                options: options,
                correct_option: correctOpt.id,
                subject: assignedSubject.subject,
                concept_tag: assignedSubject.concept_tag,
                difficulty: q.difficulty === 'hard' ? 'Hard' : (q.difficulty === 'medium' ? 'Medium' : 'Easy'),
                is_active: true
            };
        });

        // Insert additional specific ones to ensure the "Comprehensive" test has enough questions
        await Question.insertMany(questionsToInsert);
        console.log(`Successfully seeded ${questionsToInsert.length} real questions.`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedQuestions();
