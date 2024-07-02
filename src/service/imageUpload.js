import s3 from "../config/s3config.js"

// key means here file name , body means file 
export const s3Fileupload = async({bucketName,key,body,contentType})=>{
    return await s3.upload({
        Bucket : bucketName,
        Key: key,
        Body : body,
        ContentType : contentType
    })
    .promise()
}


export const s3deleteFile = async({bucketName,key})=>{
    return await s3.deleteObject({
        Bucket : bucketName,
        Key: key,
    })
    .promise()
}