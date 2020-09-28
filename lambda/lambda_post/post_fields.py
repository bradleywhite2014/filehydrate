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
import re
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

def find_table_elements(elements):
    """Recurses through a list of Structural Elements to read a document's text where text may be
        in nested elements.

        Args:
            elements: a list of Structural Elements.
    """
    allTables = []
    text = ''
    for value in elements:
        if 'table' in value:
            # The text in table cells are in nested Structural Elements and tables may be
            # nested.
            allTables.append(value)
    return allTables

def convert_tables_to_row_inserts(tables,merge_items):
    inserts = []
    if(len(tables) > 0):
        # weve got some tables to check
        for item in tables:
            table = item.get('table')
            rows = table.get('tableRows')
            for index, row in enumerate(rows):
                cells = row.get('tableCells')
                for cell in cells:
                    elements = cell.get('content')
                    if not elements:
                        continue;
                    for value in elements:
                        if 'paragraph' in value:
                            paraElements = value.get('paragraph').get('elements')
                            for elem in paraElements:
                                str = elem.get('textRun').get('content')
                                mergeFieldsInCell = re.findall(r"{{\w+}}", str)
                                if(len(mergeFieldsInCell) > 0):
                                    # LATEST: CURRENTLY INSERTING TOO MANY ROWS - 3 FOR EACH FIELD, NEED TO CHECK AND
                                    # LIMIT THE ROW INSERTS
                                    # FAILING TO REVERSE FILLER INSERTS, GETTING OUT OF INDEX, VERY CLOSE!!
                                    # this cell has a merge field, need to duplicate line

                                    # note: this is greedy and only checks the first, assuming
                                    # that implementors would not have half of a row repeating
                                    # while another value is not. It is assumed one value can
                                    # represent the type of all other values. if repeating: new rows
                                    if isinstance(merge_items[mergeFieldsInCell[0]], list):
                                        for x in range(len(merge_items[mergeFieldsInCell[0]]) - 1):
                                            inserts.append({
                                                'insertTableRow': {
                                                    'tableCellLocation': {
                                                        'tableStartLocation': {
                                                                'index': item.get('startIndex')
                                                        },
                                                        'rowIndex': index,
                                                        'columnIndex': 1
                                                    },
                                                    'insertBelow': 'true'
                                                }
                                            })
                                        return inserts
    return inserts

def convert_tables_to_merge_filler_inserts(tables,merge_items):
    inserts = []
    if(len(tables) > 0):
        # weve got some tables to check
        for item in tables:
            table = item.get('table')
            rows = table.get('tableRows')
            for index, row in enumerate(rows):
                cells = row.get('tableCells')
                for cellIndex, cell in enumerate(cells):
                    elements = cell.get('content')
                    if not elements:
                        continue;
                    for value in elements:
                        if 'paragraph' in value:
                            paraElements = value.get('paragraph').get('elements')
                            for elem in paraElements:
                                str = elem.get('textRun').get('content')
                                mergeFieldsInCell = re.findall(r"{{\w+}}", str)
                                if(len(mergeFieldsInCell) > 0):
                                    # this cell has a merge field, need to duplicate line

                                    # note: this is greedy and only checks the first, assuming
                                    # that implementors would not have half of a row repeating
                                    # while another value is not. It is assumed one value can
                                    # represent the type of all other values. if repeating: new rows
                                    if isinstance(merge_items[mergeFieldsInCell[0]], list):
                                        for x in range(len(merge_items[mergeFieldsInCell[0]])):
                                            if(x == 0):
                                                continue
                                            nextRow = rows[index + x]
                                            cells = nextRow.get('tableCells')
                                            for nextRowCellIndex, cell in enumerate(cells):
                                                if(cellIndex == nextRowCellIndex):
                                                    if(isinstance(cell, dict)):
                                                        elements = cell.get('content')
                                                        if not elements:
                                                            continue;
                                                        for i, el in enumerate(elements):
                                                            if 'paragraph' in el:  
                                                                fillerText = str.replace(mergeFieldsInCell[0],mergeFieldsInCell[0] + "_{}".format(x))
                                                                fillerText = fillerText.replace("\n", "")
                                                                inserts.append({
                                                                    'insertText': {
                                                                        'location': {
                                                                            'index': el.get('startIndex'),
                                                                        },
                                                                        'text': fillerText
                                                                    }
                                                                })
                                            
    return inserts


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
    context = merge.iteritems() if hasattr({}, 'iteritems') else merge.items()
    
    doc = docs.documents().get(documentId=copy_id).execute()
    doc_content = doc.get('body').get('content')
    # need to eventually find all tables, not just one
    tables = find_table_elements(doc_content)
    inserts = convert_tables_to_row_inserts(tables,merge_items)
    # if we didnt find any inserts, who cares about array row replacement, we had no arrays
    if(len(inserts) > 0):
        _updResp = docs.documents().batchUpdate(body={'requests': inserts},
                documentId=copy_id, fields='').execute()
        doc = docs.documents().get(documentId=copy_id).execute()
        doc_content = doc.get('body').get('content')
        tables = find_table_elements(doc_content)

        fillerInserts = convert_tables_to_merge_filler_inserts(tables,merge_items)
        fillerInserts.sort(key=lambda x: x['insertText']['location']['index'], reverse=True)
        # need to eventually find all tables, not just one
        if(len(fillerInserts) > 0 ):
            docs.documents().batchUpdate(body={'requests': fillerInserts},
                    documentId=copy_id, fields='').execute()

    ## now that the template is ready for lists, lets merge               
    reqs = []
    for key, value in merge_items.items():
        if(isinstance(value,list)):
            for i, val in enumerate(value):
                if(str(val) == "~~delete~~"):
                    val = ""
                replaceText = key.upper()
                if(i != 0):
                    replaceText = key.upper() + "_{}".format(i)
                reqs.append({'replaceAllText': {
                    'containsText': {
                        'text': '%s' % replaceText, # {{VARS}} are uppercase
                        'matchCase': True,
                    },
                    'replaceText': str(val),
                }})
        else:
            if(str(value) == "~~delete~~"):
                value = ""
            reqs.append({'replaceAllText': {
                    'containsText': {
                        'text': '%s' % key.upper(), # {{VARS}} are uppercase
                        'matchCase': True,
                    },
                    'replaceText': str(value),
                }})
    reqs.reverse()
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