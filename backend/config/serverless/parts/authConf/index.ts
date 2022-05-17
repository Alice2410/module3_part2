export const signUp = {
  handler: "api/auth/handler.signUp",
  description: "Sign up users",
  timeout: 6,
  memorySize: 128,
  events: [
    {
      httpApi: {
        path: "/auth/signup",
        method: "post"
      }
    }
  ]
};

export const logIn = {
  handler: "api/auth/handler.logIn",
  description: "Log in user",
  timeout: 6,
  memorySize: 128,
  events: [
    {
      httpApi: {
        path: "/auth/login",
        method: "post"
      }
    }
  ]
};

export const uploadDefaultUsers = {
  handler: "api/auth/handler.uploadDefaultUsers",
  description: "Upload default users to DB",
  timeout: 6,
  memorySize: 128,
  events: [
    {
      httpApi: {
        path: "/auth/upload-default-users",
        method: "post"
      }
    }
  ]
};

export const authenticate = {
  handler: "api/auth/handler.authenticate",
  description: "Authenticate user",
  timeout: 6,
  memorySize: 128
};