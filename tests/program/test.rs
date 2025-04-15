#[tokio::test]
async fn test_profile_creation() {
    let mut program_test = ProgramTest::new(...);
    let profile_account = get_account(&mut context, profile_pubkey).await;
    let profile_data = Profile::try_from_slice(&profile_account.data).unwrap();
    assert_eq!(profile_data.skills.len(), 3);
}