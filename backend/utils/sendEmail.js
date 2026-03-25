import nodemailer from 'nodemailer';

const sendOrderConfirmationEmail = async (userEmail, orderId) => {
    try {
        // Mock email transport config for testing purposes
        let testAccount = await nodemailer.createTestAccount();
        
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Artisan Marketplace" <orders@artisanmarket.com>',
            to: userEmail,
            subject: `Order Confirmation: ${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4CAF50;">Order Placed Successfully!</h2>
                    <p>Hello,</p>
                    <p>Your order (Track ID: <b>${orderId}</b>) has been successfully placed.</p>
                    <p>Your unique artisan products will be crafted and shipped securely shortly. Estimate roughly 3-5 days delivery once shipped.</p>
                    <p>Thank you for shopping at Artisan Marketplace!</p>
                </div>
            `,
        });

        console.log("Mock Email Notification sent: %s", info.messageId);
        console.log("Preview Email Confirmation URL: %s", nodemailer.getTestMessageUrl(info));
        return nodemailer.getTestMessageUrl(info);
    } catch (error) {
        console.error("Failed to send mock order email", error);
    }
};

export default sendOrderConfirmationEmail;
