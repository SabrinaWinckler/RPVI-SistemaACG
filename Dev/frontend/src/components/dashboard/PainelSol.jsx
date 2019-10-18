import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios'
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar,
    Typography, Paper, Checkbox, IconButton, Tooltip, Grid, CardContent, Modal, FormControl, InputLabel,
    Button, Select, MenuItem, TextField, Chip, Avatar, Dialog, DialogActions, DialogTitle 
} from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { UserContext } from '../../context/UserContext'
import { validateName, validateRegistration, validateDate, sendForm, deleteSolicitacao } from '../../scripts/scripts'

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        minWidth: '55%',
        maxHeight: '90%',
        overflow:'scroll',
    };
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    { id: 'aluno', numeric: false, align: 'left', disablePadding: true, label: 'Aluno' },
    { id: 'atividade', numeric: false, align: 'left', disablePadding: false, label: 'Atividade' },
    { id: 'grupo', numeric: false, align: 'left', disablePadding: false, label: 'Grupo' },
    { id: 'data', numeric: true, align: 'left', disablePadding: false, label: 'Data' },
    { id: 'status', numeric: false, align: 'left', disablePadding: false, label: 'Situação' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected === rowCount} onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }} />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell key={headCell.id} align={'left'} sortDirection={orderBy === headCell.id ? order : false} >
                        <TableSortLabel active={orderBy === headCell.id} direction={order} onClick={createSortHandler(headCell.id)} >
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

