import fetchIntercept from "fetch-intercept";
import authService from "../services/authService";

const securedUrls = [
    "http://sefdb02.qut.edu.au:3000/people"
]

const bearerIntercept = () => {
    fetchIntercept.register({
        request: function (url, config) {
            if (securedUrls.some(str => url.startsWith(str))) {
                const bearerToken = authService.getBearerToken();
                if (bearerToken) {
                    config = config || {}
                    const headers = config.header || {}
                    config.headers = {
                        ...headers,
                        //'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearerToken.token}`
                    }
                }
            }
            return [url, config];
        },

        requestError: function (error) {
            // Called when an error occured during another 'request' interceptor call
            return Promise.reject(error);
        },

        response: function (response) {
            // Modify the reponse object
            return response;
        },
        responseError: function (error) {
            // Handle an fetch error
            return Promise.reject(error);
        }
    })
};

export default bearerIntercept;


