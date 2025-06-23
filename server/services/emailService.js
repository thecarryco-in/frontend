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

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, name, order) => {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            <img src="${item.productSnapshot.image}" alt="${item.productSnapshot.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div>
              <h4 style="margin: 0; color: #333;">${item.productSnapshot.name}</h4>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">${item.productSnapshot.brand}</p>
              <p style="margin: 0; color: #666; font-size: 14px;">Qty: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">
          <span style="font-weight: bold; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</span>
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: `The CarryCo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: email,
      subject: `Order Confirmation - ${order.orderNumber} - The CarryCo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Order Confirmed!</h1>
              <p style="color: #666; font-size: 18px;">Thank you for your purchase, ${name}!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Order Number:</span>
                <span style="color: #333; font-weight: bold;">${order.orderNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Order Date:</span>
                <span style="color: #333;">${new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Payment Status:</span>
                <span style="color: #28a745; font-weight: bold;">Paid</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Total Amount:</span>
                <span style="color: #333; font-weight: bold; font-size: 18px;">₹${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style="margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Shipping Address</h3>
              <p style="color: #666; margin: 0; line-height: 1.6;">
                ${order.shippingAddress.name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: white; margin-bottom: 15px;">What's Next?</h3>
              <p style="color: white; margin-bottom: 20px;">We'll start processing your order right away. You'll receive updates as your order moves through each stage.</p>
              <a href="${process.env.CLIENT_URL}/dashboard" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Your Order</a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                Questions about your order? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="color: #666; font-size: 12px; margin: 0;">
                Thank you for choosing The CarryCo!<br>
                The CarryCo Team
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Order confirmation email error:', error);
      return false;
    }

    console.log('Order confirmation email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Order confirmation email sending error:', error);
    return false;
  }
};

// Send order delivered email with rating request
export const sendOrderDeliveredEmail = async (email, name, order) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The CarryCo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: email,
      subject: `Your Order ${order.orderNumber} Has Been Delivered! - The CarryCo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">🎉 Order Delivered!</h1>
              <p style="color: #666; font-size: 18px;">Your order has been successfully delivered, ${name}!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Delivery Details</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Order Number:</span>
                <span style="color: #333; font-weight: bold;">${order.orderNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Delivered On:</span>
                <span style="color: #333;">${new Date(order.deliveredAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Delivery Address:</span>
                <span style="color: #333;">${order.shippingAddress.city}, ${order.shippingAddress.state}</span>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: white; margin-bottom: 15px;">How was your experience?</h3>
              <p style="color: white; margin-bottom: 20px;">We'd love to hear about your experience with our products. Your feedback helps us serve you better!</p>
              <a href="${process.env.CLIENT_URL}/dashboard?tab=orders" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Rate Your Purchase</a>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: #333; margin-bottom: 15px;">Need Support?</h3>
              <p style="color: #666; margin-bottom: 15px;">If you have any issues with your order or need assistance, we're here to help!</p>
              <a href="mailto:${process.env.ADMIN_EMAIL}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Contact Support</a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                Thank you for choosing The CarryCo for your mobile accessory needs!
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
      console.error('Order delivered email error:', error);
      return false;
    }

    console.log('Order delivered email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Order delivered email sending error:', error);
    return false;
  }
};

// Send admin reply email
export const sendAdminReplyEmail = async (userEmail, userName, originalSubject, adminReply) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The CarryCo Support <${process.env.RESEND_SENDER_EMAIL}>`,
      to: userEmail,
      subject: `Re: ${originalSubject} - The CarryCo Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">The CarryCo Support</h1>
              <p style="color: #666; font-size: 16px;">We've received your message and here's our response</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 15px;">Hi ${userName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for contacting The CarryCo. We've reviewed your inquiry regarding "<strong>${originalSubject}</strong>" and here's our response:
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-bottom: 15px;">Our Response:</h3>
              <div style="color: #666; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${adminReply}</div>
            </div>

            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Need Further Assistance?</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                If you have any additional questions or need further clarification, please don't hesitate to reach out to us.
              </p>
              <div style="text-align: center;">
                <a href="mailto:${process.env.ADMIN_EMAIL}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Contact Support</a>
              </div>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                This email was sent in response to your inquiry. If you didn't expect this email, please contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="color: #666; font-size: 12px; margin: 0;">
                Best regards,<br>
                The CarryCo Support Team
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Admin reply email error:', error);
      return false;
    }

    console.log('Admin reply email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Admin reply email sending error:', error);
    return false;
  }
};