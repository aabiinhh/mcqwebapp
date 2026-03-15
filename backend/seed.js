require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const Test = require('./models/Test');

// removed strict connection

const questions = [
    // Discrete Mathematical Structures
    {
        question_text: "Which of the following propositions is a tautology?",
        options: [
            { id: "A", text: "(p v q) -> p" },
            { id: "B", text: "p v (q -> p)" },
            { id: "C", text: "p v (p -> q)" },
            { id: "D", text: "p -> (p -> q)" }
        ],
        correct_option: "C",
        subject: "Discrete Mathematical Structures",
        concept_tag: "Logic",
        difficulty: "Medium"
    },
    {
        question_text: "Let A and B be sets. If |A| = 5, |B| = 3, and |A ∩ B| = 2, what is |A U B|?",
        options: [
            { id: "A", text: "6" },
            { id: "B", text: "8" },
            { id: "C", text: "10" },
            { id: "D", text: "7" }
        ],
        correct_option: "A",
        subject: "Discrete Mathematical Structures",
        concept_tag: "Set Theory",
        difficulty: "Easy"
    },

    // Data Structures
    {
        question_text: "What is the worst-case time complexity of inserting a node in a Binary Search Tree (BST)?",
        options: [
            { id: "A", text: "O(1)" },
            { id: "B", text: "O(log n)" },
            { id: "C", text: "O(n)" },
            { id: "D", text: "O(n log n)" }
        ],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Trees",
        difficulty: "Medium"
    },
    {
        question_text: "Which data structure is most suitable for implementing a Priority Queue?",
        options: [
            { id: "A", text: "Stack" },
            { id: "B", text: "Linked List" },
            { id: "C", text: "Heap" },
            { id: "D", text: "Array" }
        ],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Queues",
        difficulty: "Easy"
    },

    // Operating Systems
    {
        question_text: "Which scheduling algorithm may cause starvation?",
        options: [
            { id: "A", text: "First Come First Serve (FCFS)" },
            { id: "B", text: "Round Robin (RR)" },
            { id: "C", text: "Shortest Job First (SJF)" },
            { id: "D", text: "None of the above" }
        ],
        correct_option: "C",
        subject: "Operating Systems",
        concept_tag: "CPU Scheduling",
        difficulty: "Medium"
    },
    {
        question_text: "A thread is usually defined as a 'lightweight process' because:",
        options: [
            { id: "A", text: "It has its own address space" },
            { id: "B", text: "It shares the code and data section with other threads of the same process" },
            { id: "C", text: "It does not have a Program Counter (PC)" },
            { id: "D", text: "It consumes less memory on disk" }
        ],
        correct_option: "B",
        subject: "Operating Systems",
        concept_tag: "Threads",
        difficulty: "Medium"
    },

    // Computer Organization and Architecture
    {
        question_text: "In a heavily pipelined processor, a branch instruction usually results in a:",
        options: [
            { id: "A", text: "Data Hazard" },
            { id: "B", text: "Control Hazard" },
            { id: "C", text: "Structural Hazard" },
            { id: "D", text: "Cache Miss" }
        ],
        correct_option: "B",
        subject: "Computer Organization and Architecture",
        concept_tag: "Pipelining",
        difficulty: "Medium"
    },
    {
        question_text: "Which mapping technique allows a main memory block to map to any cache line?",
        options: [
            { id: "A", text: "Direct Mapping" },
            { id: "B", text: "Set Associative Mapping" },
            { id: "C", text: "Fully Associative Mapping" },
            { id: "D", text: "Sector Mapping" }
        ],
        correct_option: "C",
        subject: "Computer Organization and Architecture",
        concept_tag: "Memory Hierarchy",
        difficulty: "Medium"
    },

    // Database Management Systems
    {
        question_text: "A relation is in BCNF if and only if every determinant is a:",
        options: [
            { id: "A", text: "Candidate Key" },
            { id: "B", text: "Foreign Key" },
            { id: "C", text: "Primary Key" },
            { id: "D", text: "Super Key" }
        ],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "Normalization",
        difficulty: "Medium"
    },
    {
        question_text: "Which of the following is an ACID property of a transaction?",
        options: [
            { id: "A", text: "Atomicity" },
            { id: "B", text: "Authenticity" },
            { id: "C", text: "Access" },
            { id: "D", text: "Analysis" }
        ],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "Transactions",
        difficulty: "Easy"
    },

    // Formal Languages and Automata Theory
    {
        question_text: "Which of the following languages is recognized by a Deterministic Finite Automaton (DFA)?",
        options: [
            { id: "A", text: "Context-Free Languages" },
            { id: "B", text: "Regular Languages" },
            { id: "C", text: "Context-Sensitive Languages" },
            { id: "D", text: "Recursively Enumerable Languages" }
        ],
        correct_option: "B",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Finite Automata",
        difficulty: "Easy"
    },
    {
        question_text: "According to the pumping lemma for regular languages, if a language is regular, there exists a constant 'p' such that any string 'w' of length >= p can be divided into:",
        options: [
            { id: "A", text: "Two parts (w = xy)" },
            { id: "B", text: "Three parts (w = xyz)" },
            { id: "C", text: "Four parts (w = wxyz)" },
            { id: "D", text: "Five parts (w = uvwxy)" }
        ],
        correct_option: "B",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Regular Languages",
        difficulty: "Medium"
    }
];

const mockTests = [
    {
        title: "KTU CST 308 Full Comprehensive Mock Exam",
        description: "A complete simulation covering all 6 core subjects of the S6 Computer Science syllabus.",
        total_duration_minutes: 60,
        time_per_question_seconds: 0,
        subject: "Comprehensive",
        is_adaptive: false
    },
    {
        title: "Data Structures & Database Intensive",
        description: "Focus purely on DB queries, normalization, trees, and graphs.",
        total_duration_minutes: 30,
        time_per_question_seconds: 60,
        subject: "Data Structures and DBMS",
        is_adaptive: true
    }
]

const seedDB = async () => {
    try {
        // skip connect if already connected
        console.log('Connected to MongoDB for Seeding...');

        // Clear existing test data
        await Question.deleteMany();
        await Test.deleteMany();
        console.log('Cleared existing Questions and Tests.');

        // Insert new KTU Data
        await Question.insertMany(questions);
        console.log(`Inserted ${questions.length} KTU Comprehensive Questions.`);

        const insertedTests = await Test.insertMany(mockTests);
        console.log(`Inserted ${insertedTests.length} Mock Tests.`);

        console.log("Here is a valid Test ID you can use to load the UI:");
        console.log(insertedTests[0]._id.toString());

        // process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        // process.exit(1);
    }
};

module.exports = { seedDB };
if (require.main === module) {
    // If run directly:
    mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mcq_platform').then(() => seedDB().then(() => process.exit(0)));
}
