// client/src/data/lessons.ts - DEFINITIVE CONTENT (V7 Ultimate System Rebuild)
export interface LessonData {
    id: number;
    title: string;
    description: string;
    chapter: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // in minutes
    isPremium: boolean;
    content: {
        steps: LessonStep[];
    };
    codeTemplate?: string; // Optional: for general lesson, specific templates in steps
}

export interface LessonStep {
    id: number;
    title: string;
    challenge: string;
    expectedCodePattern?: { rust?: string; python?: string; }; // Made optional for narrative/quiz lessons
    successMessage: string;
    failureMessage: string;
    initialCodeTemplateKey: string; // Key from code-templates.ts
    visualEffectTrigger?: 'networkPing' | 'sparkle' | 'coinFall' | 'messageBoard' | 'transaction' | 'dataStream' | 'blueprint' | 'dystopianCity' | 'cypherpunkSymbol' | 'codeShield' | 'digitalGhost' | 'bankBreaking' | 'decentralizedNodes' | 'blockchainBlocks' | 'smartContractGears' | 'digitalMarketplace' | 'glowingPath'; // New visual triggers
    hintMessage?: string;
    isCodingChallenge: boolean; // Flag to indicate if this step requires coding
    quiz?: { // NEW: Optional quiz for narrative steps
        type: 'multiple-choice' | 'true-false' | 'text-input';
        question: string;
        options?: string[]; // For multiple-choice/true-false
        correctAnswer: string | boolean; // Text for text-input, boolean for true-false
    };
    videoUrl?: string; // NEW: Optional video URL for narrative steps
}

