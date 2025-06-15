const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send OTP via email
const sendOTP = async (mobileNumber, otp) => {
    try {
        // For development, we'll just log the OTP
        console.log(`OTP for ${mobileNumber}: ${otp}`);

        // In production, you would integrate with an SMS service here
        // For now, we'll simulate sending an email
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: 'test@example.com', // In production, this would be the user's email
            subject: 'Your OTP for Kisan Mel',
            text: `Your OTP is: ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = {
    sendOTP
}; 