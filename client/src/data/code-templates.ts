// client/src/data/code-templates.ts - DEFINITIVE CONTENT (COPY THIS ENTIRE BLOCK)
export const rustTemplates = {
  default: `use anchor_lang::prelude::*;

declare_id!("YourProgramID");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // --- Your code for Challenge 1 goes here! ---
        // Type: get_network_status()
        // Example: msg!("Hello World!");
        // ---------------------------------------------
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
`,
  // Ethos Lesson Templates (Non-coding)
  ethos_lesson0_1: `// Code for freedom, not control.
// Welcome to the digital frontier.

/*
History shows that control leads to oppression.
Our fight is for a decentralized future.
*/
`,
  ethos_lesson0_2: `// Privacy is power.
// Cryptography is the shield.

/*
Cypherpunks write code.
We are going to write it.
*/
`,
  ethos_lesson1_1: `// A Cypherpunk's Manifesto
// by Eric Hughes

/*
Privacy is necessary for an open society in the electronic age.
... We cannot expect governments, corporations, or any other large, faceless organizations to grant us privacy.
*/`,
  ethos_lesson1_2: `// The Crypto Anarchist Manifesto
// by Timothy C. May

/*
A specter is haunting the modern world, the specter of crypto anarchy.
Computer technology is on the verge of providing the ability for individuals and groups to communicate and interact with each other in a totally anonymous manner.
*/`,
  ethos_lesson2_1: `// The Genesis of Digital Freedom
// Breaking the Fiat Chains

/*
"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
- Message embedded in Bitcoin's Genesis Block
*/`,
  ethos_lesson2_2: `// Bitcoin: A Peer-to-Peer Electronic Cash System
// by Satoshi Nakamoto

/*
A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.
*/`,
  ethos_lesson2_3: `// The Blockchain Revolution
// Public, Immutable, Decentralized

/*
The blockchain is a distributed ledger that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.
*/`,
  ethos_lesson3_1: `// Ethereum & Smart Contracts
// Code is Law

/*
Smart contracts are self-executing contracts with the terms of the agreement directly written into code.
*/`,
  ethos_lesson3_2: `// DeFi & NFTs: The Double-Edged Sword
// Innovation vs. Centralization

/*
With great power comes the great responsibility to remain decentralized.
*/`,
  ethos_lesson3_3: `// The Path Forward
// Building a Better Digital World

/*
"We are what we repeatedly do. Excellence, then, is not an act, but a habit."
- Aristotle

Your code will shape the future.
*/
`,
  ranch_management_initial: `use anchor_lang::prelude::*;

declare_id!("RanchManager111111111111111111111111111111");

#[program]
pub mod ranch_manager {
    use super::*;

    pub fn initialize_ranch(
        ctx: Context<InitializeRanch>,
        ranch_name: String,
    ) -> Result<()> {
        let ranch = &mut ctx.accounts.ranch;
        // TODO: Assign owner field here in a later step (L2S2)
        ranch.name = ranch_name;
        ranch.level = 1;
        ranch.experience = 0;
        ranch.ranch_coin_balance = 500;
        ranch.building_count = 0;
        ranch.character_count = 0;
        ranch.created_at = Clock::get()?.unix_timestamp;

        msg!("Ranch '{}' initialized for owner {}", ranch.name, ranch.owner);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ranch_name: String)]
pub struct InitializeRanch<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Ranch::INIT_SPACE,
        // USER ADDS SEEDS AND BUMP HERE IN L2S3
        // seeds = [b"ranch", owner.key().as_ref()],
        // bump
    )]
    pub ranch: Account<'info, Ranch>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Ranch {
    // USER ADDS PUB OWNER: PUBKEY, HERE IN L2S1
    pub ranch_coin_balance: u64, // 8
    pub building_count: u8,     // 1
    pub character_count: u8,    // 1
    pub created_at: i64,        // 8
    pub name: String,           // 4 + 32
    pub level: u8,              // 1
    pub experience: u64,        // 8
}

impl Ranch {
    const INIT_SPACE: usize = 8 + 1 + 1 + 8 + 4 + 32 + 1 + 8; // Adjust space as fields are added
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access to ranch")]
    UnauthorizedAccess,
}
`,
  ranch_management_step1_complete: `use anchor_lang::prelude::*;

declare_id!("RanchManager111111111111111111111111111111");

#[program]
pub mod ranch_manager {
    use super::*;

    pub fn initialize_ranch(
        ctx: Context<InitializeRanch>,
        ranch_name: String,
    ) -> Result<()> {
        let ranch = &mut ctx.accounts.ranch;
        ranch.owner = ctx.accounts.owner.key(); // This line is added in L2S2
        ranch.name = ranch_name;
        ranch.level = 1;
        ranch.experience = 0;
        ranch.ranch_coin_balance = 500;
        ranch.building_count = 0;
        ranch.character_count = 0;
        ranch.created_at = Clock::get()?.unix_timestamp;

        msg!("Ranch '{}' initialized for owner {}", ranch.name, ranch.owner);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ranch_name: String)]
pub struct InitializeRanch<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8, // Adjusted space for 'owner: Pubkey'
        // USER ADDS SEEDS AND BUMP HERE IN L2S3
        // seeds = [b"ranch", owner.key().as_ref()],
        // bump
    )]
    pub ranch: Account<'info, Ranch>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Ranch {
    pub owner: Pubkey, // This line is added in L2S1
    pub ranch_coin_balance: u64,
    pub building_count: u8,
    pub character_count: u8,
    pub created_at: i64,
    pub name: String,
    pub level: u8,
    pub experience: u64,
}

impl Ranch {
    const INIT_SPACE: usize = 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8; // Updated for Pubkey (32 bytes)
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access to ranch")]
    UnauthorizedAccess,
}
`,
  ranch_management_step2_complete: `use anchor_lang::prelude::*;

declare_id!("RanchManager111111111111111111111111111111");

#[program]
pub mod ranch_manager {
    use super::*;

    pub fn initialize_ranch(
        ctx: Context<InitializeRanch>,
        ranch_name: String,
    ) -> Result<()> {
        let ranch = &mut ctx.accounts.ranch;
        ranch.owner = ctx.accounts.owner.key();
        ranch.name = ranch_name;
        ranch.level = 1;
        ranch.experience = 0;
        ranch.ranch_coin_balance = 500;
        ranch.building_count = 0;
        ranch.character_count = 0;
        ranch.created_at = Clock::get()?.unix_timestamp;

        msg!("Ranch '{}' initialized for owner {}", ranch.name, ranch.owner);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ranch_name: String)]
pub struct InitializeRanch<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8,
        seeds = [b"ranch", owner.key().as_ref()],
        bump
    )]
    pub ranch: Account<'info, Ranch>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Ranch {
    pub owner: Pubkey,
    pub ranch_coin_balance: u64,
    pub building_count: u8,
    pub character_count: u8,
    pub created_at: i64,
    pub name: String,
    pub level: u8,
    pub experience: u64,
}

impl Ranch {
    const INIT_SPACE: usize = 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access to ranch")]
    UnauthorizedAccess,
}
`
};

