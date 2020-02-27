from __future__ import print_function
from google.auth.transport import requests
from google.oauth2 import id_token
 
def generatePolicy(principalId,idInfo, effect, methodArn):
    authResponse = {}
    authResponse['principalId'] = principalId
 
    if effect and methodArn:
        policyDocument = {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'FirstStatement',
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': methodArn
                }
            ]
        }
 
        authResponse['policyDocument'] = policyDocument
        
        if idInfo is not None:
            context = {
                'idInfo': idInfo
            }
            authResponse['context'] = context
 
    return authResponse
 
def lambda_handler(event, context):
    try:
        # Verify and get information from id_token
        idInformation = id_token.verify_oauth2_token(
            event['authorizationToken'],
            requests.Request(),
            '382267252700-gvhfvt7467hqlsuro9v4g7fc31v75q4h.apps.googleusercontent.com')
        print(idInformation)
 
        # Deny access if the account is not a Google account
        if idInformation['iss'] not in ['accounts.google.com', 
            'https://accounts.google.com']:
            return generatePolicy(None, 'Deny', event['methodArn'])
 
        # Get principalId from idInformation
        principalId = idInformation['sub']
        idInfo = idInformation
 
    except ValueError as err:
        # Deny access if the token is invalid
        print(err)
        return generatePolicy(None, 'Deny', event['methodArn'])
 
    return generatePolicy(principalId, idInfo, 'Allow', event['methodArn'])