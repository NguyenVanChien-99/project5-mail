import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)


const ses = new XAWS.SES({
    apiVersion: '2010-12-01'
})

const FROM_EMAIL = process.env.FROM_EMAIL_ADDRESS

const logger = createLogger(`mailService`)

export const sendEmail = async (to: string, subject: string, message: string) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: FROM_EMAIL,
        Source: FROM_EMAIL,
    };

    const res = await ses.sendEmail(params).promise();
    if (res.$response.error) {
        logger.error(`Send mail fail with error ${res.$response.error}`)
    } else {
        logger.info(`Send mail success!`)
    }
};


export const verifyEmailAddress = async (email: string) => {
    const res= await ses.verifyEmailAddress({
        EmailAddress: email
    }).promise();

    if (res.$response.error) {
        logger.error(`Verify email address fail with error ${res.$response.error}`)
    } else {
        logger.info(`Verify email address success!`)
    }
}