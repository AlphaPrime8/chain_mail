use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

fn print_type_of<T>(_: &T) {
    msg!("{}", std::any::type_name::<T>())
}

#[program]
pub mod chain_mail {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let state_account = &mut ctx.accounts.state_account;
        state_account.candidate_registration_is_active = false;
        Ok(())
    }
    pub fn open_candidate_registration(ctx: Context<OpenCandidateRegistration>) -> ProgramResult {
        let state_account = &mut ctx.accounts.state_account;
        if state_account.candidate_registration_is_active == true {
            msg!("candidate registration is already open");
        }
        else {
            state_account.candidate_registration_is_active = true;
            msg!("opened candidate registration");
        }
        Ok(())
    }
    pub fn register_candidate(ctx: Context<RegisterCandidate>) -> ProgramResult {
        print_type_of(&ctx);
        Ok(())
    }
    pub fn unregister_candidate(ctx: Context<UnregisterCandidate>) -> ProgramResult {
        print_type_of(&ctx);
        Ok(())
    }
    pub fn close_candidate_registration(ctx: Context<CloseCandidateRegistration>) -> ProgramResult {
        let state_account = &mut ctx.accounts.state_account;
        if state_account.candidate_registration_is_active == true {
            state_account.candidate_registration_is_active = false;
            msg!("closed candidate account registration");
        }
        else {
            msg!("closed candidate account registration already closed");
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 1)]
    pub state_account: Account<'info, StateAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct OpenCandidateRegistration<'info> {
    #[account(mut)]
    pub state_account: Account<'info, StateAccount>
}

#[derive(Accounts)]
pub struct RegisterCandidate {}

#[derive(Accounts)]
pub struct UnregisterCandidate {}

#[derive(Accounts)]
pub struct CloseCandidateRegistration<'info> {
    #[account(mut)]
    pub state_account: Account<'info, StateAccount>
}

#[account]
pub struct StateAccount {
    pub candidate_registration_is_active: bool,
}