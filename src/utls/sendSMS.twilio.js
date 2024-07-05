import Twilio from "twilio/lib/rest/Twilio";
import config from "../config/index.js";

const twilioSMS = async(options)=>{
    const client = Twilio(config.ACCOUNT_SID,config.AUTH_TOKEN)
    await client.message.create({
        body : options.body,
        from : "+14066167224",
        to : options.to
    })
}

export default twilioSMS
