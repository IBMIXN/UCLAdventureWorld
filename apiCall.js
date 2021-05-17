/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */

const request = require('request');


function main(param) {
    city = param["city"];
    console.log(city);

    const options = {
      method: 'GET',
      url: 'https://tripadvisor1.p.rapidapi.com/locations/search',
      qs: {
        query: city,
        limit: '1',
        sort: 'relevance',
        offset: '0',
        lang: 'en_US',
        currency: 'USD',
        units: 'km'
      },
      headers: {
        'x-rapidapi-key': '999c2985c6msh57d4cee167153ebp1476fdjsn9614b09d1759',
        'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
        useQueryString: true
      }
    };
    console.log("BDD");

    request(options, function (error, response, body) {
        console.log("x");

    	if (error) throw new Error(error);
    	console.log(body);
        console.log("dmkdm");

    	return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'accept': "application/json",
                'authorization': "8190978a-0789-4fbf-b7c9-0446525ff294:AImEyW8UB1iLxwBww8ZVxoVpWlpFaxVxklOeeEKcHKbvOvusssZf8bUFiq5dLPxJ"
            },
            'body': {"message": body}
        }
    });




// 	return { message: 'Hello World' };
    // return {
    //         'statusCode': 200,
    //         'headers': {
    //             'Content-Type': 'application/json',
    //             'accept': "application/json",
    //             'authorization': "8190978a-0789-4fbf-b7c9-0446525ff294:AImEyW8UB1iLxwBww8ZVxoVpWlpFaxVxklOeeEKcHKbvOvusssZf8bUFiq5dLPxJ"
    //         },
    //         'body': {"message": "aaaa"}
    //     }
}
