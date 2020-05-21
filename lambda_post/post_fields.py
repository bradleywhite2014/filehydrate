# -*- coding: utf-8 -*-
#
# Copyright ©2018-2019 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
docs-mail-merge.py (Python 2.x or 3.x)

Google Docs (REST) API mail-merge sample app
"""
# [START mail_merge_python]
from __future__ import print_function
import time
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient import discovery
from httplib2 import Http
from oauth2client import file, client, tools
import json

# authorization constants
SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/documents']

# application constants
SOURCES = ('text', 'mirakl')
SOURCE = 'text' # Choose one of the data SOURCES
COLUMNS = ['to_name', 'to_title', 'to_company', 'to_address']
TEXT_SOURCE_DATA = (
    ('Ms. Lara Brown', 'Googler', 'Google NYC', '111 8th Ave\n'
                                                'New York, NY  10011-5201')
)

# fill-in your data to merge into document template variables
merge = {
    # sender data
    'my_name': 'Bradlely WHITE',
    'my_address': '1600 Amphitheatre Pkwy\n'
                    'Mountain View, CA  94043-1351',
    'my_email': 'http://google.com',
    'my_phone': '+1-650-253-0000',
    # - - - - - - - - - - - - - - - - - - - - - - - - - -
    # recipient data (supplied by 'text' or 'sheets' data source)
    'to_name': None,
    'to_title': None,
    'to_company': None,
    'to_address': None,
    # - - - - - - - - - - - - - - - - - - - - - - - - - -
    'date': time.strftime('%Y %B %d'),
    # - - - - - - - - - - - - - - - - - - - - - - - - - -
    'body': 'Google, headquartered in Mountain View, unveiled the new '
            'Android phone at the Consumer Electronics Show. CEO Sundar '
            'Pichai said in his keynote that users love their new phones.'
}


def get_data(source):
    """Gets mail merge data from chosen data source.
    """
    if source not in {'mirakl', 'text'}:
        raise ValueError('ERROR: unsupported source %r; choose from %r' % (
            source, SOURCES))
    return SAFE_DISPATCH[source]()

def _get_text_data():
    """(private) Returns plain text data; can alter to read from CSV file.
    """
    return TEXT_SOURCE_DATA

# data source dispatch table [better alternative vs. eval()]
SAFE_DISPATCH = {k: globals().get('_get_%s_data' % k) for k in SOURCES}

def _copy_template(tmpl_id, source, service):
    """(private) Copies letter template document using Drive API then
        returns file ID of (new) copy.
    """
    body = {'name': 'Merged form letter (%s)' % source}
    return service.files().copy(body=body, fileId=tmpl_id,
            fields='id').execute().get('id')

def fetch_available_merges():
    DOCS.documents().read()

def merge_template(tmpl_id, source, service, docs, merge_items):
    """Copies template document and merges data into newly-minted copy then
        returns its file ID.
    """
    # copy template and set context data struct for merging template values
    copy_id = _copy_template(tmpl_id, source, service)

    # "search & replace" API requests for mail merge substitutions
    reqs = [{'replaceAllText': {
                'containsText': {
                    'text': '%s' % key.upper(), # {{VARS}} are uppercase
                    'matchCase': True,
                },
                'replaceText': value,
            }} for key, value in merge_items.items()]

    # send requests to Docs API to do actual merge
    docs.documents().batchUpdate(body={'requests': reqs},
            documentId=copy_id, fields='').execute()
    return copy_id


def go(event, context, merge_items): 


    # Fill-in IDs of your Docs template & any Sheets data sourcekey1
    DOCS_FILE_ID = event['queryStringParameters']['docId']

    merges = event['body']


    def get_http_client(token):
        creds = client.AccessTokenCredentials(token,
            'my-user-agent/1.0')
        return creds.authorize(Http())

    # service endpoints to Google APIs
    HTTP = get_http_client(event['queryStringParameters']['access_token'])


    DRIVE = discovery.build('drive', 'v3', http=HTTP)
    DOCS = discovery.build('docs', 'v1', http=HTTP)

    # get row data, then loop through & process each form letter
    return merge_template(DOCS_FILE_ID, SOURCE, DRIVE, DOCS, merge_items)


def lambda_handler(event, context):
    # TODO lambda handler
    created_ids = []
    merge_items = json.loads(event['body'])
    for merge_obj in merge_items:        # Second Example
        created_ids.append(go(event, context, merge_obj))
    #return event['queryStringParameters']['docId']
    return {
        'statusCode': 200,
        'body': json.dumps(created_ids),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            }
    }