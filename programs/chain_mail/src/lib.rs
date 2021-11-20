use anchor_lang::prelude::*;
use spl_token::instruction::AuthorityType;
use anchor_spl::token::{self, SetAuthority, Token};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

fn print_type_of<T>(_: &T) {
    msg!("{}", std::any::type_name::<T>())
}

#[program]
pub mod chain_mail {

    use super::*;

    const ESCROW_PDA_SEED: &[u8] = b"escrow";

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {

        let state_account = &mut ctx.accounts.state_account;
        state_account.candidate_registration_is_active = false;

        // transfer ownership of state_account to this program with pda
        let (pda, _bump_seed) = Pubkey::find_program_address(&[ESCROW_PDA_SEED], ctx.program_id);
        token::set_authority(ctx.accounts.into(), AuthorityType::AccountOwner, Some(pda))?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 1)]
    pub state_account: Account<'info, StateAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct StateAccount {
    pub candidate_registration_is_active: bool,
}

impl<'info> From<&mut Initialize<'info>>
for CpiContext<'_, '_, '_, 'info, SetAuthority<'info>>
{
    fn from(accounts: &mut Initialize<'info>) -> Self {
        //TODO set the SetAuthority params aptly
        let cpi_accounts = SetAuthority {
            account_or_mint: accounts
                .state_account
                .to_account_info()
                .clone(),
            current_authority: accounts.state_account.to_account_info().clone(),
        };
        let cpi_program = accounts.system_program.to_account_info();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}


