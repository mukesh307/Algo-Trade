const axios = require('axios');

exports.sendSMS = async (number, otp) => {
  
  const username = 'INTIMATE';
  const password = '123456';
  const priority = 'ndnd';
  const stype = 'normal';
  const sender = 'SOORDR';
  number =  number.replace("+91", "");
 
 
  const message = otp+" is the OTP for your new registration in SARAL ORDER. Thank you for choosing SARAL ORDER.";
  const encodedMessage = encodeURIComponent(message);

  const url = `http://trans.smsfresh.co/api/sendmsg.php?` +
              `user=${username}&pass=${password}&sender=${sender}` +
              `&phone=${number}&text=${encodedMessage}&priority=${priority}&stype=${stype}`;

  try {
    const response = await axios.get(url);
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { error: 'Failed to send SMS' };
  }
};
