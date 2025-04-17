use borsh::{BorshDeserialize, BorshSerialize}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct CreateProfileData {
    pub skills: Vec<String>,
    pub ipfs_cid: String,
}