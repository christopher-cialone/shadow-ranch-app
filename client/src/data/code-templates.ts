// client/src/data/code-templates.ts - Complete Code Templates
export interface CodeTemplate {
  rust: string;
  python: string;
}

export const codeTemplates: Record<string, CodeTemplate> = {
  default: {
    rust: "// Welcome to your Rust workspace!\n// Write your code here\n\n",
    python: "# Welcome to your Python workspace!\n# Write your code here\n\n"
  },
  
  ranch_management_initial: {
    rust: `use anchor_lang::prelude::*;

#[account]
pub struct Ranch {
    // TODO: Add owner field
}`,
    python: `from solana.publickey import PublicKey

class Ranch:
    # TODO: Add owner field
    pass`
  },
  
  ranch_management_step1_complete: {
    rust: `use anchor_lang::prelude::*;

#[account]
pub struct Ranch {
    pub owner: Pubkey,
}

pub fn initialize_ranch(ctx: Context<InitializeRanch>) -> Result<()> {
    let ranch = &mut ctx.accounts.ranch;
    // TODO: Set the owner
    Ok(())
}`,
    python: `from solana.publickey import PublicKey

class Ranch:
    owner: PublicKey

def initialize_ranch(owner):
    ranch = Ranch()
    # TODO: Set the owner
    return ranch`
  },
  
  ranch_management_step2_complete: {
    rust: `use anchor_lang::prelude::*;

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
        space = 8 + Ranch::INIT_SPACE,
        // TODO: Add seeds and bump here
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
    pub owner: Pubkey,
    pub name: String,
    pub level: u8,
    pub experience: u64,
    pub ranch_coin_balance: u64,
    pub building_count: u8,
    pub character_count: u8,
    pub created_at: i64,
}

impl Ranch {
    const INIT_SPACE: usize = 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access to ranch")]
    UnauthorizedAccess,
}`,
    python: `from solana.publickey import PublicKey
from datetime import datetime

class Ranch:
    owner: PublicKey
    name: str
    level: int
    experience: int
    ranch_coin_balance: int
    building_count: int
    character_count: int
    created_at: int

def initialize_ranch(owner, ranch_name):
    ranch = Ranch()
    ranch.owner = owner.key()
    ranch.name = ranch_name
    ranch.level = 1
    ranch.experience = 0
    ranch.ranch_coin_balance = 500
    ranch.building_count = 0
    ranch.character_count = 0
    ranch.created_at = int(datetime.now().timestamp())
    
    # TODO: Add seeds and bump for PDA
    # seeds = ['ranch', owner]
    # bump = ...
    
    print(f"Ranch '{ranch.name}' initialized for owner {ranch.owner}")
    return ranch`
  }
};