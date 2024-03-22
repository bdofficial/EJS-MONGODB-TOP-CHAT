function processMessage(message) {
    $('#iframe-input').val(message);
    $('#message-form').submit();
}

window.addEventListener('message', (event) => {
const receivedMessage = event.data.message;
  processMessage(receivedMessage);
setTimeout(() => {
if (receivedMessage.includes("hi")) {
const parts = receivedMessage.split(/[@:]/);
const name = parts[1].trim();
processMessage(`⎎ADMIN: Hello ${name}`);              
        }
else if (receivedMessage.includes("✓ORDER")){
  processMessage(`⎎ADMIN: Your order have been received`);
}
         }, 2000);
});
