var API = new API_WRAPPER();

function ErrorHandler (error) {
  console.log(error);
  alert('API Error: ' + error.responseJSON.message);
};

// function noty (style, message, timeout) {
//   Noty
// }
