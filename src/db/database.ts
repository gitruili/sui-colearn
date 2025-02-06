import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

type NFTMapping = {
    sui_address: string;
    nft_address: string;
    role_address: string;
    created_at: string;
};

async function getNFTMappings(): Promise<NFTMapping[]> {
    const { data, error } = await supabase
        .from('nft_mappings')
        .select('*');
    if (error) throw error;
    return data || [];
}

async function storeNFTMapping(mapping: Omit<NFTMapping, 'created_at'>) {
    const { error } = await supabase
        .from('nft_mappings')
        .insert([mapping]);
    return !error;
}

// Similar type assertion for storeUserAddress
type UserAddress = {
    sui_address: string;
    created_at: string;
};

async function storeUserAddress(sui_address: string) {
    try {
        const { error } = await supabase
            .from('user_addresses')
            .insert([{ sui_address }]);
        
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

export { getNFTMappings, storeNFTMapping, storeUserAddress }; 