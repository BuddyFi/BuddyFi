import { type Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import type { WalletContextState } from "@solana/wallet-adapter-react"

// Convert SOL to lamports (the smallest unit in Solana)
export const solToLamports = (sol: number): number => {
  return sol * LAMPORTS_PER_SOL
}

// Get the merchant wallet address from environment variables
export const getMerchantWalletAddress = (): PublicKey => {
  const address = process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS
  if (!address) {
    throw new Error("Merchant wallet address not found in environment variables")
  }
  return new PublicKey(address)
}

// Send a payment transaction
export const sendPayment = async (
  wallet: WalletContextState,
  connection: Connection,
  amount: number,
): Promise<string> => {
  try {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    const merchantWallet = getMerchantWalletAddress()
    const lamports = solToLamports(amount)

    // Create a transaction to transfer SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: merchantWallet,
        lamports,
      }),
    )

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    

    // Sign and send the transaction
    const signature = await wallet.sendTransaction(transaction, connection)

    // Wait for confirmation
    await connection.confirmTransaction(signature)

    return signature
  } catch (error) {
    console.error("Payment error:", error)
    throw error
  }
}
