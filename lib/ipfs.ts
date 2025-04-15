import { create } from 'ipfs-http-client';

const auth = 'Basic' + Buffer.from(
    process.env.IPFS_KEY + ':' + process.env.IPFS_SECRET
).toString('base64');

export const ipfs = create({
    url: 'https://infura-ipfs.io:5001',
    headers: { authorization: auth }
})