// client/src/data/lessons.ts - DEFINITIVE CONTENT (COPY THIS ENTIRE BLOCK)
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
    expectedCodePattern: { rust?: string; python?: string; }; // Regex string
    successMessage: string;
    failureMessage: string;
    initialCodeTemplateKey: string; // Key from code-templates.ts
    visualEffectTrigger?: 'networkPing' | 'sparkle' | 'coinFall' | 'messageBoard' | 'transaction' | 'dataStream' | 'blueprint';
    hintMessage?: string;
}

export const lessons: LessonData[] = [
    {
        id: 1, // Lesson 1: Solana Basics & Wallet Setup
        title: "Solana Basics & Wallet Setup",
        description: "Learn the fundamentals of Solana and set up your Web3 wallet",
        chapter: 1,
        difficulty: 'beginner',
        estimatedTime: 30,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Ping the Blockchain",
                    challenge: "Write `get_network_status()` to check Devnet health.",
                    expectedCodePattern: { rust: 'get_network_status\\(\\)', python: 'get_network_status\\(\\)' },
                    successMessage: "Network Status: Connected! Ping: {ping}ms | Current Slot: {slot}",
                    failureMessage: "Command not recognized. Ensure you typed `get_network_status()` exactly.",
                    initialCodeTemplateKey: 'default',
                    visualEffectTrigger: 'networkPing',
                    hintMessage: "Remember, the network status command is a simple function call. Look for a function that doesn't require any arguments!"
                },
            ]
        },
    },
    {
        id: 2, // Lesson 2: Creating Your Ranch Account
        title: "Creating Your Ranch Account",
        description: "Build your first Solana program to manage ranch data",
        chapter: 2,
        difficulty: 'beginner',
        estimatedTime: 45,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Define Ranch Owner Field",
                    challenge: "Your ranch needs an owner! In the `Ranch` struct (Rust) or `Ranch` class (Python), add a `pubkey` field named `owner`. This will identify who controls the ranch. Don't forget the comma for Rust!",
                    expectedCodePattern: { rust: 'pub\\s+owner:\\s*Pubkey,', python: 'owner:\\s*Pubkey' },
                    successMessage: "Excellent! The `owner` field has been added. Your ranch now knows who its rightful owner is!",
                    failureMessage: "Not quite. Make sure you've added 'pub owner: Pubkey,' (Rust) or 'owner: Pubkey' (Python) exactly inside the Ranch definition. Check for typos and correct capitalization!",
                    initialCodeTemplateKey: 'ranch_management_initial',
                    visualEffectTrigger: 'blueprint',
                    hintMessage: "Think about Rust structs or Python classes. You need to add a line that declares a public key variable named 'owner' within your 'Ranch' data structure."
                },
                {
                    id: 2,
                    title: "Initialize Owner in `initialize_ranch`",
                    challenge: "Now, inside the `initialize_ranch` function, assign the `owner` field of your `ranch` account to the `ctx.accounts.owner.key()` (Rust) or `owner.key()` (Python). Remember `ranch.owner = ctx.accounts.owner.key();` or `ranch.owner = owner.key()`.",
                    expectedCodePattern: { rust: 'ranch\\.owner\\s*=\\s*ctx\\.accounts\\.owner\\.key\\(\\);', python: 'ranch\\.owner\\s*=\\s*owner\\.key\\(\\)' },
                    successMessage: "Owner successfully initialized! Your ranch deed is now registered to you!",
                    failureMessage: "The owner assignment is incorrect. Double-check the syntax for assigning the owner's key to the ranch account. Hint: Look at the `ctx.accounts.owner` context in Rust or `owner` parameter in Python.",
                    initialCodeTemplateKey: 'ranch_management_step1_complete',
                    visualEffectTrigger: 'sparkle',
                    hintMessage: "You need to set the 'owner' field of your 'ranch' variable to the public key of the user who's calling this program. In Rust, you'll use `ctx.accounts.owner.key()`; in Python, `owner.key()`."
                },
                {
                    id: 3,
                    title: "Programmatic Ownership: Securing Your Ranch with a Program Derived Address (PDA)",
                    challenge: `Welcome, digital homesteader! In this decentralized frontier, we value true ownership and privacy. Unlike the old world where deeds were on paper in a dusty office, here, your ranch deed can be controlled by pure code! This is the essence of **cypher-punk** – using cryptography and decentralized tech to protect privacy and freedom.
                    Today, we're diving into **Program Derived Addresses (PDAs)**. Imagine your ranch deed isn't owned by a specific wallet with a private key, but by a special, unhackable 'strongbox' that *only your ranch program can open*. This strongbox address is *derived* from your program's ID and some unique 'seeds' (like a secret password) and a 'bump' (a special number to make sure it's valid). This makes your ranch truly **decentralized** and secure, giving control to the smart contract itself, not a person's key.

                    **Your Task:**
                    1.  In the \`InitializeRanch\` struct (Rust) or function definition (Python), locate the \`#[account(...)]\` attribute for your \`ranch\` account.
                    2.  **Add a \`seeds\` argument** to this attribute. For the ranch, the seeds will be the byte literal \`b"ranch"\` and the owner's public key (\`owner.key().as_ref()\` in Rust, \`owner\` in Python).
                    3.  **Add a \`bump\` argument** to this attribute. This is a special nonce that ensures the PDA is valid.`,
                    expectedCodePattern: {
                        rust: 'seeds\\s*=\\s*\\[b"ranch",\\s*owner\\.key\\(\\)\\.as_ref\\(\\)\\]\\s*,\\s*bump',
                        python: 'seeds=\\[\'ranch\',\\s*owner\\]\\s*,\\s*bump'
                    },
                    successMessage: "Fantastic! Your ranch account is now a true Program Derived Address (PDA)! Its deed is safely locked away, controlled by your program, not a private key. You've embraced programmatic ownership!",
                    failureMessage: "Not quite. Double-check your PDA syntax. Did you add `seeds` and `bump` correctly within the `#[account(...)]` attribute (Rust) or `init` arguments (Python)? Remember the exact values for the seeds (`b\"ranch\"` and the owner's key) and that `bump` is also required!",
                    initialCodeTemplateKey: 'ranch_management_step2_complete',
                    visualEffectTrigger: 'dataStream',
                    hintMessage: `Okay, digital prospector! Think of PDAs like a magic lockbox only your program can open. You need to tell Solana:
                    1.  What 'words' (seeds) make this lockbox unique (e.g., the word "ranch" and the owner's special key).
                    2.  A special number (the 'bump') that makes sure the lockbox address is perfect and unhackable.
                    Look at the \`#[account(...)]\` line for the \`ranch\` in Rust, or the \`.init()\` call in Python, and add the \`seeds\` and \`bump\` keywords!`
                },
            ]
        },
    },
    {
        id: 3, // Placeholder for Lesson 3
        title: "Introduction to NFTs: Minting Your First Digital Asset",
        description: "Learn how to create and mint Non-Fungible Tokens (NFTs) on Solana.",
        chapter: 3,
        difficulty: 'intermediate',
        estimatedTime: 60,
        isPremium: false,
        content: {
            steps: [
                {
                    id: 1,
                    title: "Coming Soon...",
                    challenge: "This lesson is under development. Check back soon for exciting challenges!",
                    expectedCodePattern: {},
                    successMessage: "",
                    failureMessage: "",
                    initialCodeTemplateKey: 'default',
                    hintMessage: "More challenges are on the way!"
                }
            ]
        }
    },
    {
        id: 4,
        title: "RanchCoin Token Creation",
        description: "Deploy your own SPL token for in-game economy",
        chapter: 4,
        difficulty: 'intermediate',
        estimatedTime: 50,
        isPremium: true,
        content: {
            steps: [
                { id: 1, title: "Coming Soon...", challenge: "This lesson is under development.", expectedCodePattern: {}, successMessage: "", failureMessage: "", initialCodeTemplateKey: 'default' }
            ]
        }
    },
    {
        id: 5,
        title: "Saloon Dueling System",
        description: "Program interactive duels and betting mechanics",
        chapter: 5,
        difficulty: 'advanced',
        estimatedTime: 75,
        isPremium: true,
        content: {
            steps: [
                { id: 1, title: "Coming Soon...", challenge: "This lesson is under development.", expectedCodePattern: {}, successMessage: "", failureMessage: "", initialCodeTemplateKey: 'default' }
            ]
        }
    },
    {
        id: 6,
        title: "Security & Ranch Defense",
        description: "Implement security measures against shadow beasts",
        chapter: 6,
        difficulty: 'advanced',
        estimatedTime: 90,
        isPremium: true,
        content: {
            steps: [
                { id: 1, title: "Coming Soon...", challenge: "This lesson is under development.", expectedCodePattern: {}, successMessage: "", failureMessage: "", initialCodeTemplateKey: 'default' }
            ]
        }
    },
    {
        id: 7,
        title: "Ether Range Expeditions",
        description: "Master cross-program invocations and external integrations",
        chapter: 7,
        difficulty: 'advanced',
        estimatedTime: 120,
        isPremium: true,
        content: {
            steps: [
                { id: 1, title: "Coming Soon...", challenge: "This lesson is under development.", expectedCodePattern: {}, successMessage: "", failureMessage: "", initialCodeTemplateKey: 'default' }
            ]
        }
    }
];