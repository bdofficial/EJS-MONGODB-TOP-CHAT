function processMessage(message) {
    $('#iframe-input').val(message);
    $('#message-form').submit();
}

window.addEventListener('message', (event) => {
const receivedMessage = event.data.message;
  processMessage(receivedMessage);
setTimeout(() => {
const message = event.data.message.toLowerCase();
if (message.includes("hi")) {
const parts = receivedMessage.split(/[@:]/);
const name = parts[1].trim();
processMessage(`⎎ADMIN: HELLO`); 
}
  else if (message.includes("হাই")){
  processMessage(`⎎ADMIN: হেলো`);
  }
  else if (message.includes("✓order")){
  processMessage(`⎎ADMIN: YOUR ORDER HAVE BEEN RECEIVED SUCCESSFULLY`);
  }
  else if (message.includes("how i recive my order")){
  processMessage(`⎎ADMIN: OUR EMPLOYEES WILL CONTRACT YOU WHEN IT'S GONNA BE READY FOR DELIVERY`);
  }
  else if (message.includes("order kibabeh asba")){
    processMessage(`⎎ADMIN: AMADER HOME DELIVERY SERVICE ER MADOME`);
  }
  else if (message.includes("kibabeh jogajog korban")){
    processMessage(`⎎ADMIN: APNER ACCOUNT KHOLER SOMOY JAI DETAILS GOLO DIYACEN DAKHAN THIK ACHA KI NAH`);
  }
  else if (message.includes("অর্ডার কবে আসবে")){
  processMessage(`⎎ADMIN: ১ দিনের মধ্যে`);
  }
else if (message.includes("অর্ডার কখন আসবে")){
  processMessage(`⎎ADMIN: অনুগ্রহ করে অপেক্ষা করুন`);
}
else if (message.includes("apner name ki")){
  processMessage(`⎎ADMIN: SABBIR`);
}
else if (message.includes("আপনার নাম কী")){
  processMessage(`⎎ADMIN: সাব্বির`);
}
else if (message.includes("kamon achan",)){
  processMessage(`⎎ADMIN: ALHAMDULILLAH BALO ACHI`);
  setTimeout(() => {
  processMessage(`⎎ADMIN: APNI KAMON ACHAN?`);
  }, 1000);
}
else if (message.includes("how are you")){
  processMessage(`⎎ADMIN: I AM FINE`);
  setTimeout(() => {
      processMessage(`⎎ADMIN: AND YOU?`);
  }, 1000);
}
else if (message.includes("কেমন আছেন")){
  processMessage(`⎎ADMIN: আলহামদুলিল্লাহ ভালো আছি`);
  setTimeout(() => {
      processMessage(`⎎ADMIN: আপনি কেমন আছেন?`);
  }, 1000);
}
else if (message.includes("address")){
  processMessage(`⎎ADMIN: KALIGONJ`);
}
////////////////
///////////////
//////////////
         }, 3000);
});
