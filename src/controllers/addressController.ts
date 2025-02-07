import { Request, Response } from 'express';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { getNFTMappings, storeNFTMapping, storeUserAddress } from '../db/database';
import { supabase } from '../db/database';

export const generateSuiAddress = async (req: Request, res: Response) => {
    try {
        const keypair = new Ed25519Keypair();
        const address = keypair.getPublicKey().toSuiAddress();
        const secretKey = keypair.getSecretKey();
        
        const success = await storeUserAddress(address, secretKey);
        if (!success) {
            console.error('Failed to store address in database');
            return res.status(500).json({ error: 'Error storing address' });
        }
        
        res.json({
            success: true,
            address: address
        });
    } catch (error) {
        console.error('Error in generateSuiAddress:', error);
        res.status(500).json({ error: 'Error generating address' });
    }
};

export const storeNFTMappingHandler = async (req: Request, res: Response) => {
    try {
        const { role_id, nft_id, address } = req.body;

        if (!role_id || !nft_id || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get private key from user_addresses
        const { data: userData, error: userError } = await supabase
            .from('user_addresses')
            .select('secret_key')
            .eq('sui_address', address)
            .single();

        if (userError || !userData) {
            console.error('Error fetching user address:', userError);
            return res.status(404).json({ error: 'User address not found' });
        }

        const success = await storeNFTMapping({
            role_id,
            nft_id,
            address,
            private_key: userData.secret_key
        });

        if (!success) {
            return res.status(500).json({ error: 'Error storing NFT mapping' });
        }
        
        res.json({
            success: true,
            message: 'NFT mapping stored successfully'
        });
    } catch (error) {
        console.error('Error storing NFT mapping:', error);
        res.status(500).json({ error: 'Error storing NFT mapping' });
    }
};

export const getNFTMappingsHandler = async (req: Request, res: Response) => {
    try {
        const mappings = await getNFTMappings();
        res.json({
            success: true,
            mappings
        });
    } catch (error) {
        console.error('Error fetching NFT mappings:', error);
        res.status(500).json({ error: 'Error fetching NFT mappings' });
    }
}; 