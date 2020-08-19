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
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from './Button';
import _ from 'underscore'
import TagModal from './TagModal';
import Skeleton from '@material-ui/lab/Skeleton';


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

  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onTagClick } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headerTagClick = (property) => (event) => {
    onTagClick(event, property);
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
            style={props.mappingFields[headCell.id].column_mapping ? {color: 'green', backgroundColor: '#00ff002b', borderTopLeftRadius: '25px', borderTopRightRadius: '25px'} : {}}
          >
            {props.mappingFields[headCell.id].open_tag ? (
              <React.Fragment>
                <TagModal header={headCell.id} mappingFields={props.mappingFields}/>
                <LabelTwoToneIcon onClick={headerTagClick(headCell.id)} style={{color: 'green', transform: `translate(${-22}px`, cursor: 'pointer' }}/>
              </React.Fragment>
            ) : 
              <LabelTwoToneIcon onClick={headerTagClick(headCell.id)} style={{transform: `translate(${-22}px`, cursor: 'pointer' }}/>
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
  const { allOrders, docId, selected, submitMergeFields, numSelected, formFields, mappingFields, triggerRefresh, triggerLoadTemplate, triggerSaveTemplate , isLoadingTemplate} = props;

  const onClickMerge = (docId, allOrders, selected, formFields, mappingFields) => {
    if(selected.length < 11){
    const ordersToMerge = allOrders.filter((order) => {
      return selected.indexOf(order['Order Id']) !== -1
    })
    //TODO: clean this mess up
    const findMappingValue = (order, mappingKey, mappingFields) => {
      let temp = ''
      Object.keys(mappingFields).forEach((field) => {
        if(mappingFields[field].column_mapping === mappingKey){
          //if match, grab value for this row
          temp = order[field]
        }
      })
      return temp
    }

    const convertOrderToMergeFields = (order, formFields, mappingFields) => {
      let temp = {}
      Object.keys(formFields).forEach((field) => {
        // for each field, use the mapping fields to get its value
        temp[field] = findMappingValue(order, field, mappingFields)
      })
      return temp
    }

    let mappedVals = []
    ordersToMerge.forEach((order) => {
      mappedVals.push(convertOrderToMergeFields(order,formFields,mappingFields))   
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
         style={{marginBottom: 15,marginTop: 15,marginRight: 15}} 
         onClick={() => onClickMerge(docId, allOrders, selected,formFields,mappingFields)}
       >
         {'Merge'}
       </Button>  
     </React.Fragment>
      ) : (
        isLoadingTemplate ?
        <CircularProgress />
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
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleTagClick = (event, property) => {
    props.onTagClick(property);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.orders.map((n) => n['Order ID']);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.orders.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
          <React.Fragment>
            <EnhancedTableToolbar isLoadingTemplate={props.isLoadingTemplate} triggerLoadTemplate={props.triggerLoadTemplate} triggerSaveTemplate={props.triggerSaveTemplate} triggerRefresh={props.triggerRefresh} mappingFields={props.mappingFields} formFields={props.formFields} docId={props.docId} submitMergeFields={props.submitMergeFields} allOrders={props.orders} selected={selected} numSelected={selected.length} />
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
                  rowCount={props.orders.length}
                  mappingFields={props.mappingFields}
                  miraklHeaders={props.miraklHeaders}
                  orders={props.orders}
                />
                <TableBody>
                  {stableSort(props.orders, getComparator(order, orderBy))
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
                            props.miraklHeaders.map((header,index) => {
                              return <TableCell key={'cell-'+ index.toString()} align="center" style={props.mappingFields[header] ? props.mappingFields[header].column_mapping ? {color: 'green', backgroundColor: '#00ff002b'} : {} : {}}>{!!row[header] ? (typeof row[header] === 'object' ? 'Click for details...'  : row[header]) : ''}</TableCell>
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
            count={props.orders.length}
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
