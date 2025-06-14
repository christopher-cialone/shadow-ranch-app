// client/src/data/code-templates.ts - DEFINITIVE CONTENT (COPY THIS ENTIRE BLOCK)
export const rustTemplates = {
  default: `use anchor_lang::prelude::*;

declare_id!("YourProgramID");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized!");
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
    print(f"Program initialized by {payer.key()}")
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