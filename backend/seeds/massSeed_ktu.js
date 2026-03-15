require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Test = require('../models/Test');

const rawQuestions = [
    // 1. Discrete Mathematical Structures (10)
    "What is a power set?|Set of all subsets|Set of elements|Null set|Universal set|A|Discrete Mathematical Structures|Set Theory",
    "A relation is an equivalence relation if it is?|Reflexive|Symmetric|Transitive|All of above|D|Discrete Mathematical Structures|Relations",
    "The Boolean expression x + x' is equivalent to?|0|1|x|x'|B|Discrete Mathematical Structures|Logic",
    "How many edges in a complete graph with n vertices?|n(n-1)/2|n(n+1)/2|n^2|2n|A|Discrete Mathematical Structures|Graph Theory",
    "A tautology is a proposition that is always?|True|False|Unknown|Valid|A|Discrete Mathematical Structures|Logic",
    "Which algebraic structure has one binary operation that is associative?|Group|Semigroup|Monoid|Ring|B|Discrete Mathematical Structures|Algebra",
    "A graph with no cycles is called a?|Tree|Complete Graph|Bipartite Graph|Hamiltonian|A|Discrete Mathematical Structures|Graph Theory",
    "Pigeonhole principle states if N items are put in M containers and N>M, then?|One container is empty|At least one container has >1 item|All hold 1 item|Impossible|B|Discrete Mathematical Structures|Combinatorics",
    "The cardinality of the set {1, 2, 3} is?|1|2|3|4|C|Discrete Mathematical Structures|Set Theory",
    "A function f is bijective if it is?|Injective|Surjective|Both|Neither|C|Discrete Mathematical Structures|Functions",

    // 2. Data Structures (10)
    "What is the average time complexity of a search in a BST?|O(1)|O(log n)|O(n)|O(n log n)|B|Data Structures|Trees",
    "A queue follows which protocol?|LIFO|FIFO|Random|LILO|B|Data Structures|Queue",
    "Which data structure is recursive by nature?|Stack|Queue|Tree|Array|C|Data Structures|Trees",
    "What is the time complexity of pushing an element to a stack?|O(n)|O(1)|O(log n)|O(n^2)|B|Data Structures|Stack",
    "A linked list is a dynamic, sequential data structure?|True|False|Sometimes|Never|A|Data Structures|Linked List",
    "Which is a height-balanced binary search tree?|B-Tree|Splay Tree|AVL Tree|Binary Tree|C|Data Structures|Trees",
    "What happens when you pop an empty stack?|Underflow|Overflow|Garbage value|Null|A|Data Structures|Stack",
    "Which data structure is best for backtracking?|Queue|Array|Stack|Linked List|C|Data Structures|Stack",
    "What defines a complete binary tree?|All leaves same level|All levels full except last|2 children|Left < Right|B|Data Structures|Trees",
    "Merging 2 sorted arrays of size m and n takes time?|O(m*n)|O(log(m+n))|O(m+n)|O(min(m,n))|C|Data Structures|Sorting",

    // 3. Operating Systems (10)
    "Which scheduling algorithm allocates CPU based strictly on duration?|Round Robin|SJF|FCFS|Priority|B|Operating Systems|CPU Scheduling",
    "Virtual memory is commonly implemented via?|Demand Paging|Swapping|Cache|Registers|A|Operating Systems|Memory Management",
    "A deadlock requires how many necessary conditions?|2|3|4|5|C|Operating Systems|Deadlocks",
    "The time to move the disk arm to the desired cylinder is?|Rotational latency|Seek time|Transfer rate|Access time|B|Operating Systems|Storage",
    "A semaphore is fundamentally an?|Integer variable|Floating variable|String|File pointer|A|Operating Systems|Concurrency",
    "Which structure handles page faults?|Application|Compiler|Operating System|Hardware|C|Operating Systems|Memory Management",
    "Context switching is performed by?|Interrupt handler|Dispatcher|Scheduler|User|B|Operating Systems|CPU Scheduling",
    "Thrashing occurs when?|Low degree of multiprogramming|High page fault rate|CPU is idle|Low memory|B|Operating Systems|Memory Management",
    "Which is not a valid state of a process?|Running|Waiting|Ready|Suspended Ready|D|Operating Systems|Process",
    "A mutex provides?|Mutual exclusion|Deadlock|Synchronization|Race condition|A|Operating Systems|Concurrency",

    // 4. Computer Organization and Architecture (10)
    "What part of the CPU performs arithmetic operations?|CU|ALU|Registers|Bus|B|Computer Organization and Architecture|CPU",
    "Cache memory acts between?|CPU and RAM|RAM and ROM|CPU and Hard Disk|None|A|Computer Organization and Architecture|Memory",
    "RISC stands for?|Reduced Instruction Set Computer|Rapid Instruction Set Computer|Risk Instruction System Computer|None|A|Computer Organization and Architecture|ISA",
    "Pipelining increases?|Latency|Throughput|Execution time|Clock cycle|B|Computer Organization and Architecture|Pipelining",
    "DMA stands for?|Direct Memory Access|Dynamic Memory Access|Direct Module Access|Dynamic Module Access|A|Computer Organization and Architecture|I/O",
    "In IEEE 754 single precision, how many bits are used for the exponent?|8|11|23|32|A|Computer Organization and Architecture|Arithmetic",
    "Which mapping allows a memory block to map to any cache line?|Direct|Associative|Set-Associative|None|B|Computer Organization and Architecture|Cache",
    "The program counter holds the?|Instruction|Address of next instruction|Data|Interrupt vector|B|Computer Organization and Architecture|CPU",
    "A bus is a?|Storage device|Communication pathway|Processor|Memory type|B|Computer Organization and Architecture|Bus",
    "Microprogramming involves?|Writing software|Control unit implementation|ALU operations|I/O writing|B|Computer Organization and Architecture|Control Unit",

    // 5. Database Management Systems (10)
    "Which of the following is not an ACID property?|Atomicity|Consistency|Isolation|Data|D|Database Management Systems|Transactions",
    "Which normal form eliminates partial dependencies?|1NF|2NF|3NF|BCNF|B|Database Management Systems|Normalization",
    "Which command is DDL?|SELECT|INSERT|UPDATE|CREATE|D|Database Management Systems|SQL",
    "A transaction that completes execution is called?|Active|Committed|Failed|Aborted|B|Database Management Systems|Transactions",
    "What operator removes duplicate rows in SQL?|UNIQUE|DISTINCT|NOT IN|MINUS|B|Database Management Systems|SQL",
    "An entity set without sufficient attributes to form a primary key is?|Strong|Weak|Simple|Complex|B|Database Management Systems|ER Modelling",
    "Which of these joins returns all rows from the left table?|INNER JOIN|LEFT OUTER|RIGHT OUTER|FULL OUTER|B|Database Management Systems|SQL",
    "A lock that allows multiple transactions to read but not write?|Exclusive|Shared|Binary|Dead|B|Database Management Systems|Concurrency",
    "A relation in BCNF must also be in?|1NF, 2NF, 3NF|4NF|5NF|None|A|Database Management Systems|Normalization",
    "The highest level in database architecture is?|Internal|Conceptual|External|Physical|C|Database Management Systems|Architecture",

    // 6. Formal Languages and Automata Theory (10)
    "A DFA has how many transitions for each symbol per state?|0|Exactly 1|Multiple|Any|B|Formal Languages and Automata Theory|DFA",
    "Regular languages are recognized by?|Turing Machine|Pushdown Automaton|Finite Automaton|Linear Bounded Automaton|C|Formal Languages and Automata Theory|Language",
    "Chomsky hierarchy Type 3 refers to?|Context-Free|Context-Sensitive|Regular|Recursively Enumerable|C|Formal Languages and Automata Theory|Chomsky",
    "A pushdown automaton uses what data structure?|Queue|Graph|Stack|List|C|Formal Languages and Automata Theory|PDA",
    "The Halting problem is?|Decidable|Undecidable|Ptime|Infinite|B|Formal Languages and Automata Theory|Computability",
    "Which grammar generates context-free languages?|Type 0|Type 1|Type 2|Type 3|C|Formal Languages and Automata Theory|Grammar",
    "Pumping lemma is used to prove a language is?|Regular|Not regular|Context-free|Decidable|B|Formal Languages and Automata Theory|Pumping Lemma",
    "A Turing machine can simulate a computer?|True|False|Only finite|Never|A|Formal Languages and Automata Theory|Turing Machine",
    "Epsilon closures are used in converting?|DFA to NFA|NFA to DFA|PDA to CFG|PDA to Turing Machine|B|Formal Languages and Automata Theory|Automata",
    "L = {a^n b^n | n >= 0} is?|Regular|Context-Free|Context-Sensitive|Unrestricted|B|Formal Languages and Automata Theory|Languages"
];

