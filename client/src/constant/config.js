//notification api messages

export const API_NOTIFICATION_MESSAGES = {
  loading: {
    message: "Loading...",
  },
  success: {
    title: "success",
    message: "Data successufully loaded",
  },
  responseFailure: {
    title: "Error",
    message:
      "An error occured while fetching response from the server. Please try again later",
  },
  requestFailure: {
    title: "Error",
    message: "An error occured while parsing request data",
  },
  networkError: {
    title: "Error",
    message: "Unable to connect try again later",
  },
};

//API  service call
//sample request
//need service call:{url:'/' ,method:'POST/GET/PUT/DELETE', params:true/false,query:true/false}

export const SERVICE_URLS = {
  userSignup: { url: "/signup", method: "POST" },
  userLogin: { url: "/login", method: "POST" },
};
