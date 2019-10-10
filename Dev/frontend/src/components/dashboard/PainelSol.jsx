import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios'
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar,
    Typography, Paper, Checkbox, IconButton, Tooltip, Grid, CardContent, Modal, FormControl, InputLabel,
    Button, Select, MenuItem, TextField
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { UserContext } from '../../context/UserContext'

function createData(aluno, atividade, grupo, data, status) {
    return { aluno, atividade, grupo, data, status };
}

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        minWidth: '55%',
        maxHeight: '90%',
    };
}

// const rows = [
//     createData('Matheus Colina', 'Cursos na área de interesse em função do perfil do egresso', 'Grupo I', '27/08/2019', 'pendente'),
//     createData('Mathias Baldigraxa', 'Participação em projeto de ensino em outras IES', 'Grupo IV', '25/09/2019', 'pendente'),
//     createData('Débora Molheira', 'Organização de eventos de ensino', 'Grupo II', '27/08/2019', 'pendente'),
//     createData('Sandro Boizera', 'Cursos de língua estrangeira inglês', 'Grupo III', '02/08/2019', 'aprovado'),
//     createData('Sabrina Paulé', 'Apresentação de trabalho em eventos de ensino', 'Grupo I', '20/06/2019', 'aprovado'),
//     createData('Juca', 'bla bla bla', 'Grupo III', '27/03/2008', 'aprovado'),
//     createData('Judith', 'bla bla bla', 'Grupo II', '09/08/2019', 'pendente'),
//     createData('Micael', 'bla bla bla', 'Grupo I', '18/08/2019', 'pendente'),
//     createData('Sam', 'bla bla bla', 'Grupo III', '23/08/2019', 'aprovado'),
//     createData('João Pablo', 'bla bla bla', 'Grupo IV', '20/08/2019', 'pendente'),
//     createData('Bernadino', 'bla bla bla', 'Grupo IV', '12/08/2019', 'aprovado'),
//     createData('Eu', 'bla bla bla', 'Grupo III', '01/08/2019', 'pendente'),
// ];

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
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const { user } = useContext(UserContext)
    const [modalStyle] = useState(getModalStyle)
    const [openModal, setOpenModal] = useState(false)
    const [openSelectGroup, setOpenSelectGroup] = useState(false)
    const [openSelectActivitie, setOpenSelectActivitie] = useState(false)
    const [values, setValues] = React.useState({
        name: '',
        registration: '',
        group: '',
        activitie: '',
        teacher: '',
        location: '',
        dateStart: '',
        dateEnd: '',
        workload: '',
        requestedWorkload: '',
        description: '',
    });
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleChange = () => event => {
        setValues({ ...values, [event.target.id]: event.target.value });
        console.log(values.group)
    }

    const handleChangeSelect = event => {
        setValues(oldValues => ({
          ...oldValues,
          [event.target.id]: event.target.value,
        }));
      };

    // function handleChangeSelect(event, value) {
    //     //setRoomId(value.props.value)
    //     //setRoomName(value.props.name)
    // }
    function handleModal() {
        setOpenModal(true)
    }
    function handleCloseModal() {
        setOpenModal(false)
    }
    function handleOpenSelectGroup() {
        setOpenSelectGroup(true);
    }
    function handleOpenSelectActivitie() {
        setOpenSelectActivitie(true);
    }
    function handleCloseSelectGroup() {
        setOpenSelectGroup(false);
    }
    function handleCloseSelectActivitie() {
        setOpenSelectActivitie(false);
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
                            <IconButton aria-label="delete">
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
                                            value={values.name} onChange={handleChange('name')} margin="normal" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField required id="registration" type="number" label="Matrícula" style={{ width: '100%' }} className={classes.textField}
                                                value={values.registration} onChange={handleChange('registration')} margin="normal" />
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                        <div style={{ width: '35%' }}>
                                            <InputLabel style={{ position: 'relative' }} htmlFor="group">Grupo da ACG</InputLabel>
                                            <Select id="group" key={1} open={openSelectGroup} className={classes.textField} style={{ width: '100%' }}
                                                value={values.group} onClose={handleCloseSelectGroup} onOpen={handleOpenSelectGroup} onChange={handleChange('group')} >
                                                <MenuItem value="GRUPO I">GRUPO I</MenuItem>
                                                <MenuItem value="GRUPO II">GRUPO II</MenuItem>
                                                <MenuItem value="GRUPO III">GRUPO III</MenuItem>
                                                <MenuItem value="GRUPO IV">GRUPO IV</MenuItem>
                                            </Select>
                                        </div>
                                        <div style={{ width: '60%' }}>
                                            <InputLabel style={{ position: 'relative' }} htmlFor="activitie">Atividade</InputLabel>
                                            <Select id="activitie" name="activitie" key={2} open={openSelectActivitie} className={classes.textField} style={{ width: '100%' }}
                                                value={values.activitie} onClose={handleCloseSelectActivitie} onOpen={handleOpenSelectActivitie} onChange={handleChangeSelect} >
                                                <MenuItem value="ATIVIDADE I">ATIVIDADE I</MenuItem>
                                                <MenuItem value="ATIVIDADE II">ATIVIDADE II</MenuItem>
                                                <MenuItem value="ATIVIDADE III">ATIVIDADE III</MenuItem>
                                                <MenuItem value="ATIVIDADE IV">ATIVIDADE IV</MenuItem>
                                                <MenuItem value="ATIVIDADE V">ATIVIDADE V</MenuItem>
                                                <MenuItem value="ATIVIDADE VI">ATIVIDADE VI</MenuItem>
                                                <MenuItem value="ATIVIDADE VII">ATIVIDADE VII</MenuItem>
                                            </Select>
                                        </div>
                                    </Grid>
                                    <Grid container direction="row" justify="space-around" alignItems="center">
                                        <Grid item xs={6}>
                                            <TextField required label="Professor Responsável" style={{ width: '95%' }} className={classes.textField}
                                                value={values.teacher} onChange={handleChange('teacher')} margin="normal" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField required label="Local da atividade" style={{ width: '100%' }} className={classes.textField}
                                                value={values.location} onChange={handleChange('location')} margin="normal" />
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                        <Grid item xs={5}>
                                            <div style={{ width: '100%' }}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" id="date-picker-inline"
                                                        label="Período da Atividade" value={selectedDate} onChange={handleDateChange}
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
                                                    <KeyboardDatePicker disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" id="date-picker-inline"
                                                        label=" " value={selectedDate} onChange={handleDateChange}
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
                                            <TextField required type="number" label="Carga horária da Atividade (em horas)" style={{ width: '95%' }}
                                                className={classes.textField} value={values.workload} onChange={handleChange('workload')} margin="normal" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField required type="number" label="Carga horária Solicitada (em horas)" style={{ width: '95%' }}
                                                className={classes.textField} value={values.requestedWorkload} onChange={handleChange('requestedWorkload')} margin="normal" />
                                        </Grid>
                                    </Grid>
                                    <Grid container justify="space-between" alignItems="center">
                                        <TextField required label="Descrição da Atividade" multiline rows="4" variant="filled" className={classes.textField}
                                            style={{ width: '100%' }} className={classes.textField} value={values.description} onChange={handleChange('description')}
                                            margin="normal" />
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </form>
                        <Button className={classes.button} >
                            Enviar
                        </Button>
                    </div>
                </CardContent>
            </Modal>
        </>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
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
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle" size={'medium'} >
                            <EnhancedTableHead classes={classes} numSelected={selected.length} order={order} orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} />
                            <TableBody>
                                {stableSort(rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow hover onClick={event => handleClick(event, row.aluno)} role="checkbox" aria-checked={isItemSelected}
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