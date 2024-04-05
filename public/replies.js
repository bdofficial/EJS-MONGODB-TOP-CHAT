function processMessage(message) {
    $('#iframe-input').val(message);
    $('#message-form').submit();
}

window.addEventListener('message', (event) => {
const receivedMessage = event.data.message;
  processMessage(receivedMessage);
setTimeout(() => {
const message = event.data.message.toLowerCase();
if (message.includes("✓order")){
  processMessage(`⎎ADMIN: YOUR ORDER HAVE BEEN RECEIVED.`);
}
else if (message == "hi"){
      processMessage(`⎎ADMIN: HELLO`);
  }
else if (message == "হাই"){
  processMessage(`⎎ADMIN: হেলো`);
  }
else if (message.includes("what is your name")){
      processMessage(`⎎ADMIN: SABBIR`);
    }
else if (message.includes("apner name ki")){
  processMessage(`⎎ADMIN: SABBIR`);
}
else if (message.includes("আপনার নাম কী")){
  processMessage(`⎎ADMIN: সাব্বির`);
}
  else if (message.includes("how old are you")){
  processMessage(`⎎ADMIN: 23`);
  }
  else if (message.includes("apner boyosh kotyo")){
  processMessage(`⎎ADMIN: 23`);
}
else if (message.includes("আপনার বয়স কত")){
  processMessage(`⎎ADMIN: ২৩`);
}
  else if (message.includes("ki product payoua jay")){
  processMessage(`⎎ADMIN: SELADER SHIRT PANT T-SHIRT HOODIE`);
  }
  else if (message.includes("what kind of product you have") || message.includes("what kinds of product you have") || message.includes("what kind of products you have") || message.includes("what kind of products do you have") || message.includes("what kind of product you sell") || message.includes("what kinds of product you sell") || message.includes("what kind of products you sell") || message.includes("what kind of products do you sell")){
  processMessage(`⎎ADMIN: MANS SHIRT PANT T-SHIRT HOODIE`);
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
   else if (message.includes("order kobe asbe") || message.includes("order kobe asba")){
  processMessage(`⎎ADMIN: EKDIN ER MODDA`);
   }
  else if (message.includes("অর্ডার কবে আসবে")){
  processMessage(`⎎ADMIN: ১ দিনের মধ্যে`);
  }
else if (message.includes("অর্ডার কখন আসবে")){
  processMessage(`⎎ADMIN: অনুগ্রহ করে অপেক্ষা করুন,আমাদের ডিলেভারিমেন আপনার সাথে যুগাযোগ করবে`);
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
else if (message.includes("what is your phone number") || message.includes("what is your mobile number")){
  processMessage(`⎎ADMIN: 01987167183`);
}
////////////////
///////////////
//////////////
         }, 4000);
});