export const pythonTemplates = {
  default: `import seahorse.prelude.*

declare_id('YourProgramID')

@instruction
def initialize(payer: Signer):
    """Initialize a new program"""
    # --- Your code for Challenge 1 goes here! ---
    # Type: get_network_status()
    # Example: print("Hello World!")
    # ---------------------------------------------
    pass # Keep this line unless you replace it with actual code
`,
  // Ethos Lesson Templates (Non-coding)
  ethos_lesson0_1: `# Code for freedom, not control.
# Welcome to the digital frontier.

# History shows that control leads to oppression.
# Our fight is for a decentralized future.
`,
  ethos_lesson0_2: `# Privacy is power.
# Cryptography is the shield.

# Cypherpunks write code.
# We are going to write it.
`,
  ethos_lesson1_1: `# A Cypherpunk's Manifesto
# by Eric Hughes

# Privacy is necessary for an open society in the electronic age.
# We cannot expect governments, corporations... to grant us privacy.
`,
  ethos_lesson1_2: `# The Crypto Anarchist Manifesto
# by Timothy C. May

# Fully anonymous, untraceable transactions.
# Strong cryptography will forever alter the nature of governments.
`,
  ethos_lesson2_1: `# The Fiat Chains
# 2008: A crisis of centralization.

# Money supply controlled by a few.
# Censorship, inflation, and lack of true ownership.
`,
  ethos_lesson2_2: `# Bitcoin Whitepaper (Excerpt)
# A Peer-to-Peer Electronic Cash System

# "A purely peer-to-peer version of electronic cash would allow online payments
# to be sent directly from one party to another without going through a financial institution."
`,
  ethos_lesson2_3: `# The Blockchain
# Immutability and Transparency.

# "The network timestamps transactions by hashing them into an ongoing chain of hash-based
# proof-of-work, forming a record that cannot be changed without redoing the proof-of-work."
`,
  ethos_lesson3_1: `# Ethereum & Smart Contracts
# Code is law, self-enforcing.

# "A smart contract is a computer protocol intended to digitally facilitate, verify,
# or enforce the negotiation or performance of a contract."
`,
  ethos_lesson3_2: `# DeFi & NFTs: Promises and Perils
# Innovation vs. Centralization's creeping threat.

# Decentralized Finance aims to recreate traditional financial systems without intermediaries.
# NFTs provide unique digital ownership.
`,
  ethos_lesson3_3: `# The Path Forward
# Realigning with the Ethos.

# Question centralization.
# Champion privacy.
# Build for liberty.
`,
  ranch_management_initial: `import seahorse.prelude.*

declare_id('RanchManager111111111111111111111111111111')

class Ranch(Account):
    # USER ADDS OWNER: PUBKEY HERE IN L2S1
    ranch_coin_balance: u64
    building_count: u8
    character_count: u8
    created_at: i64
    name: str
    level: u8
    experience: u64

@instruction
def initialize_ranch(
    ranch: Empty[Ranch],
    owner: Signer,
    ranch_name: str
):
    """Initialize a new ranch"""
    ranch = ranch.init(
        payer=owner,
        space=8 + 32 + 32 + 1 + 8 + 8 + 1 + 1 + 8, # Adjust space
        # USER ADDS SEEDS AND BUMP HERE IN L2S3
        # seeds=['ranch', owner],
        # bump
    )

    # TODO: Assign owner field here in a later step (L2S2)
    ranch.name = ranch_name
    ranch.level = 1
    ranch.experience = 0
    ranch.ranch_coin_balance = 500
    ranch.building_count = 0
    ranch.character_count = 0
    ranch.created_at = Clock.unix_timestamp()

    print(f"Ranch '{ranch_name}' initialized for owner {owner.key()}")
`,
  ranch_management_step1_complete: `import seahorse.prelude.*

declare_id('RanchManager111111111111111111111111111111')

class Ranch(Account):
    owner: Pubkey # This line is added in L2S1
    ranch_coin_balance: u64
    building_count: u8
    character_count: u8
    created_at: i64
    name: str
    level: u8
    experience: u64

@instruction
def initialize_ranch(
    ranch: Empty[Ranch],
    owner: Signer,
    ranch_name: str
):
    """Initialize a new ranch"""
    ranch = ranch.init(
        payer=owner,
        space=8 + 32 + 32 + 1 + 8 + 8 + 1 + 1 + 8, # Adjusted space
        # USER ADDS SEEDS AND BUMP HERE IN L2S3
        # seeds=['ranch', owner],
        # bump
    )

    ranch.owner = owner.key() # This line is added in L2S2
    ranch.name = ranch_name
    ranch.level = 1
    ranch.experience = 0
    ranch.ranch_coin_balance = 500
    ranch.building_count = 0
    ranch.character_count = 0
    ranch.created_at = Clock.unix_timestamp()

    print(f"Ranch '{ranch_name}' initialized for owner {owner.key()}")
`,
  ranch_management_step2_complete: `import seahorse.prelude.*

declare_id('RanchManager111111111111111111111111111111')

class Ranch(Account):
    owner: Pubkey
    ranch_coin_balance: u64
    building_count: u8
    character_count: u8
    created_at: i64
    name: str
    level: u8
    experience: u64

@instruction
def initialize_ranch(
    ranch: Empty[Ranch],
    owner: Signer,
    ranch_name: str
):
    """Initialize a new ranch"""
    ranch = ranch.init(
        payer=owner,
        space=8 + 32 + 32 + 1 + 8 + 8 + 1 + 1 + 8,
        seeds=['ranch', owner],
        bump
    )

    ranch.owner = owner.key()
    ranch.name = ranch_name
    ranch.level = 1
    ranch.experience = 0
    ranch.ranch_coin_balance = 500
    ranch.building_count = 0
    ranch.character_count = 0
    ranch.created_at = Clock.unix_timestamp()

    print(f"Ranch '{ranch_name}' initialized for owner {owner.key()}")
`
};

export const codeTemplates: { [key: string]: string } = {
  ...rustTemplates
};