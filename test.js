const {MilvusClient, DataType} = require('@zilliz/milvus2-sdk-node');

const milvusClient = new MilvusClient('http://121.37.21.153:19530');



(async function () {
    const searchRes = await milvusClient.search({
        collection_name: 'PaperDocVector',
        partition_names: ['ArxivPapers'],
        search_params: {
            anns_field: 'summary_vector',
            topk: '3',
            metric_type: 'IP',
            output_fields: ['pdf_hash'],
            params:JSON.stringify({
                nprobe: 10,
            })
        },
        output_fields: ['pdf_hash'],
        vector_type: DataType.FloatVector,
        vectors: [],
    });
    console.log(searchRes)
}())