const useToolbarStyles = makeStyles(theme => ({
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
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '5px',
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
        color: 'white',
        backgroundColor: '#009045',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '-webkit-fill-available',
    },
    modalRoot: {
        backgroundColor: theme.palette.background.paper,
        minWidth: 500,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    input: {
        display: 'none',
    },
    avatar: {
        margin: theme.spacing(1),
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected, selectedRow } = props;
    const { user } = useContext(UserContext)
    const [modalStyle] = useState(getModalStyle)
    const [openModal, setOpenModal] = useState(false)
    const [file, setFile] = useState(null)
    const [values, setValues] = useState({
        location: 'unipampa',
        name: 'Juca',
        dateStart: '2019-01-02',
        dateEnd: '2019-01-03',
        requestedWorkload: '1',
        teacher: 'Berna',
        description: 'Foi top',
        activitie: '1',
        registration: '1234567890',
        group: '1',
        workload: '2',
    });
    const [selectedDateStart, setSelectedDateStart] = useState(new Date());
    const [selectedDateEnd, setSelectedDateEnd] = useState();
    const [status, setStatus] = useState({ show: false, message: '' })

    const [groups, setGroups] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [activities, setActivities] = useState([])
    const [selectValues, setselectValues] = useState({
        group: '',
        activitie: '',
      });

    useEffect(() => {
        async function loadSolicitations() {
          const response = await axios.get('http://localhost:8081/solicitacao/infos/')
          setGroups(response.data.grupos)
          setActivities(response.data.atividades)
        }
        loadSolicitations()
      }, [])

    const handleChangeSelect = event => {
        setselectValues(oldValues => ({
          ...oldValues,
          [event.target.name]: event.target.value,
        }));
        setValues({ ...values, [event.target.name]: event.target.value });
      };

    const handleFile = event =>  {
        setFile(event.target.files[0])
    }

    const handleDateChangeStart = date => {
        if(!validateDate(date)){
            setStatus({ show: true, message: 'Data Selecionada Inválida!' })
            return
        }
        setSelectedDateStart(date);
        setValues({ ...values, dateStart: new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split("T")[0] });
    };

    const handleDateChangeEnd = date => {
        if(!validateDate(date)){
            setStatus({ show: true, message: 'Data Selecionada Inválida!' })
            return
        }
        setSelectedDateEnd(date);
        setValues({ ...values, dateEnd: new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split("T")[0] });
    };

    const handleChange = () => event => {
        setValues({ ...values, [event.target.id]: event.target.value });
    }

    function handleModal() {
        setOpenModal(true)
    }

    function handleCloseModal() {
        setOpenModal(false)
    }

    async function handleDelete() {
            try {
                const response = await axios.delete(`http://localhost:8081/solicitacao/${selectedRow[0]}`)
                .then(resp => {
                    console.log(response)
                })
                .catch(error => {
                    console.error(error.response.data.message)
                })
                
            } catch (error) {
                
            }
        console.log(selectedRow[0])
    }

    const handleCloseMessageError = () => {
        setStatus({ show: false })
    }

    const handleOpen = () => {
        setOpenDialog(true);
    };
    
      const handleClose = () => {
        setOpenDialog(false);
        window.location.reload()
    };

    async function handleSubmit(event) {
        //console.log(file)
        if(!validateName(values.name)){
            setStatus({ show: true, message: 'Nome Inválido!' })
            return
        }
        if(!validateName(values.teacher)){
            setStatus({ show: true, message: 'Nome do Professor Inválido!' })
            return
        }
        if(!validateRegistration(values.registration)){
            setStatus({ show: true, message: 'Número de Matrícula Inválido!' })
            return
        }
        if(file === null){
            setStatus({ show: true, message: 'Você precisa anexar pelo menos um arquivo!' })
        }
        var data = {
            local: values.location,
            aluno: values.name,
            dataInicio: values.dateStart,
            dataFim: values.dateEnd,
            cargaHorariaSoli: values.requestedWorkload,
            profRes: values.teacher,
            descricao: values.description,
            idAtividade: values.activitie.toString()
        }
        console.log(JSON.stringify(data), file)
        const response = await sendForm(data, file)
        
        
        //setSubmitMessage('Solicitação Realizada com Sucesso!')
        //handleOpen()
        
    }

    return (
        <>
            <Toolbar className={clsx(classes.root, { [classes.highlight]: numSelected > 0, })} >
                <div className={classes.title}>
                    {numSelected > 0 ? (
                        <Typography color="inherit" variant="subtitle1">
                            {numSelected} selected
                        </Typography>
                    ) : (
                            <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                                <Typography variant="h6" id="tableTitle">
                                    Solicitações
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Olá {user}
                                </Typography>
                            </Grid>
                        )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                            <Tooltip title="Filter list">
                                <IconButton aria-label="filter list" onClick={handleModal}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                </div>
            </Toolbar>
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={openModal} onClose={handleCloseModal} >
                <CardContent style={modalStyle} className={classes.paper}>
                    <div className={classes.modalRoot}>
                    {status.show && (
                        <Grid container direction="column" justify="center" alignItems="center" >
                                <Chip avatar={
                                    <Avatar>
                                        <WarningIcon />
                                    </Avatar>
                                }
                                label={status.message}
                                onDelete={handleCloseMessageError}
                                className={classes.chip}
                                style={{ color: "#222222" }}
                                />
                            </Grid>
                        )}
                        <form autoComplete="off">
                            <FormControl className={classes.formControl}>
                                <Grid container direction="column" justify="space-evenly" alignItems="stretch" spacing={2}>
                                    <Grid item xs>
                                        <Typography variant="h5" gutterBottom>
                                            Solicitação de ACG
                                        </Typography>
                                    </Grid>
                                    <Grid container direction="row" justify="space-around" alignItems="center">
                                        <Grid item xs={8}>
                                            <TextField id="name" required type="text" pattern="[A-Za-z]" label="Nome" style={{ width: '95%' }} className={classes.textField}
                                            value={values.name} onChange={handleChange('name')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField id="registration" required type="number" label="Matrícula" style={{ width: '100%' }} className={classes.textField}
                                                value={values.registration} onChange={handleChange('registration')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                            <FormControl style={{ width: '35%' }}>
                                                <InputLabel style={{ position: 'relative' }} htmlFor="groupSelect">Grupo da ACG</InputLabel>
                                                <Select value={selectValues.group} className={classes.textField} style={{ width: '100%' }}
                                                onChange={handleChangeSelect}
                                                inputProps={{
                                                    name: 'group',
                                                    id: 'groupSelect',
                                                }} >
                                                    {groups.map((group, index) => (
                                                        <MenuItem key={index} value={group.idGrupo} name={group.nome} >{group.nome}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl style={{ width: '60%' }}>
                                                <InputLabel style={{ position: 'relative' }} htmlFor="activitieSelect">Atividade</InputLabel>
                                                <Select value={selectValues.activitie} className={classes.textField} style={{ width: '100%' }}
                                                onChange={handleChangeSelect}
                                                inputProps={{
                                                    name: 'activitie',
                                                    id: 'activitieSelect',
                                                }} >
                                                    {activities.map((activitie, index) => (
                                                        <MenuItem key={index} value={activitie.idAtividade} name={activitie.descricao} >{activitie.descricao}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                    </Grid>
                                    <Grid container direction="row" justify="space-around" alignItems="center">
                                        <Grid item xs={6}>
                                            <TextField id="teacher" required label="Professor Responsável" style={{ width: '95%' }} className={classes.textField}
                                                value={values.teacher} type="text" onChange={handleChange('teacher')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id="location" required label="Local da atividade" style={{ width: '100%' }} className={classes.textField}
                                                value={values.location} type="text" onChange={handleChange('location')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                        <Grid item xs={5}>
                                            <div style={{ width: '100%' }}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker id="dateStart" disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" 
                                                        label="Período da Atividade" value={selectedDateStart} onChange={handleDateChangeStart}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>
                                        </Grid>
                                        <Grid item xs={2} style={{ alignSelf: 'flex-end' }}>
                                            <div style={{ width: '100%' }}>
                                                <Typography variant="h6" gutterBottom>
                                                    a
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <div style={{ width: '100%' }}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker id="dateEnd" disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal"
                                                        label=" " value={selectedDateEnd} onChange={handleDateChangeEnd}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-around" alignItems="center">
                                        <Grid item xs={6}>
                                            <TextField id="workload" required type="number" label="Carga horária da Atividade (em horas)" style={{ width: '95%' }}
                                                className={classes.textField} value={values.workload} onChange={handleChange('workload')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id="requestedWorkload" required type="number" label="Carga horária Solicitada (em horas)" style={{ width: '95%' }}
                                                className={classes.textField} value={values.requestedWorkload} onChange={handleChange('requestedWorkload')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container justify="space-between" alignItems="center">
                                        <TextField id="description" type="text" required label="Descrição da Atividade" multiline rows="4" variant="filled" className={classes.textField}
                                            style={{ width: '100%' }} value={values.description} onChange={handleChange('description')} margin="normal" autoComplete="off"/>
                                    </Grid>
                                </Grid>
                            </FormControl>
                            <Grid container direction="row" justify="space-between" alignItems="center">
                                <input required accept="image/*, .pdf, .docx" className={classes.input} onChange={handleFile} id="uploadFile" multiple type="file" />
                                <label htmlFor="uploadFile">
                                    <Button variant="outlined" component="span" className={classes.button}>
                                        Comprovante
                                    </Button>
                                </label>
                                <Button className={classes.button} onClick={handleSubmit} >
                                    Enviar
                                </Button>
                            </Grid>
                        </form>
                        <Dialog open={openDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                        <Grid container direction="column" justify="space-around" alignItems="center">
                            <DialogTitle id="alert-dialog-title">{submitMessage}</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary" autoFocus>
                                    OK!
                                </Button>
                            </DialogActions>
                        </Grid>
                        </Dialog>
                    </div>
                </CardContent>
            </Modal>
        </>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selectedRow: PropTypes
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '95%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
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

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = React.useState();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [rows, setRows] = useState([])

    useEffect(() => {
        async function loadSolicitations() {
          const response = await axios.get('http://localhost:8081/solicitacao')
          setRows(response.data)
        }
        loadSolicitations()
      }, [])


    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.name);
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

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Grid container direction="row" justify="center" alignItems="center">
                {console.log(rows)}
                <Paper className={classes.paper} style={{ marginBottom: '4%' }}>
                    <EnhancedTableToolbar numSelected={selected.length} selectedRow={selected} />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle" size={'medium'} >
                            <EnhancedTableHead classes={classes} numSelected={selected.length} selectedRow={selected} order={order} orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} />
                            <TableBody>
                                {stableSort(rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow hover onClick={event => handleClick(event, row.idSolicitacao)} role="checkbox" aria-checked={isItemSelected}
                                                tabIndex={-1} key={row.aluno} selected={isItemSelected} >
                                                <TableCell padding="checkbox">
                                                    <Checkbox inputProps={{ 'aria-labelledby': labelId }} />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.aluno}
                                                </TableCell>
                                                <TableCell align="left">{row.atividade.descricao}</TableCell>
                                                <TableCell align="left">{row.atividade.grupo.nome}</TableCell>
                                                <TableCell align="left">{row.dataAtual}</TableCell>
                                                <TableCell align="left">{row.status}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination rowsPerPageOptions={[10, 25]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page}
                        backIconButtonProps={{
                            'aria-label': 'previous page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'next page',
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
        </div>
    );
}