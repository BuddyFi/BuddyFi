fn create_profile(
    accounts: &[AccountInfo],
    skills: Vec<String>,
) -> ProgramResult {
    let profile = Profile {
        wallet: *ctx.accounts.user.key,
        skills,
        verified: false,
    };
    profile.serialize(&mut *ctx.accounts.profile.data.borrow_mut())?;
    Ok(())
}

fn verify_profile(accounts: &[AccountInfo]) {
    require!(authority == VERIFIER_KEY, ErrorCode::Unauthorized);
    profile.verified = true;
}