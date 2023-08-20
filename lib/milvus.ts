import {MilvusClient} from '@zilliz/milvus2-sdk-node';

let milvusClient: MilvusClient;

export const getMilvusClient = () => {
    if (milvusClient) {
        return milvusClient;
    } else {
        milvusClient = new MilvusClient(process.env.MILVUS_ADDRESS);
        return milvusClient;
    }
}


