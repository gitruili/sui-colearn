import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

type NFTMapping = {
    id?: number;
    role_id: string;
    nft_id: string;
    address: string;
    private_key: string;
    created_at: string;
};

async function getNFTMappings(): Promise<Omit<NFTMapping, 'private_key'>[]> {
    const { data, error } = await supabase
        .from('nft_mappings')
        .select('id, role_id, nft_id, address, created_at');
    
    if (error) throw error;
    return data || [];
}

async function storeNFTMapping(mapping: Omit<NFTMapping, 'created_at'>) {
    const { error } = await supabase
        .from('nft_mappings')
        .insert([{
            role_id: mapping.role_id,
            nft_id: mapping.nft_id,
            address: mapping.address,
            private_key: mapping.private_key
        }]);
    return !error;
}

// Similar type assertion for storeUserAddress
type UserAddress = {
    sui_address: string;
    secret_key: string;
    created_at: string;
};

async function storeUserAddress(sui_address: string, secret_key: string) {
    try {
        const { error } = await supabase
            .from('user_addresses')
            .insert([{ sui_address, secret_key }]);
        
        if (error) {
            console.error('Supabase error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error storing address:', error);
        return false;
    }
}

async function getNFTMappingPrivateKey(role_id: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('nft_mappings')
        .select('private_key')
        .eq('role_id', role_id)
        .single();
    
    if (error || !data) {
        console.error('Error fetching private key:', error);
        return null;
    }
    
    return data.private_key;
}

async function getNFTMappingNftId(role_id: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('nft_mappings')
        .select('nft_id')
        .eq('role_id', role_id)
        .single();
    
    if (error || !data) {
        console.error('Error fetching NFT ID:', error);
        return null;
    }
    
    return data.nft_id;
}

export { getNFTMappings, storeNFTMapping, storeUserAddress, getNFTMappingPrivateKey, getNFTMappingNftId }; 