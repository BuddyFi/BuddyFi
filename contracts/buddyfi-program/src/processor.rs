use solana_program::{
    account_info::{AccountInfo, next_account_info},
    pubkey::Pubkey,
    program_error::ProgramError,
    msg,
}

use crate::state::Profile;

fn create_profile(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    bump_seed: u8,
    space: u32,
    lamports: u64,
    skills: Vec<String>,
    ipfs_cid: String,
) -> Result<(), ProgramError> {

    let account_info_iter = &mut accounts.iter();

    let user = next_account_info(account_info_iter)?;
    let profile_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let seeds = &[
        b"profile",
        payer.key.as_ref(),
        &[bump_seed],
    ];

    invoke_signed(
        &system_instruction::create_account(
            payer.key,
            profile_account.key,
            lamports,
            space,
            program_id,
        ),
        &[
            payer.clone(),
            profile_account.clone(),
            system_program.clone(),
        ],
        &[seeds],
    )?;

    // let profile = Profile {
    //     wallet: *user.key,
    //     skills,
    //     verified: false,
    //     ipfs_cid,
    // };

    profile.serialize(&mut *profile_account.data.borrow_mut())?;
    msg!("Profile created successfully");
    
    Ok(())
}
