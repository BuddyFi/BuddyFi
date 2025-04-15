import { Connection, Keypair, SystemProgram, Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh';
import { Profile } from '@/types/profile'
import { PROGRAM_ID } from './constants';

// Borsh schema
class ProfileSchema {
    wallet: Uint8Array;
    skills: string[];
    hackathon_participations: number;

    constructor(fields: Profile) {
        this.wallet = fields.wallet.toBytes();
        this.skills = fields.skills;
        this.hackathon_participations = fields.hackathon_participations;
    }

    static schema = new Map([
        [ProfileSchema, {
            kind: 'struct',
            fields: [
                ['wallet', [32]],
                ['skills', ['string']],
                ['hackathon_participations', 'u32']
            ]
        }]
    ]);

}

export const initializeProfile = async (
    connection: Connection,
    publicKey: PublicKey,
    sendTransaction: (transaction: Transaction, connection: Connection)
    => Promise<string>
): Promise<string> => {
    const newAccount = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    const space = 1024;
    const rentExemption = await connection.getMinimumBalanceForRentExemption(space);

    const createAccountIx = SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: newAccount.publicKey,
            lamports: rentExemption,
            space,
            programId: PROGRAM_ID
        })
    
    
    
    // serialize profile data
    const profileData = new ProfileSchema({
        wallet: publicKey,
        skills: [],
        hackathon_participations: 0
    });

    const initializeIx = new TransactionInstruction({
        keys: [
            {pubkey: newAccount.publicKey, isSigner: false, isWritable: true},
            {pubkey: publicKey, isSigner: true, isWritable: false}
        ],
        programId: PROGRAM_ID,
        data: Buffer.from(serialize(ProfileSchema.schema, profileData))
    })

    const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey
    }).add(createAccountIx, initializeIx);

    transaction.sign(newAccount);

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction({
        signature,
        lastValidBlockHeight,
        blockhash
    });

    return newAccount.publicKey.toString();
}

