import mongoose from "mongoose";



const collectionSchema = new mongoose.Schema(
    {
      name: {
            type: String,
            required: ["true","Please provide a collection name"],
            trim : true, // for the case "Santosh     ." auto trim the extra space
            maxLength :[
                120,
                "Collection name should not be more than 120 chars"
            ]
        }
    },
        {timestamps: true}
        
    
)

export default mongoose.model("Collection" , collectionSchema)