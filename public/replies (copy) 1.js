// Assuming you have a function to handle the message processing
function processMessage(message) {
    $('#iframe-input').val(message);
    $('#message-form').submit();
}

window.addEventListener('message', (event) => {
    try {
        const receivedMessage = event.data.message;

        if (receivedMessage && receivedMessage.includes("hi")) {
            processMessage(receivedMessage);

            // Additional action after 3 seconds
            setTimeout(() => {
                processMessage("⎎ADMIN: Hello " + name);
            }, 3000);
        }
    } catch (error) {
        console.error("Error processing message:", error);
    }
});
