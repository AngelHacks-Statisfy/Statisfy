
from __future__ import print_function

import json
import urllib
import boto3
import requests
# [requirement packages for google client api]
from googleapiclient import discovery
import base64
# [end]


print('Loading function')
s3 = boto3.client('s3')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key']).decode('utf8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        result = main(response['Body'])
        
        print(result)
        
        try:
            post_request(result['result'])
        except:
            print("post request failed")
        
        return result

    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        return 0


def post_request(result):
    s = requests.session()
    s.keep_alive = False
    url = "http://ec2-54-85-202-76.compute-1.amazonaws.com:8080/api/v1/saveNutrition"
    r = s.post(url, data = {'foodItem': result})
    print(r.status_code)


def main(image):
    """Run a label request on a single image"""

    # [START authenticate]
    service = discovery.build('vision', 'v1', 
    developerKey='AIzaSyBpCWAtdJnImVxcUvM2v4Co7l_U_n-JOro')
    # [END authenticate]

    # [START construct_request]
    image_content = base64.b64encode(image.read())

    service_request = service.images().annotate(body={
        'requests': [{
            'image': {
                'content': image_content.decode('UTF-8')
            },
            'features': [{
                'type': 'LABEL_DETECTION',
                'maxResults': 1
            },
            {
                'type': 'LOGO_DETECTION',
                'maxResults': 1
            }]
        }]
    })
    # [END construct_request]
    # [START parse_response]
    response = service_request.execute()
    result = {}

    try:
        logo = response['responses'][0]['logoAnnotations']

        for logo_dict in logo:
            result['result'] = logo_dict['description']
            # print("logo %d:"%idx, logo_dict['description'])
    except:
        try:
            label = response['responses'][0]['labelAnnotations']

            for label_dict in label:
                # print("label %d:"%idx, label_dict['description'])
                result['result'] = label_dict['description']
        except:
            return None

    return result
    # [END parse_response]


# [START run_application]
# [END run_application]



