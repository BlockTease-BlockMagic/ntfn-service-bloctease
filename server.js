const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3001;

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blocktease@gmail.com', 
    pass: 'xewimeyzveeavosg' 
  }
});

app.get('/send-email', async (req, res) => {
  
    const { wallet_address, tokenId } = req.query;

    try {
        const userInfoResponse = await axios.get(`https://db-graph-backend.onrender.com/api/user-model-info?wallet_address=${wallet_address}&tokenId=${tokenId}`);
        const { user, model } = userInfoResponse.data.data;
        const modelSlug = model.name.replace(/ /g, '_');

        const ipfsResponse = await axios.get(model.ipfsUrl);
        const { image } = ipfsResponse.data;

        // Prepare and send the email
        const mailOptions = {
          from: 'blocktease@gmail.com',
          to: user.email,
          subject: `🌟 ${model.name} is waiting! 🌟`,
          html: `
              <h1 style="color: blue;">Hi ${user.username},</h1>
              <p>🌟 <strong>Oh no! It looks like your magical journey with ${model.name} has paused.</strong> But don't worry, just a quick tap away and you can dive right back into the excitement!</p>
              <p>We've missed you and so has ${model.name}. Your exclusive access is just on hold and waiting for you to hit 'resume'. Let's not keep the thrills waiting, shall we?</p>
              <p><a href="https://block-tease.vercel.app/profile/${modelSlug}" style="color: #ffffff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Recharge Now & Resume the Fun!</a></p>
              <img src="${image}" alt="${model.name} awaits you!" style="width: 100%; max-width: 300px; height: auto; display: block; margin: auto;" />
              <p>Don't let the adventure stop. <strong>${model.name}</strong> has more surprises in store, and we promise, they're too good to miss!</p>
              <p>Cheers to more unforgettable experiences,<br>The BlockTease Team 🥂</p>
          `
      };
      

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({success: true, message: 'Email successfully sent', data:{}});
            }
        });
    } catch (error) {
      console.log(error)
        console.error('Error in sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
