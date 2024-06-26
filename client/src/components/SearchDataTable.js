import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import LabelTwoToneIcon from '@material-ui/icons/LabelTwoTone';
import ListAltTwoToneIcon from '@material-ui/icons/ListAltTwoTone';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from './Button';
import _ from 'underscore'
import TagModal from './TagModal';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const headCells = props.miraklHeaders.map((lbl) => {
    return {id: lbl, numeric: false, disablePadding: false, label: lbl}
  })

  const { classes, onSelectAllClick, order, tableList, orderBy, numSelected, rowCount, onRequestSort, onTagClick, onTableClick } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headerTagClick = (property) => (event) => {
    onTagClick(event, property);
  }

  const headerTableClick = (property) => (event) => {
    onTableClick(property, null);
  }

  const renderColumnIcon = (mappingFields, headCell, tableList, modalTableListKeyList) => {
    if(tableList.length > 0){
      if(Array.isArray(tableList[0][headCell.id]) && tableList[0][headCell.id].length > 0 && (!Array.isArray(tableList[0][headCell.id][0]) && typeof tableList[0][headCell.id][0] === 'object')){
        //if this column holds lists of objects, then we can display it as a table.. show table icon
        return <EventNoteIcon onClick={headerTableClick(headCell.id)} style={{transform: `translate(${-22}px`, cursor: 'pointer' }}/>
      }
    }
    let subFields = mappingFields
    modalTableListKeyList.forEach((field) => {
      subFields = subFields[field]
    })

    //if we dont catch early with the table check, just check if its green or not
    if(subFields[headCell.id]){
      return subFields[headCell.id].open_tag ? (
        <React.Fragment>
          <TagModal header={headCell.id} mappingFields={mappingFields} subFields={subFields}/>
          <LabelTwoToneIcon onClick={headerTagClick(headCell.id)} style={{color: 'green', transform: `translate(${-22}px`, cursor: 'pointer' }}/>
        </React.Fragment>
      ) : 
        <LabelTwoToneIcon onClick={headerTagClick(headCell.id)} style={{transform: `translate(${-22}px`, cursor: 'pointer' }}/>
    }else{
      return <LabelTwoToneIcon onClick={headerTagClick(headCell.id)} style={{transform: `translate(${-22}px`, cursor: 'pointer' }}/>
    }
  }

  const renderIconStyle = (mappingFields,header, modalTableListKeyList) => {

    let subFields = mappingFields
    modalTableListKeyList.forEach((field) => {
      subFields = subFields[field]
    })

    if(!!subFields[header]){
      return subFields[header].column_mapping ? {color: 'green', backgroundColor: '#00ff002b', borderTopLeftRadius: '25px', borderTopRightRadius: '25px'} : {}
    }else{
      return {};
    }
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={renderIconStyle(props.mappingFields, headCell.id, props.modalTableListKeyList)}
          > 
            {
              renderColumnIcon(props.mappingFields,headCell,props.tableList,props.modalTableListKeyList)
            }
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              style={{height: '100px'}}
            > 
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { tableList, docId, selected, submitMergeFields, numSelected, formFields, formToMappingFields, mappingFields, triggerRefresh, triggerLoadTemplate, triggerSaveTemplate , isLoadingTemplate, modalTableListKey} = props;

  const onClickMerge = (docId, tableList, selected, formFields, mappingFields) => {
    if(selected.length < 11){
    const ordersToMerge = tableList.filter((order) => {
      return selected.indexOf(order['Order Id']) !== -1
    })
    const convertPathAndKeyToList = (order, path, finalKey, result) => {
      let currentKey = path.pop(0);
      order[currentKey].forEach((row) => {
        if(path.length === 0){
          // we popped the last one, use the finalKey key
          result.push(row[finalKey]);
        }else{
          convertPathAndKeyToList(order[currentKey],path,finalKey,result)
        }
      })
      
      return {}
    }

    const convertOrderToMergeFields = (order, formToMappingFields, formFields) => {
      let temp = {}
      let formToMapKeys = Object.keys(formToMappingFields);
      formToMapKeys.forEach((key) => {
        if(formToMappingFields[key].path.length === 0){
          //were at the base, just grab it
          temp[key] = order[formToMappingFields[key].value]
        }else{
          let arrayValue = []
          let tempPath = []
          formToMappingFields[key].path.forEach((path) => {
            tempPath.push(path)
          })
          convertPathAndKeyToList(order, formToMappingFields[key].path, formToMappingFields[key].value, arrayValue)
          //reset to avoid pointer issues
          tempPath.forEach((subPath) => {
            formToMappingFields[key].path.push(subPath)
          })
          temp[key] = arrayValue
        }
      })
      //add any fields we didnt have in the formToMaps
      Object.keys(formFields).forEach((formField) => {
        if(temp[formField] === undefined){
          temp[formField] = '~~delete~~'
        }
        if(!temp.hasOwnProperty(formField)){
          temp[formField] = ''
        }
      })
      return temp
    }

    let mappedVals = []
    ordersToMerge.forEach((order) => {
      mappedVals.push(convertOrderToMergeFields(order,formToMappingFields, formFields))   
    })
    submitMergeFields({docId, formFields: mappedVals});
  }
}

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <React.Fragment>
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
         <Button
         color="secondary"
         size="large"
         variant="contained"
         disabled={isLoadingTemplate}
         style={{marginBottom: 15,marginTop: 15,marginRight: 15}} 
         onClick={() => onClickMerge(docId, tableList, selected,formFields,mappingFields)}
       >
         {'Merge'}
       </Button>  
     </React.Fragment>
      ) : (
        isLoadingTemplate ?
        <div style={{zIndex: '1000'}}>
        <CircularProgress  />
        </div>
       :
       <>
       <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
         Files
       </Typography>
       <Tooltip title={'Refresh'}>
         <RefreshIcon style={{cursor: 'pointer', marginRight: '8px'}} onClick={triggerRefresh}/>
       </Tooltip>
       <Tooltip title={'Save Mappings'}>
         <SaveIcon style={{cursor: 'pointer', marginRight: '8px'}} onClick={triggerSaveTemplate}/>
       </Tooltip>
       <Tooltip title={'Load Mappings'}>
         <SystemUpdateAltIcon style={{cursor: 'pointer', marginRight: '8px'}} onClick={triggerLoadTemplate}/>
       </Tooltip>
      </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function SearchDataTable(props) {

  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('Created Date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleTagClick = (event, property) => {
    props.onTagClick(property);
  }

  const handleTableClick = (e, property, row) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    props.onTableClick({property, id: row['Order Id']});
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.tableList.map((n) => n['Order Id']);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const renderIconStyle = (mappingFields,header, modalTableListKeyList) => {
    let subFields = mappingFields
    modalTableListKeyList.forEach((field) => {
      subFields = subFields[field]
    })

    if(!!subFields[header]){
      return subFields[header].column_mapping ? {color: 'green', backgroundColor: '#00ff002b'} : {}
    }else{
      return {};
    }
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.tableList.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
          <React.Fragment>
            <EnhancedTableToolbar 
              modalTableListKey={props.modalTableListKey}
              isLoadingTemplate={props.isLoadingTemplate}
              triggerLoadTemplate={props.triggerLoadTemplate}
              triggerSaveTemplate={props.triggerSaveTemplate}
              triggerRefresh={props.triggerRefresh}
              formToMappingFields={props.formToMappingFields}
              mappingFields={props.mappingFields}
              formFields={props.formFields}
              docId={props.docId}
              submitMergeFields={props.submitMergeFields}
              tableList={props.tableList}
              selected={selected}
              numSelected={selected.length}
            />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'small'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  onTagClick={handleTagClick}
                  onTableClick={handleTableClick}
                  rowCount={props.tableList.length}
                  mappingFields={props.mappingFields}
                  miraklHeaders={props.miraklHeaders}
                  tableList={props.tableList}
                  modalTableListKey={props.modalTableListKey}
                  modalTableListKeyList={props.modalTableListKeyList}
                />
                <TableBody>
                  {stableSort(props.tableList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row['Order Id']);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row['Order Id'])}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={'row-'+index.toString()}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                          {
                            props.miraklHeaders.map((header,headerIndex) => {
                              return <TableCell 
                                key={'cell-'+ headerIndex.toString()}
                                align="center"
                                style={renderIconStyle(props.mappingFields, header, props.modalTableListKeyList)}>
                                {!!row[header] ? 
                                  ((Array.isArray(row[header]) && typeof row[header][0] !== 'object') ? row[header].toString() : (typeof row[header] === 'object' ? <div onClick={(e) => handleTableClick(e, header, row)} style={{display: 'flex', cursor: 'pointer'}}><ZoomInIcon />Expand</div>: row[header])) : ''}
                              </TableCell>
                            })
                          }
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25,100,500]}
            component="div"
            count={props.tableList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </React.Fragment>        
      </Paper>
    </div>
  );
}
