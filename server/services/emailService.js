import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send OTP email for registration
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The CarryCo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - The CarryCo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">Welcome to The CarryCo!</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Hi ${name}, please verify your email address to complete your registration.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('OTP email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The CarryCo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: email,
      subject: 'Welcome to The CarryCo - Your Premium Mobile Accessories Destination!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Welcome to The CarryCo!</h1>
              <p style="color: #666; font-size: 18px;">Your premium mobile accessories journey starts here</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 15px;">Hi ${name},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for joining The CarryCo family! We're excited to have you on board and can't wait to help you discover the perfect accessories for your mobile device.
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 20px; text-align: center;">What's Next?</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 200px; text-align: center;">
                  <div style="background: #667eea; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px;">🛍️</div>
                  <h4 style="color: #333; margin-bottom: 10px;">Explore Our Collection</h4>
                  <p style="color: #666; font-size: 14px;">Browse our premium cases, chargers, and accessories</p>
                </div>
                <div style="flex: 1; min-width: 200px; text-align: center;">
                  <div style="background: #764ba2; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px;">⭐</div>
                  <h4 style="color: #333; margin-bottom: 10px;">Create Your Wishlist</h4>
                  <p style="color: #666; font-size: 14px;">Save your favorite items for later</p>
                </div>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: white; margin-bottom: 15px;">Special Welcome Offer!</h3>
              <p style="color: white; font-size: 16px; margin-bottom: 20px;">Get 10% off your first order with code:</p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; display: inline-block;">
                <span style="color: white; font-size: 24px; font-weight: bold; letter-spacing: 2px;">WELCOME10</span>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}/shop" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start Shopping Now</a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                Need help? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="color: #666; font-size: 12px; margin: 0;">
                Best regards,<br>
                The CarryCo Team
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Welcome email error:', error);
      return false;
    }

    console.log('Welcome email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Welcome email sending error:', error);
    return false;
  }
};