import WalletConnector from '@/components/solana/WalletConnector'
test('connects wallet successfully', async () => {
    const { getByText } = render(<WalletConnector />);
    fireEvent.click(getByText('Connect Wallet'));
    await waitFor(() => {
        expect(getByText(/Connected/)).toBeInTheDocument();
    });
});