export const lessons: LessonData[] = [
    // --- NEW: Module 0: Prologue - The Digital Frontier's Code of Honor (Lesson ID 1) ---
    {
        id: 1,
        title: "Prologue: The Digital Frontier's Code of Honor",
        description: "Uncover the forgotten history of digital freedom.",
        chapter: 0,
        difficulty: 'beginner',
        estimatedTime: 20,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Echoes from the Old World",
                    challenge: `Before the blockchain sun rose over this digital frontier, the Old World suffered under the thumb of centralized powers. Data was spied on, money controlled, and freedom often felt like a myth whispered in hushed tones. But some dreamed of a new kind of freedom – built not with guns, but with **code**.\n\n**Reflection:** What aspects of the 'Old World' (digital or otherwise) make you value privacy and control over your own data?`,
                    successMessage: "Understood. The seeds of rebellion are often sown in the shadows of control. Click 'Next Step' to continue.",
                    failureMessage: "Please take a moment to reflect on the prompt. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson0_1',
                    visualEffectTrigger: 'dystopianCity',
                    hintMessage: "This step is about setting the stage. Read the narrative, think about the question, and click 'Deploy' when you're ready to proceed.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'text-input',
                        question: "Type 'Freedom' to confirm you're ready to learn about the digital frontier.",
                        correctAnswer: "Freedom",
                    },
                    videoUrl: "https://www.youtube.com/embed/P-2R-5_Bf7k?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0" // Placeholder, replace with relevant video
                },
                {
                    id: 2,
                    title: "The Whispers of Rebellion - Rise of the Cypherpunks",
                    challenge: `In the shadows of early digital networks, a band of rebels emerged – the **Cypherpunks**. They weren't outlaws in the traditional sense, but digital freedom fighters who believed that cryptography, not legislation, was the key to true liberty. They met not in saloons, but in email lists, forging their manifestos in lines of encrypted text.\n\n**Reflection:** If code is a form of speech, and privacy is essential for free speech, how does strong cryptography protect democratic values?`,
                    successMessage: "Confirmed. The digital whispers grew into a chorus. Click 'Next Step' to continue.",
                    failureMessage: "Please reflect on the concept of code and freedom. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson0_2',
                    visualEffectTrigger: 'cypherpunkSymbol',
                    hintMessage: "The Cypherpunks believed that privacy could only be guaranteed by mathematics, not by human promises. Think about how unbreakable math gives you control.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'multiple-choice',
                        question: "What was the primary tool Cypherpunks believed was key to liberty?",
                        options: ["Laws", "Debates", "Cryptography", "Speeches"],
                        correctAnswer: "Cryptography",
                    },
                },
            ]
        },
    },
    // --- NEW: Module 1: The Manifestos - Code is Law, Privacy is Power (Lesson ID 2) ---
    {
        id: 2,
        title: "The Manifestos: Code is Law, Privacy is Power",
        description: "Dive into the founding texts of the digital freedom movement.",
        chapter: 1,
        difficulty: 'beginner',
        estimatedTime: 25,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "The Cypherpunk Manifesto: Code, Not Trust",
                    challenge: `Eric Hughes, a quiet frontier coder, penned the words that became our first law: 'Cypherpunks write code.' He argued that laws and regulations could never truly protect our freedom in the digital realm. Only **unbreakable code** could truly guarantee privacy and liberty. Our very first step in this adventure is to understand this fundamental truth.\n\n**Reflection:** Why do cypherpunks believe that code is a stronger guarantee of privacy than laws or regulations?`,
                    successMessage: "Manifesto understood. Trust in code is the first principle. Click 'Next Step' to continue.",
                    failureMessage: "Consider the inherent limitations of human promises versus mathematical guarantees. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson1_1',
                    visualEffectTrigger: 'codeShield',
                    hintMessage: "Laws can be broken or changed by people. Code, if written correctly, executes exactly as intended, every time.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'true-false',
                        question: "True or False: Cypherpunks primarily relied on legislation to achieve privacy.",
                        correctAnswer: false,
                    },
                },
                {
                    id: 2,
                    title: "The Crypto Anarchist Manifesto: Unstoppable Liberty",
                    challenge: `Timothy C. May, a figure shrouded in digital mist, took the vision even further. His 'Crypto Anarchist Manifesto' painted a future where cryptography would dissolve the very power of the state, creating truly free and anonymous markets. This vision of an unstoppable, censorship-resistant digital realm is where the true heart of Web3 beats.\n\n**Reflection:** How does an 'anonymous, distributed digital cash system' fulfill the vision of a truly free market without central control?`,
                    successMessage: "Vision embraced. A future without central gatekeepers. Click 'Next Step' to continue.",
                    failureMessage: "Think about how intermediaries can stop or control transactions. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson1_2',
                    visualEffectTrigger: 'digitalGhost',
                    hintMessage: "If no single person or company can control the money, then no one can stop you from using it. That's true freedom in action.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'text-input',
                        question: "What concept describes a market where transactions cannot be stopped by a central authority?",
                        correctAnswer: "Censorship Resistance",
                    },
                },
            ]
        },
    },
    // --- NEW: Module 2: The Genesis Block - Bitcoin's Cypherpunk Legacy (Lesson ID 3) ---
    {
        id: 3,
        title: "The Genesis Block: Bitcoin's Cypherpunk Legacy",
        description: "Explore how Bitcoin brought cypherpunk ideals to life.",
        chapter: 2,
        difficulty: 'beginner',
        estimatedTime: 30,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "The Fiat Chains - Why Bitcoin Was Born",
                    challenge: `The Old World's money was a tool of control. Central banks printed currency at will, inflating away the value of honest work. Governments could freeze accounts, monitor every transaction, and deny financial services to those who dared to dissent. The system was built on trust – trust in institutions that had repeatedly betrayed that trust.\n\n**Reflection:** How do centralized financial systems limit individual freedom and economic sovereignty?`,
                    successMessage: "Understanding confirmed. The chains of fiat were binding indeed. Click 'Next Step' to continue.",
                    failureMessage: "Consider how central control over money affects personal liberty. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson2_1',
                    visualEffectTrigger: 'bankBreaking',
                    hintMessage: "When someone else controls your money, they control your choices. Think about what happens when banks freeze accounts or governments debase currency.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'multiple-choice',
                        question: "What is one major problem with centralized fiat currency systems?",
                        options: ["High transaction fees", "Government control and surveillance", "Too many options", "Complex user interfaces"],
                        correctAnswer: "Government control and surveillance",
                    },
                },
                {
                    id: 2,
                    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
                    challenge: `In 2008, an anonymous figure known only as Satoshi Nakamoto published a white paper that would change the world: 'Bitcoin: A Peer-to-Peer Electronic Cash System.' This wasn't just another payment system – it was the first practical implementation of the cypherpunk dream. No central authority, no trusted third parties, just pure mathematical certainty.\n\n**Reflection:** How does Bitcoin's design eliminate the need for trust in human institutions?`,
                    successMessage: "Bitcoin's revolutionary nature understood. Peer-to-peer freedom achieved. Click 'Next Step' to continue.",
                    failureMessage: "Think about how mathematical proofs replace the need for human trust. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson2_2',
                    visualEffectTrigger: 'decentralizedNodes',
                    hintMessage: "Bitcoin uses cryptographic proof instead of trust. Every transaction is verified by math, not by a bank or government.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'true-false',
                        question: "True or False: Bitcoin requires a central authority to validate transactions.",
                        correctAnswer: false,
                    },
                },
                {
                    id: 3,
                    title: "The Blockchain: A Public, Immutable Ledger",
                    challenge: `The blockchain was Bitcoin's secret weapon – a public ledger that anyone could verify but no one could tamper with. Every transaction, forever recorded in digital stone. This wasn't just transparency; this was radical accountability. For the first time in history, money itself became incorruptible.\n\n**Reflection:** How does a public, immutable ledger serve the principles of transparency and accountability?`,
                    successMessage: "Blockchain's power understood. Immutability achieved through cryptography. Click 'Next Step' to continue.",
                    failureMessage: "Consider how permanent, public records prevent fraud and corruption. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson2_3',
                    visualEffectTrigger: 'blockchainBlocks',
                    hintMessage: "When every transaction is public and permanent, it becomes impossible to hide corruption or create money from thin air.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'text-input',
                        question: "What property of blockchain makes it impossible to alter past transactions?",
                        correctAnswer: "Immutability",
                    },
                },
            ]
        },
    },
    // --- NEW: Module 3: The Crossroads - Web3's Path and Future (Lesson ID 4) ---
    {
        id: 4,
        title: "The Crossroads: Web3's Path and Future",
        description: "Navigate the promises and perils of the decentralized web.",
        chapter: 3,
        difficulty: 'beginner',
        estimatedTime: 25,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Ethereum & Smart Contracts: Expanding the Vision",
                    challenge: `Ethereum took Bitcoin's foundation and built a world computer on top of it. Smart contracts – code that executes automatically without human intervention – brought the cypherpunk dream of 'code is law' to life. But with great power came great complexity, and not all who entered this new frontier understood the responsibility that came with it.\n\n**Reflection:** How do smart contracts embody the cypherpunk principle of 'code is law'?`,
                    successMessage: "Smart contracts understood. Code becomes unstoppable law. Click 'Next Step' to continue.",
                    failureMessage: "Think about how self-executing code eliminates the need for human enforcement. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson3_1',
                    visualEffectTrigger: 'smartContractGears',
                    hintMessage: "Smart contracts execute exactly as programmed, with no possibility of human interference or interpretation.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'multiple-choice',
                        question: "What makes smart contracts 'smart'?",
                        options: ["They use AI", "They execute automatically", "They're written by experts", "They're very complex"],
                        correctAnswer: "They execute automatically",
                    },
                },
                {
                    id: 2,
                    title: "The Rise of DeFi & NFTs: Promises and Perils",
                    challenge: `As Web3 grew, new innovations emerged: Decentralized Finance (DeFi) promised to recreate the entire financial system without banks, while Non-Fungible Tokens (NFTs) offered true digital ownership. But success brought new challenges – many projects became centralized in practice, speculation overtook utility, and the original cypherpunk values sometimes got lost in the gold rush.\n\n**Reflection:** How can the Web3 space maintain its commitment to decentralization while achieving mainstream adoption?`,
                    successMessage: "The challenges of growth understood. Balance is key to true progress. Click 'Next Step' to continue.",
                    failureMessage: "Consider the tension between growth and principles in emerging technologies. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson3_2',
                    visualEffectTrigger: 'digitalMarketplace',
                    hintMessage: "Success can sometimes corrupt original ideals. The challenge is growing while staying true to founding principles.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'true-false',
                        question: "True or False: All Web3 projects successfully maintain decentralization as they grow.",
                        correctAnswer: false,
                    },
                },
                {
                    id: 3,
                    title: "The Path Forward: Realigning with the Ethos",
                    challenge: `Now you stand at the crossroads. The cypherpunk ethos that started this revolution calls to you: Build systems that are truly decentralized. Protect privacy by design. Create tools that empower individuals, not institutions. As a Solana developer, you have the power to shape the future of this digital frontier. The question is: Will you build for freedom or for control?\n\n**Reflection:** How will you apply cypherpunk principles in your own development work?`,
                    successMessage: "The path is clear. You are ready to build the future. Welcome to Solana development!",
                    failureMessage: "Take a moment to consider your role as a builder in this movement. Click 'Deploy' to confirm understanding.",
                    initialCodeTemplateKey: 'ethos_lesson3_3',
                    visualEffectTrigger: 'glowingPath',
                    hintMessage: "Every line of code you write is a choice between freedom and control. Choose wisely.",
                    isCodingChallenge: false,
                    quiz: {
                        type: 'text-input',
                        question: "Complete this cypherpunk principle: 'Every line of code is a choice between ______ and control.'",
                        correctAnswer: "freedom",
                    },
                },
            ]
        },
    },
    // --- TECHNICAL LESSONS START HERE (Lesson ID 5+) ---
    // --- Module 4: Ranch Management - Your First Solana Program (Lesson ID 5) ---
    {
        id: 5,
        title: "Ranch Management: Your First Solana Program",
        description: "Build a basic ranch management system using Anchor framework.",
        chapter: 4,
        difficulty: 'beginner',
        estimatedTime: 45,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Initialize Ranch Owner",
                    challenge: "Set up the basic ranch structure and assign ownership. Your ranch needs an owner to manage it properly.",
                    expectedCodePattern: {
                        rust: "ranch.owner = ctx.accounts.owner.key();",
                        python: "ranch.owner = owner.key()"
                    },
                    successMessage: "Great! You've successfully assigned an owner to your ranch. Every decentralized system needs clear ownership.",
                    failureMessage: "Make sure to assign the owner's public key to the ranch.owner field.",
                    initialCodeTemplateKey: 'ranch_management_initial',
                    visualEffectTrigger: 'sparkle',
                    hintMessage: "Remember to set ranch.owner = ctx.accounts.owner.key() in Rust, or ranch.owner = owner.key() in Python.",
                    isCodingChallenge: true
                },
                {
                    id: 2,
                    title: "Program Derived Address (PDA)",
                    challenge: "Implement a PDA for your ranch account to ensure each user has one unique ranch.",
                    expectedCodePattern: {
                        rust: "seeds = [b\"ranch\", owner.key().as_ref()], bump",
                        python: "seeds=[b\"ranch\", bytes(owner.key())], bump=bump"
                    },
                    successMessage: "Excellent! You've mastered PDAs - the foundation of secure Solana programs.",
                    failureMessage: "Make sure to implement the PDA with the correct seeds and bump.",
                    initialCodeTemplateKey: 'ranch_management_step1_complete',
                    visualEffectTrigger: 'dataStream',
                    hintMessage: "PDAs use seeds to generate deterministic addresses. Use [b\"ranch\", owner.key().as_ref()] as seeds.",
                    isCodingChallenge: true
                },
                {
                    id: 3,
                    title: "Ranch Upgrades",
                    challenge: "Add upgrade functionality to improve your ranch over time.",
                    expectedCodePattern: {
                        rust: "ranch.level += 1;",
                        python: "ranch.level += 1"
                    },
                    successMessage: "Perfect! Your ranch can now grow and evolve. Progress is the key to success.",
                    failureMessage: "Implement the upgrade logic by incrementing the ranch level.",
                    initialCodeTemplateKey: 'ranch_management_step2_complete',
                    visualEffectTrigger: 'blueprint',
                    hintMessage: "Increment the ranch level to show progression: ranch.level += 1",
                    isCodingChallenge: true
                }
            ]
        }
    },
    // --- Module 5: Token Economics - SPL Token Integration (Lesson ID 6) ---
    {
        id: 6,
        title: "Token Economics: SPL Token Integration",
        description: "Create and manage SPL tokens for your ranch economy.",
        chapter: 5,
        difficulty: 'intermediate',
        estimatedTime: 60,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Create Ranch Token",
                    challenge: "Set up your own SPL token to power the ranch economy.",
                    expectedCodePattern: {
                        rust: "token::mint_to",
                        python: "mint_to"
                    },
                    successMessage: "Outstanding! You've created your first SPL token. Economic sovereignty achieved!",
                    failureMessage: "Make sure to use the token::mint_to instruction to create tokens.",
                    initialCodeTemplateKey: 'token_economics_initial',
                    visualEffectTrigger: 'coinFall',
                    hintMessage: "Use the mint_to instruction to create new tokens for your ranch economy.",
                    isCodingChallenge: true
                },
                {
                    id: 2,
                    title: "Token Transfer System",
                    challenge: "Implement a system to transfer tokens between accounts.",
                    expectedCodePattern: {
                        rust: "token::transfer",
                        python: "transfer"
                    },
                    successMessage: "Excellent! Token transfers are working. Commerce can now flow freely.",
                    failureMessage: "Implement the token transfer functionality using the transfer instruction.",
                    initialCodeTemplateKey: 'token_economics_step1_complete',
                    visualEffectTrigger: 'transaction',
                    hintMessage: "Use the transfer instruction to move tokens between accounts.",
                    isCodingChallenge: true
                },
                {
                    id: 3,
                    title: "Staking Mechanism",
                    challenge: "Create a staking system where users can lock tokens for rewards.",
                    expectedCodePattern: {
                        rust: "stake_account.amount = amount;",
                        python: "stake_account.amount = amount"
                    },
                    successMessage: "Perfect! Staking implemented. Passive income through code - the cypherpunk dream!",
                    failureMessage: "Set up the staking logic by tracking the staked amount.",
                    initialCodeTemplateKey: 'token_economics_step2_complete',
                    visualEffectTrigger: 'networkPing',
                    hintMessage: "Track the staked amount in the stake_account structure.",
                    isCodingChallenge: true
                }
            ]
        }
    }
];