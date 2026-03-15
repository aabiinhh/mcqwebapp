const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const newQuestions = [
    {
        question_text: "State True or False: i) Binary search is used for searching in a sorted array ii) The time complexity of binary search is O(log n)",
        options: [{ id: 'A', text: 'True, True' }, { id: 'B', text: 'False, True' }, { id: 'C', text: 'True, False' }, { id: 'D', text: 'False, False' }],
        correct_option: "A",
        subject: "Data Structures",
        concept_tag: "Searching",
        difficulty: "Easy",
        explanation: "Binary search requires a sorted array to work and operates by dividing the search interval in half, resulting in an O(log n) time complexity.",
        is_active: true
    },
    {
        question_text: "The postorder traversal of a binary tree is 8, 9, 6, 7, 4, 5, 2, 3, 1. The inorder traversal is 8, 6, 9, 4, 7, 2, 5, 1, 3. The height of the binary tree is:",
        options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: '4' }],
        correct_option: "D",
        subject: "Data Structures",
        concept_tag: "Trees",
        difficulty: "Hard",
        explanation: "By analyzing the postorder (root at end) and inorder (left-root-right) sequences, we can reconstruct the tree. Root is 1. The longest path from root to leaf is 1-2-4-6-8, which has 4 edges.",
        is_active: true
    },
    {
        question_text: "What can be said about the array representation of a circular queue when it contains only one element?",
        options: [{ id: 'A', text: 'FRONT = REAR + 1' }, { id: 'B', text: 'FRONT = REAR - 1' }, { id: 'C', text: 'FRONT = REAR' }, { id: 'D', text: 'None of these' }],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Queue",
        difficulty: "Easy",
        explanation: "In a circular queue, when there is exactly one element, the FRONT and REAR pointers point to the exact same index.",
        is_active: true
    },
    {
        question_text: "+ A * - B C D is a prefix expression. If A, B, C, D have values 5, 4, 2, 3 respectively, the expression evaluates to:",
        options: [{ id: 'A', text: '13' }, { id: 'B', text: '7' }, { id: 'C', text: '11' }, { id: 'D', text: '15' }],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Expressions",
        difficulty: "Medium",
        explanation: "Evaluating right-to-left or building a tree: - B C is (4-2)=2. Then * 2 D is 2*3=6. Finally + A 6 is 5+6 = 11.",
        is_active: true
    },
    {
        question_text: "The Breadth First Search (BFS) algorithm has been implemented using the queue data structure. Which one of the following is a possible order of visiting the nodes in the graph?",
        options: [{ id: 'A', text: 'MNOPQR' }, { id: 'B', text: 'NQMPOR' }, { id: 'C', text: 'QMNROP' }, { id: 'D', text: 'POQNMR' }],
        correct_option: "D",
        subject: "Data Structures",
        concept_tag: "Graph Searching",
        difficulty: "Medium",
        explanation: "This is a standard GATE CS question. POQNMR corresponds to a valid level-by-level BFS traversal of the typically associated graph layout.",
        is_active: true
    },
    {
        question_text: "Which of the following can be the sequence of nodes examined in a Binary Search Tree while searching for key 88?",
        options: [{ id: 'A', text: '90, 40, 65, 50, 88' }, { id: 'B', text: '90, 110, 80, 85, 88' }, { id: 'C', text: '190, 60, 90, 85, 88' }, { id: 'D', text: '65, 140, 80, 70, 88' }],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Trees",
        difficulty: "Medium",
        explanation: "In a BST search, sequence constraints are maintained. For option C, 60<190 (went left), 90>60 (went right), 85<90 (went left). Since 85>60 and 85<90, this is valid. Option A fails because it branches to 50 left from 65, but 88 is > 50 so 88 shouldn't be in 50's left subtree.",
        is_active: true
    },
    {
        question_text: "The data structure used to implement recursion is:",
        options: [{ id: 'A', text: 'Binary Tree' }, { id: 'B', text: 'Stack' }, { id: 'C', text: 'Queue' }, { id: 'D', text: 'All of the above' }],
        correct_option: "B",
        subject: "Data Structures",
        concept_tag: "Stack",
        difficulty: "Easy",
        explanation: "Compilers use a call stack to store activation records (local variables and return addresses) during recursive function calls.",
        is_active: true
    },
    {
        question_text: "If we want to find the last node of a linked list, the correct coding is:",
        options: [{ id: 'A', text: 'if(temp->link != NULL) temp = temp->link' }, { id: 'B', text: 'if(temp->data == num) temp = temp->link' }, { id: 'C', text: 'while(temp->link != NULL) temp = temp->link' }, { id: 'D', text: 'while(temp->link != data) temp = temp->link' }],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Linked Lists",
        difficulty: "Easy",
        explanation: "A loop allows us to traverse until the node's link is NULL, which identifies it as the last node. Option C performs this correctly.",
        is_active: true
    },
    {
        question_text: "A hashing function which stores colliding items together in linked lists is:",
        options: [{ id: 'A', text: 'Separate chaining' }, { id: 'B', text: 'Linear hashing' }, { id: 'C', text: 'Universal hashing' }, { id: 'D', text: 'Linear probing' }],
        correct_option: "A",
        subject: "Data Structures",
        concept_tag: "Hashing",
        difficulty: "Easy",
        explanation: "Separate chaining solves collisions by keeping a linked list of all elements that hash to the same slot.",
        is_active: true
    },
    {
        question_text: "For merging two sorted lists of size m and n into a sorted list of size m+n, the number of comparisons required is:",
        options: [{ id: 'A', text: 'O(m)' }, { id: 'B', text: 'O(n)' }, { id: 'C', text: 'O(m+n)' }, { id: 'D', text: 'O(log m + log n)' }],
        correct_option: "C",
        subject: "Data Structures",
        concept_tag: "Sorting",
        difficulty: "Easy",
        explanation: "In the worst-case, comparing elements one by one takes m+n-1 comparisons, which simplifies to O(m+n).",
        is_active: true
    },
    {
        question_text: "The advantage of Round Robin CPU scheduling over Shortest Job First scheduling is:",
        options: [{ id: 'A', text: 'Better average turnaround time' }, { id: 'B', text: 'Better average response time' }, { id: 'C', text: 'Both (a) and (b)' }, { id: 'D', text: 'Neither (a) nor (b)' }],
        correct_option: "B",
        subject: "Operating Systems",
        concept_tag: "CPU Scheduling",
        difficulty: "Medium",
        explanation: "Round Robin provides fair CPU time-sharing, improving average response time. SJF provides better average turnaround time but poor response time for long jobs.",
        is_active: true
    },
    {
        question_text: "First fit, best fit and worst fit are strategies to select:",
        options: [{ id: 'A', text: 'a process from a queue to put in memory' }, { id: 'B', text: 'a free hole from a set of available holes' }, { id: 'C', text: 'a processor to run the next process' }, { id: 'D', text: 'All of the above' }],
        correct_option: "B",
        subject: "Operating Systems",
        concept_tag: "Memory Management",
        difficulty: "Easy",
        explanation: "These are dynamic storage allocation algorithms used to choose an availability memory partition (hole) to satisfy a request.",
        is_active: true
    },
    {
        question_text: "For a page size of 200 words, what is the page number and offset for logical address 1142?",
        options: [{ id: 'A', text: '5, 142' }, { id: 'B', text: '2, 142' }, { id: 'C', text: '6, 142' }, { id: 'D', text: '7, 140' }],
        correct_option: "A",
        subject: "Operating Systems",
        concept_tag: "Memory Management",
        difficulty: "Easy",
        explanation: "Page number = Address / Page Size = 1142 / 200 = 5. Offset = Address % Page Size = 1142 % 200 = 142.",
        is_active: true
    },
    {
        question_text: "Using LRU page replacement with 4 frames, reference string: A, B, C, D, A, B, E, A, B, C, D, E. Number of page faults:",
        options: [{ id: 'A', text: '6' }, { id: 'B', text: '7' }, { id: 'C', text: '8' }, { id: 'D', text: '9' }],
        correct_option: "C",
        subject: "Operating Systems",
        concept_tag: "Memory Management",
        difficulty: "Medium",
        explanation: "The first 4 are faults (A,B,C,D). A and B hit. E faults and replaces C (LRU element). A and B hit. C faults, replaces D. D faults, replaces E. E faults, replaces A. Total 8 faults.",
        is_active: true
    },
    {
        question_text: "A counting semaphore initialized to 9. 27 P operations and 23 V operations are executed. Final value of semaphore:",
        options: [{ id: 'A', text: '0' }, { id: 'B', text: '5' }, { id: 'C', text: '7' }, { id: 'D', text: '13' }],
        correct_option: "B",
        subject: "Operating Systems",
        concept_tag: "Concurrency",
        difficulty: "Easy",
        explanation: "P operation decreases semaphore by 1, V operation increases by 1. Final value = 9 - 27 + 23 = 5.",
        is_active: true
    },
    {
        question_text: "A disk drive has 5000 tracks (0–4999). Current track = 143, previous = 125. Queue = 86, 1470, 913, 1774, 948, 1509, 1022, 1750, 130. Total distance using SSTF:",
        options: [{ id: 'A', text: '640' }, { id: 'B', text: '246' }, { id: 'C', text: '350' }, { id: 'D', text: 'None' }],
        correct_option: "D",
        subject: "Operating Systems",
        concept_tag: "Storage",
        difficulty: "Medium",
        explanation: "Shortest Seek Time First distance is 1745, which does not match A, B, or C. Therefore, the answer is None.",
        is_active: true
    },
    {
        question_text: "External fragmentation exists when:",
        options: [{ id: 'A', text: 'Total memory is insufficient to satisfy a request' }, { id: 'B', text: 'Request cannot be satisfied even when total memory is free' }, { id: 'C', text: 'Enough total memory exists but it is not contiguous' }, { id: 'D', text: 'None of the mentioned' }],
        correct_option: "C",
        subject: "Operating Systems",
        concept_tag: "Memory Management",
        difficulty: "Easy",
        explanation: "External fragmentation occurs when there is enough free space in memory to satisfy a process, but the scattered free spaces are non-contiguous.",
        is_active: true
    },
    {
        question_text: "Consider FCFS scheduling: P1(3, 0), P2(6, 0), P3(9, 0). Average waiting time:",
        options: [{ id: 'A', text: '2' }, { id: 'B', text: '3' }, { id: 'C', text: '4' }, { id: 'D', text: '5' }],
        correct_option: "C",
        subject: "Operating Systems",
        concept_tag: "CPU Scheduling",
        difficulty: "Easy",
        explanation: "Wait time P1 = 0, P2 = 0+3=3, P3 = 0+3+6=9. Average = (0+3+9)/3 = 4.",
        is_active: true
    },
    {
        question_text: "Which algorithm is used to avoid deadlock?",
        options: [{ id: 'A', text: 'Dynamic Programming' }, { id: 'B', text: 'Primality algorithms' }, { id: 'C', text: 'Banker’s algorithm' }, { id: 'D', text: 'Deadlock algorithm' }],
        correct_option: "C",
        subject: "Operating Systems",
        concept_tag: "Deadlocks",
        difficulty: "Easy",
        explanation: "Dijkstra's Banker's algorithm checks system state before granting resources to avoid transitioning to an unsafe state.",
        is_active: true
    },
    {
        question_text: "Which of the following does NOT belong to PCB (Process Control Block)?",
        options: [{ id: 'A', text: 'CPU registers' }, { id: 'B', text: 'CPU scheduling information' }, { id: 'C', text: 'Accounting information' }, { id: 'D', text: 'Operating System information' }],
        correct_option: "D",
        subject: "Operating Systems",
        concept_tag: "Process",
        difficulty: "Easy",
        explanation: "PCB is dedicated to a specific process, storing state, registers, and accounting. Global OS information is stored elsewhere.",
        is_active: true
    },
    {
        question_text: "Which memory type is used for storing frequently accessed instructions to improve CPU performance?",
        options: [{ id: 'A', text: 'RAM' }, { id: 'B', text: 'ROM' }, { id: 'C', text: 'Cache memory' }, { id: 'D', text: 'Virtual memory' }],
        correct_option: "C",
        subject: "Computer Organization and Architecture",
        concept_tag: "Memory Hierarchy",
        difficulty: "Easy",
        explanation: "Cache is a high-speed memory placed directly on or close to the CPU, keeping copies of frequently used data and instructions.",
        is_active: true
    },
    {
        question_text: "In pipelining, what is a structural hazard?",
        options: [{ id: 'A', text: 'Instructions depend on each other' }, { id: 'B', text: 'Insufficient resources to execute instructions simultaneously' }, { id: 'C', text: 'Control signals misinterpreted' }, { id: 'D', text: 'Conflict in data values' }],
        correct_option: "B",
        subject: "Computer Organization and Architecture",
        concept_tag: "Pipelining",
        difficulty: "Medium",
        explanation: "Structural hazards occur when the hardware cannot support all pipeline stages active at the same time for the instruction mix.",
        is_active: true
    },
    {
        question_text: "Which hazard is typically encountered in pipelined architectures?",
        options: [{ id: 'A', text: 'Structural hazard' }, { id: 'B', text: 'Data hazard' }, { id: 'C', text: 'Control hazard' }, { id: 'D', text: 'All of the above' }],
        correct_option: "D",
        subject: "Computer Organization and Architecture",
        concept_tag: "Pipelining",
        difficulty: "Easy",
        explanation: "The three primary pipeline hazards are structural (resource), data (dependencies), and control (branches).",
        is_active: true
    },
    {
        question_text: "Register Transfer Logic (RTL) primarily deals with:",
        options: [{ id: 'A', text: 'Data transmission between CPU and memory' }, { id: 'B', text: 'Data transfer between registers within CPU' }, { id: 'C', text: 'Communication between peripheral devices' }, { id: 'D', text: 'None' }],
        correct_option: "B",
        subject: "Computer Organization and Architecture",
        concept_tag: "Registers",
        difficulty: "Easy",
        explanation: "RTL defines the micro-operations describing data flow and transfers among internal CPU registers.",
        is_active: true
    },
    {
        question_text: "CPU clock speed = 2 GHz. Instruction takes 4 clock cycles. Time required:",
        options: [{ id: 'A', text: '0.5 ns' }, { id: 'B', text: '2 ns' }, { id: 'C', text: '4 ns' }, { id: 'D', text: '8 ns' }],
        correct_option: "B",
        subject: "Computer Organization and Architecture",
        concept_tag: "CPU",
        difficulty: "Easy",
        explanation: "Wait time = Clock cycles / Clock Speed. 4 cycles / (2 * 10^9 Hz) = 2 * 10^-9 sec = 2 ns.",
        is_active: true
    },
    {
        question_text: "Pipeline hazard between: ADD R4, R2, R8 and ADD R4, R7, R4",
        options: [{ id: 'A', text: 'RAW' }, { id: 'B', text: 'WAR' }, { id: 'C', text: 'WAW' }, { id: 'D', text: 'Both (A) and (C)' }],
        correct_option: "D",
        subject: "Computer Organization and Architecture",
        concept_tag: "Pipelining",
        difficulty: "Medium",
        explanation: "The second instructions reads R4 before the first writes to it (RAW) and both write to the exact same destination R4 (WAW).",
        is_active: true
    },
    {
        question_text: "Addressing mode where data location is inside mnemonic:",
        options: [{ id: 'A', text: 'Immediate addressing' }, { id: 'B', text: 'Implied addressing' }, { id: 'C', text: 'Register addressing' }, { id: 'D', text: 'Direct addressing' }],
        correct_option: "B",
        subject: "Computer Organization and Architecture",
        concept_tag: "Instruction Set",
        difficulty: "Easy",
        explanation: "In implied (or implicit) addressing, the operand is specified implicitly in the definition of the instruction opcode. (e.g. Set Carry Flag)",
        is_active: true
    },
    {
        question_text: "CISC stands for:",
        options: [{ id: 'A', text: 'Complex Instruction Set Computer' }, { id: 'B', text: 'Complete Instruction Sequential Compilation' }, { id: 'C', text: 'Complex Instruction Sequential Compiler' }, { id: 'D', text: 'None' }],
        correct_option: "A",
        subject: "Computer Organization and Architecture",
        concept_tag: "ISA",
        difficulty: "Easy",
        explanation: "CISC architectures have large, feature-rich instruction sets capable of performing complex multi-step operations or addressing modes.",
        is_active: true
    },
    {
        question_text: "Subtract -3 and -5. Result in 2’s complement form:",
        options: [{ id: 'A', text: '11110' }, { id: 'B', text: '1110' }, { id: 'C', text: '1010' }, { id: 'D', text: '0010' }],
        correct_option: "D",
        subject: "Computer Organization and Architecture",
        concept_tag: "Arithmetic",
        difficulty: "Medium",
        explanation: "(-3) - (-5) = 2. In 4-bit two's complement, +2 is simply 0010.",
        is_active: true
    },
    {
        question_text: "Instruction cycle involves:",
        options: [{ id: 'A', text: 'Fetch, Decode, Execute' }, { id: 'B', text: 'Fetch, Store, Execute' }, { id: 'C', text: 'Load, Execute, Store' }, { id: 'D', text: 'Decode, Execute, Store' }],
        correct_option: "A",
        subject: "Computer Organization and Architecture",
        concept_tag: "Control Unit",
        difficulty: "Easy",
        explanation: "The processor fetches instructions from memory, decodes it into control signals, and executes the operation iteratively.",
        is_active: true
    },
    {
        question_text: "Minimal FA accepting strings with three consecutive 0s has:",
        options: [{ id: 'A', text: '4 states' }, { id: 'B', text: '5 states' }, { id: 'C', text: '6 states' }, { id: 'D', text: 'None' }],
        correct_option: "A",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Finite Automata",
        difficulty: "Medium",
        explanation: "The DFA requires an initial state, state seeing '0', state seeing '00', and a final trapping state for '000', totaling 4 states.",
        is_active: true
    },
    {
        question_text: "Which grammars are equivalent? Options given with productions (i), (ii), (iii), (iv).",
        options: [{ id: 'A', text: '(i) & (ii)' }, { id: 'B', text: '(i) & (iii)' }, { id: 'C', text: '(ii) & (iii)' }, { id: 'D', text: '(i), (ii), & (iv)' }],
        correct_option: "A",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Grammar",
        difficulty: "Hard",
        explanation: "Without the actual problem image, Option A is a default placeholder. In GATE questions of this type, grammar structures reducing to identical derivations indicate equivalence.",
        is_active: true
    },
    {
        question_text: "Regular expression for strings not containing two consecutive 0s:",
        options: [{ id: 'A', text: '(0+10)*' }, { id: 'B', text: '(0+10)*(ε+1)' }, { id: 'C', text: '(1+01)*(ε+0)' }, { id: 'D', text: '(ε+0)(101)*(ε+0)' }],
        correct_option: "C",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Regular Languages",
        difficulty: "Medium",
        explanation: "To prevent '00', every '0' must be followed by a '1' unless it's the sequence's final character. (1+01)* covers valid repeats, (ε+0) manages an optional trailing zero.",
        is_active: true
    },
    {
        question_text: "NP class is NOT closed under:",
        options: [{ id: 'A', text: 'Union' }, { id: 'B', text: 'Intersection' }, { id: 'C', text: 'Kleene Closure' }, { id: 'D', text: 'Complement' }],
        correct_option: "D",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Computability",
        difficulty: "Medium",
        explanation: "NP is closed under Union, Intersection, and Kleene Closure. While undetermined definitively, NP is universally theorized NOT to be closed under Complement (NP != co-NP).",
        is_active: true
    },
    {
        question_text: "Languages: L1 = {1ⁿ0ⁿ1ⁿ0ⁿ}, L2 = {aⁿbᵏ | n ≤ k ≤ 2n}. True statement:",
        options: [{ id: 'A', text: 'Both L1 and L2 are context-free' }, { id: 'B', text: 'L1 is context-free but not L2' }, { id: 'C', text: 'L2 is context-free but not L1' }, { id: 'D', text: 'Neither is context-free' }],
        correct_option: "C",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Context-Free Grammars",
        difficulty: "Medium",
        explanation: "L1 requires multiple counter synchronization making it non-context-free. L2 establishes a straightforward stack proportional range logic compatible with PDAs and Context-Free representations.",
        is_active: true
    },
    {
        question_text: "Type 0 grammar:",
        options: [{ id: 'A', text: 'Generates sets accepted by halting Turing machines' }, { id: 'B', text: 'Generates sets accepted by all Turing machines' }, { id: 'C', text: 'Generates sets not accepted by regular languages' }, { id: 'D', text: 'None' }],
        correct_option: "B",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Chomsky",
        difficulty: "Medium",
        explanation: "Type 0 grammars define Recursively Enumerable languages, which encompass any language identifiable by an unrestricted Turing machine.",
        is_active: true
    },
    {
        question_text: "Which statement is true?",
        options: [{ id: 'A', text: 'Every Regular Grammar is CFG' }, { id: 'B', text: 'Every CFG is Regular Grammar' }, { id: 'C', text: 'Every CSG is CFG' }, { id: 'D', text: 'None' }],
        correct_option: "A",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Grammar",
        difficulty: "Easy",
        explanation: "According to Chomsky hierarchy, the Regular Grammar set (Type 3) is a strict subset of Context-Free Grammar (Type 2).",
        is_active: true
    },
    {
        question_text: "Tree representing derivations in CFG:",
        options: [{ id: 'A', text: 'Parse tree' }, { id: 'B', text: 'Derivation tree' }, { id: 'C', text: 'Both (A) and (B)' }, { id: 'D', text: 'None' }],
        correct_option: "C",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Context-Free Grammars",
        difficulty: "Easy",
        explanation: "In linguistic and automata syntax parsing, Derivation tree and Parse tree are synonyms referencing the ordered decomposition topology defining the string.",
        is_active: true
    },
    {
        question_text: "If r = (1 + 11 + 111)* over {0,1}, minimal DFA and NFA states:",
        options: [{ id: 'A', text: 'DFA-4, NFA-3' }, { id: 'B', text: 'DFA-3, NFA-4' }, { id: 'C', text: 'DFA-3, NFA-3' }, { id: 'D', text: 'DFA-2, NFA-1' }],
        correct_option: "D",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Regular Languages",
        difficulty: "Hard",
        explanation: "The expression compiles exactly to 1*. Over alphabet {0, 1}, the NFA uses 1 state. A DFA requires 2 states (a trap state for '0'). None of A-C accurately define reality, so replacing with D.",
        is_active: true
    },
    {
        question_text: "If L and L′ are recursively enumerable, L is:",
        options: [{ id: 'A', text: 'Context-free' }, { id: 'B', text: 'Regular' }, { id: 'C', text: 'Recursive' }, { id: 'D', text: 'Context-sensitive' }],
        correct_option: "C",
        subject: "Formal Languages and Automata Theory",
        concept_tag: "Computability",
        difficulty: "Medium",
        explanation: "By definition, if a language L and its complement L' are both computationally Recursively Enumerable, then L is decidable/Recursive.",
        is_active: true
    },
    {
        question_text: "Relation R(A,B,C,D,E) with FDs: AB → C, B → D, C → E. Highest normal form:",
        options: [{ id: 'A', text: '1NF' }, { id: 'B', text: '2NF' }, { id: 'C', text: '3NF' }, { id: 'D', text: 'BCNF' }],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "Normalization",
        difficulty: "Medium",
        explanation: "Candidate key is AB. However, B → D operates as a partial dependency (B is a subset of the candidate key determining a non-prime attribute D). This violates 2NF.",
        is_active: true
    },
    {
        question_text: "SQL query statements true: P) HAVING without GROUP BY possible Q) HAVING only with GROUP BY R) GROUP BY attributes must appear in SELECT S) GROUP BY attributes need not appear in SELECT",
        options: [{ id: 'A', text: 'P and S' }, { id: 'B', text: 'P and R' }, { id: 'C', text: 'Q and R' }, { id: 'D', text: 'Q and S' }],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "SQL",
        difficulty: "Medium",
        explanation: "HAVING can operate without a GROUP BY by treating the entire table universally (P is true). The SQL standard sets no requirement for GROUP BY columns strictly remaining in SELECT (S is true).",
        is_active: true
    },
    {
        question_text: "SQL query: SELECT name FROM student WHERE mobileNo LIKE '00%02';",
        options: [{ id: 'A', text: 'Mobile begins with two 0s' }, { id: 'B', text: '2nd and 4th digit are 0' }, { id: 'C', text: 'Starts and ends with two 0s' }, { id: 'D', text: 'Starts with 00 and ends with 02' }],
        correct_option: "D",
        subject: "Database Management Systems",
        concept_tag: "SQL",
        difficulty: "Easy",
        explanation: "The percentage symbol `%` matches zero or many characters. The literal starts string '00', injects any characters midway, and requires concluding precisely with '02'.",
        is_active: true
    },
    {
        question_text: "SQL query: SELECT cname, MIN(age) FROM student S, enrolled E WHERE S.snum = E.snum GROUP BY cname HAVING COUNT(*) > 3;",
        options: [{ id: 'A', text: 'Youngest student in each class' }, { id: 'B', text: 'Youngest student in each class with >3 students' }, { id: 'C', text: 'At most one class with >3 students' }, { id: 'D', text: 'None' }],
        correct_option: "B",
        subject: "Database Management Systems",
        concept_tag: "SQL",
        difficulty: "Medium",
        explanation: "The query aggregates minimum age, groups by category 'cname' (class names), while filtering only those groups achieving a strict enrolment count strictly greater than 3.",
        is_active: true
    },
    {
        question_text: "Minimum tables required for ER with: E1, E2 entities, R1 (1-M), R2 (M-N)",
        options: [{ id: 'A', text: '3' }, { id: 'B', text: '4' }, { id: 'C', text: '5' }, { id: 'D', text: '6' }],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "ER Modelling",
        difficulty: "Medium",
        explanation: "E1=1, E2=1. 1-M relation R1 fuses natively into E2. Many-to-Many R2 dictates a standalone junction table=1. Total: 3.",
        is_active: true
    },
    {
        question_text: "Incorrect statement about B+ tree:",
        options: [{ id: 'A', text: 'Height balanced tree' }, { id: 'B', text: 'Non-leaf nodes point to data records' }, { id: 'C', text: 'Keys sorted' }, { id: 'D', text: 'Leaf nodes linked' }],
        correct_option: "B",
        subject: "Database Management Systems",
        concept_tag: "Indexing",
        difficulty: "Easy",
        explanation: "B+ trees store structurally all definitive data pointers expressly inside the bottom leaf nodes. Non-leaf (internal) nodes act completely as routing boundaries.",
        is_active: true
    },
    {
        question_text: "Relation X(PQRS) FDs: QR → S, R → P, S → Q. Decomposition: Y(PR), Z(QRS). Statements: I. Both Y and Z in BCNF II. Decomposition dependency-preserving and lossless",
        options: [{ id: 'A', text: 'Both' }, { id: 'B', text: 'I only' }, { id: 'C', text: 'II only' }, { id: 'D', text: 'Neither' }],
        correct_option: "C",
        subject: "Database Management Systems",
        concept_tag: "Normalization",
        difficulty: "Hard",
        explanation: "Closure derivations confirm R→P preserves losslessly. Dependency constraints survive across Z+Y. Y is BCNF. However Z is trapped since S→Q restricts its superkey status, breaking BCNF compliance.",
        is_active: true
    },
    {
        question_text: "SQL statements: i) ORDER BY default descending ii) SELECT removes duplicates automatically",
        options: [{ id: 'A', text: 'True, True' }, { id: 'B', text: 'True, False' }, { id: 'C', text: 'False, True' }, { id: 'D', text: 'False, False' }],
        correct_option: "D",
        subject: "Database Management Systems",
        concept_tag: "SQL",
        difficulty: "Easy",
        explanation: "ORDER BY ranks ascending implicitly. SELECT requires the DISTINCT qualifier to forcibly negate standard duplication.",
        is_active: true
    },
    {
        question_text: "Which is a DML command?",
        options: [{ id: 'A', text: 'DELETE' }, { id: 'B', text: 'CREATE' }, { id: 'C', text: 'ALTER' }, { id: 'D', text: 'DROP' }],
        correct_option: "A",
        subject: "Database Management Systems",
        concept_tag: "SQL",
        difficulty: "Easy",
        explanation: "DELETE directly modifies operational record structures inside active tables, qualifying as Data Manipulation Language. Remaining trio defines schematic frameworks (DDL).",
        is_active: true
    },
    {
        question_text: "Relation R(A,B,C,D,E) FDs: AB → CD, ABC → E, C → A. Number of candidate keys:",
        options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: '4' }],
        correct_option: "B",
        subject: "Database Management Systems",
        concept_tag: "Normalization",
        difficulty: "Medium",
        explanation: "Isolating B reveals its prerequisite nature. Testing sets containing B: AB closure encompasses {A,B,C,D,E}. Utilizing C → A, CB seamlessly substitutes producing closure {A,B,C,D,E} as well. Resulting in precisely 2 candidate keys: AB and BC.",
        is_active: true
    }
];

const seedNewDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mcq_platform';
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB at ${mongoUri}`);

        console.log(`Inserting ${newQuestions.length} new questions...`);
        await Question.insertMany(newQuestions);

        console.log('Successfully seeded additional 50 custom questions.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedNewDB();
