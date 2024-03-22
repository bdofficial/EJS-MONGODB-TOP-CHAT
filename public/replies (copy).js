window.addEventListener('message', (event) => {

if (event.data.message.includes("hi")) {
  $('#iframe-input').val(event.data.message);
  $('#message-form').submit();

  // Additional action after 2 seconds
  setTimeout(function() {
      $('#iframe-input').val("hello sabbir");
      $('#message-form').submit();
  }, 3000); // 2000 milliseconds = 2 seconds
    }
  
});