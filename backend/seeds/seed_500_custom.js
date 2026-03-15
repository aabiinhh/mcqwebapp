const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const topics = [
    { subject: "Discrete Mathematical Structures", tags: ["Logic", "Set Theory", "Graph Theory", "Functions", "Combinatorics"] },
    { subject: "Data Structures", tags: ["Trees", "Queues", "Linked Lists", "Graphs", "Sorting", "Hashing", "Stacks"] },
    { subject: "Operating Systems", tags: ["CPU Scheduling", "Threads", "Memory Management", "Deadlocks", "File Systems", "Concurrency"] },
    { subject: "Computer Organization and Architecture", tags: ["Pipelining", "Memory Hierarchy", "ALU", "Instruction Set", "Registers", "I/O"] },
    { subject: "Database Management Systems", tags: ["Normalization", "Transactions", "SQL", "Indexing", "ER Modelling", "Concurrency"] },
    { subject: "Formal Languages and Automata Theory", tags: ["Finite Automata", "Regular Languages", "Context-Free Grammars", "Turing Machines", "Pushdown Automaton"] }
];

const difficulties = ['Easy', 'Medium', 'Hard'];

const questionTemplates = [
    "What is the primary function of '{tag}' in {subject}?",
    "Which of the following best describes the core concept of '{tag}'?",
    "In the context of {subject}, how is '{tag}' typically implemented?",
    "What is the main advantage of utilizing '{tag}'?",
    "Which algorithm or theory is most closely associated with '{tag}'?",
    "Identify the correct statement regarding '{tag}' in {subject}.",
    "What happens when '{tag}' boundaries are fundamentally overflowed?",
    "Which of these scenarios best demonstrates the usage of '{tag}'?",
    "Analyze the optimal performance characteristic of '{tag}'.",
    "Identify the fundamental limitation of traditional '{tag}' approaches.",
    "Which standard metric is predominantly used to evaluate '{tag}'?",
    "Compare variations of '{tag}'. Which structural property is inherently correct?",
    "What is the first step in properly processing a standard model of '{tag}'?",
    "How does '{tag}' interact comprehensively with broader systemic architectural elements?"
];

const generateQuestions = () => {
    const questions = [];
    topics.forEach(topic => {
        // 84 questions per subject -> 6 subjects * 84 = 504 questions total
        for (let i = 1; i <= 84; i++) {
            const tag = topic.tags[i % topic.tags.length];
            const difficulty = difficulties[i % difficulties.length];
            const template = questionTemplates[i % questionTemplates.length];
            
            const questionText = template.replace(/{tag}/g, tag).replace(/{subject}/g, topic.subject);
            
            questions.push({
                question_text: `[Simulated Question ${i}] ` + questionText,
                options: [
                    { id: 'A', text: `Primary definition or standard implementation regarding ${tag}.` },
                    { id: 'B', text: `Common conceptual variant or property related to ${tag}.` },
                    { id: 'C', text: `Secondary attribute that applies broadly but lacks specificity.` },
                    { id: 'D', text: `Edge case condition entirely unrelated to the core mechanism of ${tag}.` }
                ],
                correct_option: ['A', 'B', 'C', 'D'][i % 4],
                subject: topic.subject,
                concept_tag: tag,
                difficulty: difficulty,
                explanation: `This test question fundamentally relates to "${tag}" within the syllabus of ${topic.subject}. The correct conceptual mapping formally aligns with option ${['A', 'B', 'C', 'D'][i % 4]}.`,
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

        const newQuestions = generateQuestions();
        console.log(`Inserting ${newQuestions.length} structurally generated questions...`);
        await Question.insertMany(newQuestions);

        console.log('Successfully seeded additional 504 questions mapped across the 6 KTU subjects.');
        
        const total = await Question.countDocuments();
        console.log(`Total questions currently in Question Bank: ${total}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedLargeDB();
