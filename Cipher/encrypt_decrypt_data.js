const crypto = require("crypto");
const data_seckret = process.env.TEXT_SECRET
console.log({ data_seckret })
const ALGO = 'aes-256-ctr'
module.exports.encrypt = (text) => {
    //creating cipher algo for encrypt and decrypt data
    const randomBytes = crypto.randomBytes(16)
    console.log({ randomBytes })
    const cipher = crypto.createCipheriv(ALGO, data_seckret, randomBytes)
    console.log({ cipher })
    const encrypt_data = Buffer.concat([cipher.update(text), cipher.final()]).toString("hex")
    console.log({ encrypt_data })
    return { encrypt_data, iv: randomBytes };
}
module.exports.decrypt = (text) => {
    console.log({ text })
    const { iv, encrypt_data } = text
    console.log(iv.hex())
    console.log(Buffer.from(iv, "base64"))
    const decrypt_data = crypto.createDecipheriv(ALGO, data_seckret, Buffer.from(iv, "binary").toString("hex"))
    console.log({ decrypt_data })
    const result = Buffer.concat([decrypt_data.update(encrypt_data, "hex"), decrypt_data.final()])
    console.log({ result })
    return result.toString();
}