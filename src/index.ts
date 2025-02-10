import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { generateSuiAddress, storeNFTMappingHandler, getNFTMappingsHandler, getPrivateKeyByRoleId, getNftIdByRoleId } from './controllers/addressController';

const app = express();

// Add CORS middleware
app.use(cors({
    origin: '*', // For development. In production, specify your frontend domain
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.post('/generate-address', generateSuiAddress);
app.post('/store-nft-mapping', storeNFTMappingHandler);
app.get('/nft-mappings', getNFTMappingsHandler);
app.get('/nft-mapping/private-key/:role_id', getPrivateKeyByRoleId);
app.get('/nft-mapping/nft-id/:role_id', getNftIdByRoleId);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 