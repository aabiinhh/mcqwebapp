const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const topics = [
    { subject: "Discrete Mathematical Structures", tags: ["Logic", "Set Theory", "Graph Theory", "Functions"] },
    { subject: "Data Structures", tags: ["Trees", "Queues", "Linked Lists", "Graphs", "Sorting"] },
    { subject: "Operating Systems", tags: ["CPU Scheduling", "Threads", "Memory Management", "Deadlocks"] },
    { subject: "Computer Organization and Architecture", tags: ["Pipelining", "Memory Hierarchy", "ALU", "Instruction Set"] },
    { subject: "Database Management Systems", tags: ["Normalization", "Transactions", "SQL", "Indexing"] },
    { subject: "Formal Languages and Automata Theory", tags: ["Finite Automata", "Regular Languages", "Context-Free Grammars", "Turing Machines"] }
];

const difficulties = ['Easy', 'Medium', 'Hard'];
const optionsTemplate = [
    { id: "A", text: "Option A text" },
    { id: "B", text: "Option B text" },
    { id: "C", text: "Option C text" },
    { id: "D", text: "Option D text" }
];
const correctOptions = ["A", "B", "C", "D"];

const generateQuestions = () => {
    const questions = [];
    topics.forEach(topic => {
        // Generate 60 questions per subject
        for (let i = 1; i <= 60; i++) {
            const tag = topic.tags[i % topic.tags.length];
            const difficulty = difficulties[i % difficulties.length];
            const correctOpt = correctOptions[i % correctOptions.length];

            questions.push({
                question_text: `[Previous Year] Sample Question ${i} for ${topic.subject} covering ${tag}?`,
                options: optionsTemplate.map(opt => ({
                    id: opt.id,
                    text: `Sample answer ${opt.id} for Q${i}`
                })),
                correct_option: correctOpt,
                subject: topic.subject,
                concept_tag: tag,
                difficulty: difficulty,
                is_active: true
            });
        }
    });
    return questions;
};

const seedLargeDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mcq_platform';
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB at ${mongoUri}`);

        console.log('Generating questions...');
        const newQuestions = generateQuestions();

        console.log(`Inserting ${newQuestions.length} questions into the database...`);
        await Question.insertMany(newQuestions);

        console.log('Successfully seeded 60 questions per topic.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedLargeDB();
