/**
 * Created by admin on 2017/7/12.
 */
import 'whatwg-fetch'
import fetchIntercept from 'fetch-intercept';

let env = process.env.NODE_ENV

export function fetchData(url,data = {},fn){

    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': 'debug'
        },
        body: JSON.stringify(data)
    }

    const unregister = fetchIntercept.register({
        request: function (url, config) {
            // Modify the url or config here
            console.log(env)
            if(env == 'development'){
                url = `api/${url}`
            }
            // console.log(url, config)
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
    });

    // Call fetch to see your interceptors in action.
    fetch(url,option).then(function (response) {
        return response.text()
    }).then(function (body) {
        if(fn){
          fn(body)
        }
    }).catch(function(error) {
        console.log('request failed', error)
    })

    // Unregister your interceptor
    unregister();
}