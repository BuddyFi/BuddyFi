#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Profile {
    pub wallet: Pubkey,
    pub skills: Vec<String>,
    pub verified: bool,
}

