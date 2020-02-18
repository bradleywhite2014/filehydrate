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

# Fill-in IDs of your Docs template & any Sheets data source
DOCS_FILE_ID = '1PoW6Dy7aAUgP37bRwnF-7BiUvroMcQ35jCit8jwbF9k'

# authorization constants
CLIENT_ID_FILE = 'credentials.json'
TOKEN_STORE_FILE = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/documents']

# application constants
SOURCES = ('text', 'sheets')
SOURCE = 'text' # Choose one of the data SOURCES
COLUMNS = ['to_name', 'to_title', 'to_company', 'to_address']
TEXT_SOURCE_DATA = (
    ('Ms. Lara Brown', 'Googler', 'Google NYC', '111 8th Ave\n'
                                                'New York, NY  10011-5201'),
    ('Mr. Jeff Erson', 'Googler', 'Google NYC', '76 9th Ave\n'
                                                'New York, NY  10011-4962'),
)

#MAIL MERGE METHODS

def read_paragraph_element(element):
    """Returns the text in the given ParagraphElement.

        Args:
            element: a ParagraphElement from a Google Doc.
    """
    text_run = element.get('textRun')
    if not text_run:
        return ''
    return text_run.get('content')


def read_strucutural_elements(elements):
    """Recurses through a list of Structural Elements to read a document's text where text may be
        in nested elements.

        Args:
            elements: a list of Structural Elements.
    """
    text = ''
    for value in elements:
        if 'paragraph' in value:
            elements = value.get('paragraph').get('elements')
            for elem in elements:
                text += read_paragraph_element(elem)
        elif 'table' in value:
            # The text in table cells are in nested Structural Elements and tables may be
            # nested.
            table = value.get('table')
            for row in table.get('tableRows'):
                cells = row.get('tableCells')
                for cell in cells:
                    text += read_strucutural_elements(cell.get('content'))
        elif 'tableOfContents' in value:
            # The text in the TOC is also in a Structural Element.
            toc = value.get('tableOfContents')
            text += read_strucutural_elements(toc.get('content'))
    return text

def get_doc_content():
    doc = DOCS.documents().get(documentId=DOCS_FILE_ID).execute()
    doc_content = doc.get('body').get('content')
    return(read_strucutural_elements(doc_content))

def get_http_client():
    """Uses project credentials in CLIENT_ID_FILE along with requested OAuth2
        scopes for authorization, and caches API tokens in TOKEN_STORE_FILE.
    """
    store = file.Storage(TOKEN_STORE_FILE)
    creds = store.get()
    # if not creds or creds.invalid:
    # flow = InstalledAppFlow.from_client_secrets_file(CLIENT_ID_FILE,scopes=SCOPES)
    flow = client.flow_from_clientsecrets(CLIENT_ID_FILE, ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents'])
    creds = tools.run_flow(flow, store)
    return creds.authorize(Http())

# service endpoints to Google APIs
HTTP = get_http_client()
DRIVE = discovery.build('drive', 'v3', http=HTTP)
DOCS = discovery.build('docs', 'v1', http=HTTP)
SHEETS = discovery.build('sheets', 'v4', http=HTTP)

def get_data(source):
    """Gets mail merge data from chosen data source.
    """
    if source not in {'sheets', 'text'}:
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

def merge_template(tmpl_id, source, service):
    """Copies template document and merges data into newly-minted copy then
        returns its file ID.
    """
    # copy template and set context data struct for merging template values
    copy_id = _copy_template(tmpl_id, source, service)
    context = merge.iteritems() if hasattr({}, 'iteritems') else merge.items()

    # "search & replace" API requests for mail merge substitutions
    reqs = [{'replaceAllText': {
                'containsText': {
                    'text': '{{%s}}' % key.upper(), # {{VARS}} are uppercase
                    'matchCase': True,
                },
                'replaceText': value,
            }} for key, value in context]

    # send requests to Docs API to do actual merge
    DOCS.documents().batchUpdate(body={'requests': reqs},
            documentId=copy_id, fields='').execute()
    return copy_id


if __name__ == '__main__':
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
    textfromdoc = get_doc_content()
    index1 = -1
    index2 = -1
    index3 = -1
    index4 = -1
    found_merges = []
    #asdfasdfaldf{{alsdkfjalsdf}}
    for i, char in enumerate(textfromdoc):
        print(textfromdoc[i])
        if char == '{':
            if index1 > -1:
                print('already got 1st, adding snd {{')
                #if we have 1, we will hit 2 or reset. aka.. if 1 exists, we just saw it and have our opener
                index2 = i
            else:
                print('found start {')
                index1 = i
        elif char == '}' :
            if index1 > -1 and index2 > -1 :
                if index3 > -1:
                    #3 marked as well, if this is right after 3 were good
                    if i - index3 == 1:
                        index4 = i
                        #we got 4 to hit the score, grab it
                        print("did it work? " + textfromdoc[ index1: index1 + index4 - index1 + 1])
                        found_merges.append(textfromdoc[ index1: index1 + index4 - index1 + 1])
                        print("start searching again...")
                        index1 = -1
                        index2 = -1
                        index3 = -1
                        index4 = -1
                    else:
                        #if we got 3 and 4 didnt immediately follow, then 3 was a lie, going back to 2
                        print("blew it going for 4...")
                        index3 = -1
                        index4 = -1
                else:
                    #we can mark 3 if we got 1 and 2, and 3 isnt immediately following
                    print("221")
                    if i - index2 == 1:
                        #if we got a closer but no gap, consider it middle
                        index3 = -1
                        index4 = -1  
                    else:
                        print("227")
                        #we got two openers and a gap, we got 3 now
                        index3 = i               
                        print('{{}')      
            else :
                #reset if we get a close and we dont have the opening {{
                print("233")
                index1 = -1
                index2 = -1
                index3 = -1
                index4 = -1
        else :
            #if we dont have a bracket we could be in the middle
            if index1 > -1 and index2 > 2:

                if index3 > -1:
                    #if we have 3, we just failed to close, but 3 was a lie, time to hide it
                    index3 = -1
                    print("245")

                #chillin, in da middle
        

    #print(textfromdoc)
    print("found")
    print(found_merges)

    # get row data, then loop through & process each form letter
    data = get_data(SOURCE) # get data from data source
    for i, row in enumerate(data):
        #merge.update(dict(zip(COLUMNS, row)))
        print('Merged letter %d: docs.google.com/document/d/%s/edit' % (
                i+1, merge_template(DOCS_FILE_ID, SOURCE, DRIVE)))
# [END mail_merge_python]