const parsedQuestions = rawQuestions.map(rq => {
    const parts = rq.split('|');
    const correctOptionLetter = parts[5];
    const correctIndex = correctOptionLetter.charCodeAt(0) - 65;
    const correctOptionText = parts[correctIndex + 1];

    return {
        question_text: parts[0],
        options: [
            { id: 'A', text: parts[1] },
            { id: 'B', text: parts[2] },
            { id: 'C', text: parts[3] },
            { id: 'D', text: parts[4] }
        ],
        correct_option: correctOptionLetter,
        subject: parts[6],
        concept_tag: parts[7],
        difficulty: 'Medium',
        explanation: `The correct answer is ${correctOptionLetter} (${correctOptionText}). This is a fundamental concept of ${parts[7]} within the subject of ${parts[6]}.`
    };
});

const mockTests = [
    {
        title: "KTU CST 308 Full Comprehensive Mock Exam",
        description: "A complete simulation covering all 6 core subjects of the S6 Computer Science syllabus. 60 questions.",
        total_duration_minutes: 60,
        time_per_question_seconds: 0,
        subject: "Comprehensive",
        is_adaptive: false
    },
    {
        title: "CST S6 Specialized Subjects Mock",
        description: "Focus purely on OS, Automata, and DB. 60 questions.",
        total_duration_minutes: 60,
        time_per_question_seconds: 0,
        subject: "Operating Systems, Database Management Systems, Formal Languages and Automata Theory",
        is_adaptive: false
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mcq_platform');
        console.log('Clearing existing Questions and Tests...');
        await Question.deleteMany();
        await Test.deleteMany();

        console.log('Inserting 60 Real KTU Questions...');
        await Question.insertMany(parsedQuestions);
        console.log(`Inserted ${parsedQuestions.length} Questions.`);

        console.log('Inserting Mock Tests...');
        const insertedTests = await Test.insertMany(mockTests);
        console.log(`Inserted ${insertedTests.length} Mock Tests.`);

        mongoose.disconnect();
        console.log('Mass seeding complete! DB populated precisely with 60 questions matching all 6 S6 KTU subjects.');
    } catch (err) {
        console.error('Seeding failed:', err);
        mongoose.disconnect();
    }
};

seedDB();
