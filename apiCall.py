#
#
# main() will be run when you invoke this action
#
# @param Cloud Functions actions accept a single parameter, which must be a JSON object.
#
# @return The output of this action, which must be a JSON object.
#
#
import sys
import requests

url = "https://tripadvisor1.p.rapidapi.com/locations/search"

headers = {
    'x-rapidapi-key': "999c2985c6msh57d4cee167153ebp1476fdjsn9614b09d1759",
    'x-rapidapi-host': "tripadvisor1.p.rapidapi.com"
}


def getCityInfo(city):
    url = "https://tripadvisor1.p.rapidapi.com/locations/search"
    querystring = {"limit": 1, "sort": "relevance", "offset": "0", "lang": "en_US",
                   "currency": "USD", "units": "km", "query": city}
    try:
        headers = {
            'x-rapidapi-host': "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "999c2985c6msh57d4cee167153ebp1476fdjsn9614b09d1759"
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        return response
    except:
        return


def getCityDescription(city):
    try:
        return {"description": getCityInfo(city).json()['data'][0]['result_object']["geo_description"]}
    except:
        return {"description": (str(city) + " is a great choice!")}


def main(params):
    try:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'accept': "application/json",
                'authorization': "8190978a-0789-4fbf-b7c9-0446525ff294:AImEyW8UB1iLxwBww8ZVxoVpWlpFaxVxklOeeEKcHKbvOvusssZf8bUFiq5dLPxJ"
            },
            'body': {"message": getCityDescription(params["city"])}
        }
    except:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'accept': "application/json",
                'authorization': "8190978a-0789-4fbf-b7c9-0446525ff294:AImEyW8UB1iLxwBww8ZVxoVpWlpFaxVxklOeeEKcHKbvOvusssZf8bUFiq5dLPxJ"},
            'body': {'message': 'Error processing your request'}
        }
