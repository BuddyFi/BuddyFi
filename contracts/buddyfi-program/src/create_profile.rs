use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CreateProfileInstruction {
    pub skills: Vec<String>,
    pub ipfs_cid: String,
}