/* eslint-disable no-undef */
let apiRoot = ""
if (process.env.BUILD_MODE === "development") {
  apiRoot = "http://localhost:3000/v1"
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = ""
}
// export const API_ROOT = 'http://localhost:1302'
export const API_ROOT = apiRoot
