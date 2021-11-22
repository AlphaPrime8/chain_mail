use anchor_lang::prelude::*;
use std::ops::Deref;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod chain_mail {

    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        vote_name: String,
        bumps: VoteBumps,
    ) -> ProgramResult {

        let state_account = &mut ctx.accounts.state_account;

        let name_bytes = vote_name.as_bytes();
        let mut name_data = [b' '; 10];
        name_data[..name_bytes.len()].copy_from_slice(name_bytes);

        state_account.vote_name = name_data;
        state_account.bumps = bumps;
        state_account.candidate_registration_is_active = false;

        Ok(())
    }

    pub fn open_registration(ctx: Context<OpenRegistration>) -> ProgramResult {
        let state_account = &mut ctx.accounts.state_account;

        if state_account.candidate_registration_is_active == true {
            return Err(ErrorCode::RegistrationAlreadyOpen.into());
        } else {
            msg!("registration is now set to open");
            state_account.candidate_registration_is_active = true;
        }

        Ok(())
    }

    pub fn register_as_candidate(ctx: Context<RegisterAsCandidate>) -> ProgramResult {
        Ok(())
    }


}

#[derive(Accounts)]
#[instruction(vote_name: String, bumps: VoteBumps)]
pub struct Initialize<'info> {
    #[account(init,
    seeds = [vote_name.as_bytes()],
    bump = bumps.state_account,
    payer = user)]
    pub state_account: Account<'info, StateAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OpenRegistration<'info> {
    #[account(seeds = [state_account.vote_name.as_ref().trim_ascii_whitespace()],
    bump = state_account.bumps.state_account)]
    pub state_account: Account<'info, StateAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterAsCandidate<'info> {
    #[account(seeds = [state_account.vote_name.as_ref().trim_ascii_whitespace()],
    bump = state_account.bumps.state_account)]
    pub state_account: Account<'info, StateAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct StateAccount {
    pub vote_name: [u8; 10], // Setting an arbitrary max of ten characters in the ido name.
    pub bumps: VoteBumps,
    pub candidate_registration_is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct VoteBumps {
    pub state_account: u8,
}

#[error]
pub enum ErrorCode {
    #[msg("Registration is already open.")]
    RegistrationAlreadyOpen,
}

/// Trait to allow trimming ascii whitespace from a &[u8].
pub trait TrimAsciiWhitespace {
    /// Trim ascii whitespace (based on `is_ascii_whitespace()`) from the
    /// start and end of a slice.
    fn trim_ascii_whitespace(&self) -> &[u8];
}

impl<T: Deref<Target = [u8]>> TrimAsciiWhitespace for T {
    fn trim_ascii_whitespace(&self) -> &[u8] {
        let from = match self.iter().position(|x| !x.is_ascii_whitespace()) {
            Some(i) => i,
            None => return &self[0..0],
        };
        let to = self.iter().rposition(|x| !x.is_ascii_whitespace()).unwrap();
        &self[from..=to]
    }
}
