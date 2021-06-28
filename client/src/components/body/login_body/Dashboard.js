import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {Link, useHistory} from 'react-router-dom'
import {fetchAllUsers, dispatchGetAllUsers} from '../../../redux/actions/usersAction'
import PropTypes from 'prop-types';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const initialState = {
  err: '',
  success: ''
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: theme.spacing(3)
  },
  table: {
    minWidth: 700,
  },
  headRow: {
    backgroundColor: theme.palette.background.popover,
  },
  headCell: {
    fontFamily: "NunitoSans-Bold",
    lineHeight: "normal"
  },
  colorLabel: {
    padding: theme.spacing(0.2, 1),
    whiteSpace: "noWrap",
    borderRadius: '0.8em',
    color: theme.palette.primary.contrastText
  },
  center: {
    textAlign: "center"
  },
  noBorder: {
    border: 0
  }
}));

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  
  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
  
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function Dashboard(props) {

  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const users = useSelector(state => state.users)

  const {user, isAdmin} = auth
  const [data, setData] = useState(initialState)

  const [open, setOpen] = React.useState(false)

  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [callback, setCallback] = useState(false)
  const dispatch = useDispatch()
  
  const classes = useStyles();
  const { onPageInteraction, noPagination = false } = props
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPageInteraction && onPageInteraction(rowsPerPage, newPage+1)
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onPageInteraction && onPageInteraction(parseInt(event.target.value, 10), 1)
  };
  
  useEffect(() => {
    !onPageInteraction && setPage(0);
  }, [onPageInteraction])
  
  useEffect(()=>{
    if(noPagination && users.length > 10){
      setRowsPerPage(users.length)
    }
  },[noPagination,users])

  useEffect(() => {
    if(isAdmin){
        fetchAllUsers(token).then(res =>{
            dispatch(dispatchGetAllUsers(res))
        })
    }
  },[token, isAdmin, dispatch, callback])
  
  const pageActual = onPageInteraction? 0: page

  const handleDeleteUser = async (id) => {
    try {
        if(user._id !== id){
            if(window.confirm("Are you sure you want to delete this account?")){
                setLoading(true)
                await axios.delete(`/user/delete/${id}`, {
                    headers: {Authorization: token}
                })
                setLoading(false)
                setCallback(!callback)
            }
        }
        
    } catch (err) {
        setData({...data, err: err.response.data.msg , success: ''})
    }
  }

  const handleDeleteAssessment = async (questionId) => {
    try {
      if(window.confirm("Are you sure you want to delete this assessment?")){
          const res = await axios.delete(`/user/delete_assessment/${questionId}`, {
              headers: {Authorization: token}
          })

          setData({...data, err: '', success: res.data.msg})
          setLoading(false)
          setCallback(!callback)
          history.go(0)
      }
    
    }  catch (err) {
        setData({...data, err: err.response.data.msg , success: ''})
    }
  }

  return (
    <>
      <Paper className={classes.root} elevation={4}>
          <h3 style={{margin: "15px 20px 12px 25px"}}>{isAdmin ? "All Users" : "My Assessments"}</h3>
          <Table className={classes.table} aria-label="simple table">
            {
              isAdmin ? 
              <>
                <TableHead>
                  <TableRow className={classes.headRow}>
                    <StyledTableCell>User ID</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Email</StyledTableCell>
                    <StyledTableCell align="right">Admin</StyledTableCell>
                    <StyledTableCell align="right">Action</StyledTableCell>
                    <StyledTableCell align="right">Assessments</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && (rowsPerPage > 0
                    ? users.length ? users.slice(pageActual * rowsPerPage, pageActual * rowsPerPage + rowsPerPage) : []
                    : users
                  ).map((user) => (
                    <>
                      <StyledTableRow key={user._id}>
                        <StyledTableCell component="th" scope="user">{user._id}</StyledTableCell>
                        <StyledTableCell align="right">{user.name}</StyledTableCell>
                        <StyledTableCell align="right">{user.email}</StyledTableCell>
                        <StyledTableCell align="right">
                          {
                            user.role === 1 
                            ? <i className="fas fa-check" title="Admin" style={{cursor: "default"}}></i>
                            : <i className="fas fa-times" title="User" style={{cursor: "default"}}></i>
                          }
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Link to={`/edit_user/${user._id}`}>
                            <i className="fas fa-edit" title="Edit"></i>
                          </Link>&nbsp;&nbsp;
                          <i className="fas fa-trash-alt" style={{cursor: "pointer"}} title="Remove" onClick={() => handleDeleteUser(user._id)} ></i>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1} marginBottom={8} style={{background: "#424242"}}>
                              <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                  <TableRow className={classes.headRow}>
                                    <StyledTableCell>Assessment ID</StyledTableCell>
                                    <StyledTableCell align="right">Question</StyledTableCell>
                                    <StyledTableCell align="right">Option #1</StyledTableCell>
                                    <StyledTableCell align="right">Option #2</StyledTableCell>
                                    <StyledTableCell align="right">Option #3</StyledTableCell>
                                    <StyledTableCell align="right">Option #4</StyledTableCell>
                                    <StyledTableCell align="right">Action</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {user.assessment_questions.map((question) => (
                                    <StyledTableRow key={question._id}>
                                      <StyledTableCell component="th" scope="question" style={{color:"white"}}>
                                        {question._id}
                                      </StyledTableCell>
                                      <StyledTableCell align="right" style={{color:"white"}}>{question.questionTitle}</StyledTableCell>
                                      <StyledTableCell align="right" style={{color:"white"}}>{question.option1}</StyledTableCell>
                                      <StyledTableCell align="right" style={{color:"white"}}>{question.option2}</StyledTableCell>
                                      <StyledTableCell align="right" style={{color:"white"}}>{question.option3}</StyledTableCell>
                                      <StyledTableCell align="right" style={{color:"white"}}>{question.option4}</StyledTableCell>
                                      <StyledTableCell align="right">
                                        <Link to={`/edit_assessment/${question._id}`} style={{paddingRight: 10}}>
                                          <i className="fas fa-edit" title="Edit"></i>
                                        </Link>
                                        <i className="fas fa-trash-alt" style={{cursor: "pointer"}} title="Remove" onClick={() => handleDeleteAssessment(question._id)} ></i>
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </StyledTableRow>
                      
                    </>
                  ))}       

                  {!loading && !users.length && !emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={users.length}/>
                    </TableRow>
                  )}

                  {(loading || !users.length) && (  
                    <TableRow style={{ height: 53 * rowsPerPage }}>
                      <TableCell align="center" colSpan={6}>{"No data found"}</TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </> : 
              
              <>
                <TableHead>
                  <TableRow className={classes.headRow}>
                    <StyledTableCell>Assessment ID</StyledTableCell>
                    <StyledTableCell align="right">Question</StyledTableCell>
                    <StyledTableCell align="right">Option #1</StyledTableCell>
                    <StyledTableCell align="right">Option #2</StyledTableCell>
                    <StyledTableCell align="right">Option #3</StyledTableCell>
                    <StyledTableCell align="right">Option #4</StyledTableCell>
                    <StyledTableCell align="right">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user && user.assessment_questions && user.assessment_questions.map((question) => (
                    <StyledTableRow key={question._id}>
                      <StyledTableCell component="th" scope="question">
                        {question._id}
                      </StyledTableCell>
                      <StyledTableCell align="right">{question.questionTitle}</StyledTableCell>
                      <StyledTableCell align="right">{question.option1}</StyledTableCell>
                      <StyledTableCell align="right">{question.option2}</StyledTableCell>
                      <StyledTableCell align="right">{question.option3}</StyledTableCell>
                      <StyledTableCell align="right">{question.option4}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Link to={`/edit_assessment/${question._id}`} style={{paddingRight: 10}}>
                          <i className="fas fa-edit" title="Edit"></i>
                        </Link>
                        <i className="fas fa-trash-alt" style={{cursor: "pointer"}} title="Remove" onClick={() => handleDeleteAssessment(question._id)} ></i>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </>
            }

            {!noPagination && <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                  colSpan={user.length}
                  count={onPageInteraction?-1:users.length}
                  className={classes.noBorder}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' }
                  }}
                  {...(onPageInteraction?{labelDisplayedRows: ({ from, to }) => from+"-"+to}:{ActionsComponent: TablePaginationActions})}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              </TableRow>
            </TableFooter>}

          </Table>
      </Paper>
    </>
  )
}

export default Dashboard
