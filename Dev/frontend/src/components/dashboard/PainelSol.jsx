import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar,
    Typography, Paper, IconButton, Tooltip, Grid, CardContent, Modal, FormControl, InputLabel,
    Button, Select, MenuItem, TextField, Chip, Avatar, Dialog, DialogActions, DialogTitle, Radio,
    RadioGroup, FormControlLabel, FormLabel, Fab, Divider  
} from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description'
import VisibilityIcon from '@material-ui/icons/Visibility';
import GetAppIcon from '@material-ui/icons/GetApp'

import { UserContext } from '../../context/UserContext'
import { validateName, validateRegistration, validateDate, sendForm, sendAvaliation, deleteSolicitacao, getDocs, getActivities } from '../../scripts/scripts'
import './styles.css'

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
    { id: 'actions', numeric: false, align: 'left', disablePadding: false, label: 'Ações' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
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
    typography: {
        padding: theme.spacing(2),
      },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    let fileList = []
    let fileNameList = []
    const { user } = useContext(UserContext)
    const [modalStyle] = useState(getModalStyle)
    const [openModal, setOpenModal] = useState(false)
    const [docs, setDocs] = useState([])
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
    const [message, setMessage] = useState("Selecione Uma Atividade");
    const [status, setStatus] = useState({ show: false, message: '' })

    const [actSelect, setActSelect] = useState(true)
    const [groups, setGroups] = useState([])
    const [activities, setActivities] = useState([])
    const [activitiesByGroup, setActivitiesByGroup] = useState([])
    const [groupKey, setGroupKey] = useState()
    const [selectValues, setSelectValues] = useState({
        group: '',
        activitie: '',
      });

    const [openDialog, setOpenDialog] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [runButtons, setRunButtons] = useState(false)

    useEffect(() => {
        async function loadSolicitations() {
          const response = await axios.get('http://localhost:2222/solicitacao/infos/')
          setGroups(response.data.grupos)
          setActivitiesByGroup(response.data.atividades)
          setActivities(response.data.atividades)
        }
        loadSolicitations()
      }, [])

      useEffect(() => {
        setActivities(getActivities(activitiesByGroup, groupKey))
        if(selectValues.group !== ''){
            setActSelect(false)
        } 

      }, [selectValues.group, activitiesByGroup, groupKey])

    const handleChangeGroup = event => {
        setGroupKey(event.target.value)
        setSelectValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
        setValues({ ...values, [event.target.name]: event.target.value });
      };

    const handleChangeSelect = event => {
        setSelectValues(oldValues => ({
          ...oldValues,
          [event.target.name]: event.target.value,
        }));
        setValues({ ...values, [event.target.name]: event.target.value });
        let docsLine = getDocs(activities, event.target.value)
        if(!docsLine){
            setMessage("Não foi possível verificar a documentação necessária")
            return
        }else{
            setDocs(docsLine)
            console.log(fileNameList)
            setRunButtons(true)
        }
      };

    function handleFile (event, fileName){
        if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
            return
        }

        const name = event.target.files[0].name
        const lastDot = name.lastIndexOf('.')
        const ext = name.substring(lastDot + 1).toLowerCase()

        if ( ext !== 'pdf' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'zip') {
            const newFiles = Object.keys(fileList).reduce((object, key) => {
                if (key !== fileName) {
                    console.log('not deleting', key, fileName)
                    object[key] = fileList[key]
                }
                return object
            }, {})
            console.log(newFiles)

            alert('Tipo de arquivo não permitido')
            return
        }
        if(fileList.length === 0){
            const fileData = ({
                idDoc: event.target.id,
                file: event.target.files[0]
            })
            fileList.push(fileData)
        } else {
            let index
            for (index = 0; index < fileList.length; index++) {
                if(fileList[index].idDoc === event.target.id){
                    fileList[index].file = event.target.files[0]
                    return
                }
            }
            const fileData = ({
                idDoc: event.target.id,
                file: event.target.files[0]
            })
            fileList.push(fileData)
        }
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
        console.log(fileList)
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
        if(fileList === null || fileList.length === 0 || fileList.length < docs.length){
            setStatus({ show: true, message: 'Você precisa anexar o(s) arquivo(s) necessário(s)!' })
            return
        }
        var data = {
            local: values.location,
            aluno: values.name,
            matricula: values.registration,
            dataInicio: values.dateStart,
            dataFim: values.dateEnd,
            cargaHorariaSoli: values.requestedWorkload,
            profRes: values.teacher,
            descricao: values.description,
            idAtividade: values.activitie.toString()
        }
        const response = sendForm(data, fileList)
        console.log(response)
        if(response){
            setSubmitMessage('Solicitação Realizada com Sucesso!')
        } else {
            setSubmitMessage('Houve um problema em enviar a Solicitação!')
        }
        handleOpen()
    }

    return (
        <>
            <Toolbar className={classes.root} >
                <div className={classes.title}>
                        <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                        <Typography variant="h6" id="tableTitle">
                             Solicitações
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            Olá {user}
                        </Typography>
                    </Grid>
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list" onClick={handleModal}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
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
                                            <TextField id="registration" required type="number" label="Matrícula" style={{ width: '100%' }} maxLength="10" className={classes.textField}
                                                value={values.registration} onChange={handleChange('registration')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                            <FormControl style={{ width: '35%' }}>
                                                <InputLabel style={{ position: 'relative' }} htmlFor="groupSelect">Grupo da ACG</InputLabel>
                                                <Select value={selectValues.group} className={classes.textField} style={{ width: '100%' }}
                                                onChange={handleChangeGroup}
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
                                                <Select disabled={actSelect} value={selectValues.activitie} className={classes.textField} style={{ width: '100%' }}
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
                                            <TextField id="workload" required type="number" label="Carga horária da Atividade (em horas)" style={{ width: '95%' }} maxLength="5"
                                                className={classes.textField} value={values.workload} onChange={handleChange('workload')} margin="normal" autoComplete="off"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id="requestedWorkload" required type="number" label="Carga horária Solicitada (em horas)" style={{ width: '95%' }} maxLength="5"
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
                                <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: '45%' }}>
                                {!runButtons ? (
                                    <Typography color="inherit" variant="subtitle1">
                                        {message}
                                    </Typography>
                                ) : (
                                    <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: '100%' }}>
                                        
                                        {docs.map((doc, index) => (
                                            <div style={{ marginTop: '4%' }} className="input-group">
                                                <Typography variant="body2" style={{padding:0}} className={classes.typography}>
                                                    {doc.nome}
                                                </Typography>
                                                <div>
                                                    <label className="custom-label" htmlFor={doc.idDocNecessario} />
                                                    <input 
                                                        required
                                                        type="file"
                                                        onChange={(e) => {handleFile(e, doc.nome)}} 
                                                        value={fileList[index]}
                                                        accept="image/*, .pdf"
                                                        className="custom-file-input"
                                                        id={doc.idDocNecessario}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Grid>
                                )}
                                </Grid>
                                <Button className={classes.button} onClick={handleSubmit} >
                                    Enviar
                                </Button>
                                {/* <Button className={classes.button} onClick={handleTeste} >
                                    testar
                                </Button> */}
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
    paperModal: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '5px',
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
    button: {
        marginTop: theme.spacing(2),
        color: 'white',
        backgroundColor: '#009045',
    },
    margin: {
        margin: theme.spacing(1),
        color: 'white',
        backgroundColor: '#009045',
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(0.1),
        marginRight: theme.spacing(0.1),
    },
}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = React.useState();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false)
    const [openDetails, setOpenDetails] = useState(false)
    const [valueRadio, setValueRadio] = useState('')
    const [valueRadioInfo, setValueRadioInfo] = useState('')
    const [avaliation, setAvaliation] = useState({
        activitieId: "",
        hourLoad: "",
        obs: "",
        status: ""
    })
    const [obsShow, setObsShow] = useState(false);
    const [actSelect, setActSelect] = useState(false);
    const [hourLoadShow, setHourLoadShow] = useState(false);
    const [changeInfo, setChangeInfo] = useState(false);
    const [idSol, setIdsol] = useState()
    const [anexos, setAnexos] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [status, setStatus] = useState({ show: false, message: '' })
    const [submitMessage, setSubmitMessage] = useState('')
    const [deferred, setDeferred] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [respInfoChange, setRespInfoChange] = useState('')
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const [idDelete, setIdDelete] = useState()

    const [groups, setGroups] = useState([])
    const [activities, setActivities] = useState([])
    const [activitiesByGroup, setActivitiesByGroup] = useState([])
    const [groupKey, setGroupKey] = useState()
    const [selectValues, setSelectValues] = useState({
        group: '',
        activitie: '',
      });

    const [rows, setRows] = useState([])

    useEffect(() => {
        async function loadSolicitations() {
          const response = await axios.get('http://localhost:2222/solicitacao/infos/')
          setGroups(response.data.grupos)
          setActivitiesByGroup(response.data.atividades)
          setActivities(response.data.atividades)
        }
        loadSolicitations()
      }, [])

      useEffect(() => {
        setActivities(getActivities(activitiesByGroup, groupKey))
        if(selectValues.group !== ''){
            setActSelect(false)
        } 

      }, [activitiesByGroup, groupKey, selectValues])

    const handleAvaliation = () => event => {
        setAvaliation({ ...avaliation, [event.target.id]: event.target.value });
    }

    const handleCloseMessageError = () => {
        setStatus({ show: false })
    }

    const handleChangeGroup = event => {
        setGroupKey(event.target.value)
        setSelectValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
          }));
      };

    const handleChangeSelect = event => {
        setSelectValues(oldValues => ({
          ...oldValues,
          [event.target.name]: event.target.value,
        }));
        setAvaliation({ ...avaliation, activitieId: event.target.value })
      };

    const handleChangeDeferred = event => {
        setDeferred(true)
        setHourLoadShow(true);
        setObsShow(true);
        setShowButton(true)
        if(respInfoChange === 'yes') {
            setChangeInfo(true)
        }
        setAvaliation({ ...avaliation, status: "true" })
      };

    function  handleInfoChange(resp) {
        if(resp === 'yes') {
            setRespInfoChange('yes')
            setChangeInfo(true)
        }
        if(resp === 'no') {
            setRespInfoChange('no')
            setChangeInfo(false)
        }
    }

    const handleChangeRejected = event => {
        setDeferred(false)
        setObsShow(true);
        setHourLoadShow(false);
        setChangeInfo(false)
        setShowButton(true)
        setAvaliation({ ...avaliation, status: "false" })
      };

    const handleChangeRadio = event => {
        setValueRadio(event.target.value);
      };
    
    const handleChangeRadioInfo = event => {
        setValueRadioInfo(event.target.value);
      };

    const handleModal = (index, id) => {
        setIdsol(id)
        setOpen({ open: open, [index]: !open });
    };
    
    const handleModalDetails = (index, id) => {
        setIdsol(id)
        setOpenDetails({ openDetails: openDetails, [index]: !openDetails });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    useEffect(() => {
        async function loadSolicitations() {
          const response = await axios.get('http://localhost:2222/solicitacao')
          setRows(response.data)
        }
        loadSolicitations()
    }, [])
    
    useEffect(() => {
        if(idSol){
            async function loadAnexos() {
                const response = await axios.get(`http://localhost:2222/avaliacao/infos/${idSol}`)
                setAnexos(response.data.anexos)
                setAvaliation({ ...avaliation,
                    activitieId: response.data.atividade.idAtividade })
                }
                loadAnexos()
            }
        }, [idSol])
    
    async function handleDelete (id) {
            setOpenDialogDelete(false)
            const response = deleteSolicitacao(id)
            console.log('veio aqui')
            if(response){
                setSubmitMessage('Solicitação Deletada com Sucesso!')
           } else {
               setSubmitMessage('Houve um problema ao deletar a Solicitação!')
           }
           handleOpenDialog()
    }

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

        setSelected(newSelected)
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0)
    };

    const handleOpenDialog = () => {
        setOpenDialog(true)
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false)
        window.location.reload()
    };

    const handleOpenDialogDelete = (id) => {
        setSubmitMessage('Tem certeza que deseja deletar essa Solicitação?')
        setOpenDialogDelete(true)
        setIdDelete(id)
    };
    
    const handleCloseDialogDelete = () => {
        setOpenDialogDelete(false)
        window.location.reload()
    };

    async function handleSubmit(event) {
        var isEmpty = avaliation.obs.trim()
        if(!isEmpty){
            setStatus({ show: true, message: 'A observação (parecer) é necessária!' })
            return
        }
        if(deferred) {
            if(avaliation.hourLoad === undefined || avaliation.hourLoad === null || avaliation.hourLoad === '')
            setStatus({ show: true, message: 'É necessário atribuir uma quantidade de horas!' })
            return
        }

        var data = {
            cargaHorariaAtribuida: avaliation.hourLoad,
            idSolicitacao: idSol.toString(),
            idAtividade: avaliation.activitieId.toString(),
            parecer: avaliation.obs,
            deferido: avaliation.status
        }
        console.log(JSON.stringify(data))
        const response = sendAvaliation(data, idSol)
        console.log(response)
        if(response){
             setSubmitMessage('Solicitação Realizada com Sucesso!')
        } else {
            setSubmitMessage('Houve um problema em enviar a Solicitação!')
        }
        handleOpenDialog()
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Grid container direction="row" justify="center" alignItems="center">
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
                                        return (
                                            <TableRow onClick={event => handleClick(event, row.idSolicitacao)} role="checkbox"
                                                tabIndex={-1} key={row.idSolicitacao} >
                                                <TableCell align="center" component="th" id={row.idSolicitacao} scope="row" padding="none">
                                                    {row.nomeAluno}
                                                </TableCell>
                                                <TableCell align="left">{row.atividade.descricao}</TableCell>
                                                <TableCell align="left">{row.atividade.grupo.nome}</TableCell>
                                                <TableCell align="left">{row.dataAtual}</TableCell>
                                                <TableCell align="left">{row.status}</TableCell>
                                                <TableCell align="left">
                                                    {row.status === 'Pendente' ? (
                                                        <IconButton onClick={() => handleModal(index, row.idSolicitacao)}>
                                                            <DescriptionIcon />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton >
                                                            <DescriptionIcon style={{opacity: 0.5}}/>
                                                        </IconButton>
                                                    )}
                                                        <IconButton >
                                                            <VisibilityIcon onClick={() => handleModalDetails(index, row.idSolicitacao)}/>
                                                        </IconButton>
                                                        <IconButton onClick={() => handleOpenDialogDelete(row.idSolicitacao)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                </TableCell>
                                                <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description"
                                                    open={open[index]} onClose={handleClose} >
                                                    <CardContent style={modalStyle} className={classes.paperModal}>
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
                                                        <Grid container direction="column" justify="space-evenly" alignItems="stretch" spacing={2}>
                                                            <Grid item xs>
                                                                <Typography variant="h5" gutterBottom>
                                                                    Avaliação de Solicitação
                                                                </Typography>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-around" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                        <Typography paragraph >
                                                                            <strong>Aluno: </strong>{row.nomeAluno}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                        <Typography paragraph>
                                                                            <strong>Matrícula: </strong>{row.matricula}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph >
                                                                        <strong>Atividade: </strong>{row.atividade.descricao}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph >
                                                                        <strong>Grupo: </strong>{row.atividade.grupo.nome}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-around" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Professor Responsável: </strong>{row.profRes}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Local: </strong>{row.local}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Início: </strong>{row.dataInicio}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Fim: </strong>{row.dataFim}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Carga Horária Solicitada: </strong>{row.cargaHorariaSoli} hora(s)
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container justify="space-between" alignItems="center">
                                                                <Typography paragraph>
                                                                    <strong>Descrição: </strong>{row.descricao}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph style={{ marginBottom: 0 }}>
                                                                        <strong>Comprovantes: </strong>
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                {anexos.map((anexo, index) => (
                                                                    <Grid item key={anexo.idAnexo} xs={4} style={{ maxWidth: '30%' }}>
                                                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%', margin: '1%' }}>
                                                                            <label htmlFor={anexo.idAnexo}>{anexo.doc.nome}</label>
                                                                            <Fab 
                                                                                id={anexo.idDocNecessario}
                                                                                onClick={(e) => {
                                                                                    window.open(
                                                                                        `http://localhost:2222/avaliacao/file/${anexo.nome}`,
                                                                                        '_blank',
                                                                                        'noopener'
                                                                                    )
                                                                                }}
                                                                                variant="extended"
                                                                                color="primary"
                                                                                aria-label="attach"
                                                                                className={classes.margin}>
                                                                                <GetAppIcon className={classes.extendedIcon} />
                                                                                Arquivo {index + 1}
                                                                            </Fab>
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                            <Divider style={{ marginBottom: "1%" }}/>
                                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                                <FormControl component="fieldset">
                                                                    <FormLabel component="legend">Avaliação</FormLabel>
                                                                    <RadioGroup aria-label="position" name="position" value={valueRadio} onChange={handleChangeRadio} row required>
                                                                        <FormControlLabel value="def"
                                                                        control={<Radio color="primary" />}
                                                                        label="Deferir" labelPlacement="end" onChange={handleChangeDeferred}/>
                                                                        <FormControlLabel value="indef"
                                                                        control={<Radio color="secondary" />}
                                                                        label="Indeferir" labelPlacement="end" onChange={handleChangeRejected}/>
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            <TextField
                                                                id="hourLoad"
                                                                required
                                                                type="number"
                                                                label="Horas Aproveitadas"
                                                                style={{ width: 'fit-content', display: hourLoadShow === true ? "flex" : "none" }}
                                                                className={classes.textField}
                                                                value={avaliation.hourLoad}
                                                                onChange={handleAvaliation('hourLoad')}
                                                                margin="normal"
                                                                autoComplete="off"
                                                                maxLength="5"
                                                            />
                                                            <TextField
                                                                id="obs"
                                                                required
                                                                label="Observações"
                                                                multiline rows="4"
                                                                style={{ display: obsShow === true ? "flex" : "none" }}
                                                                className={classes.textField}
                                                                value={avaliation.obs}
                                                                onChange={handleAvaliation('obs')}
                                                                margin="normal"
                                                                variant="filled"
                                                            />
                                                        </Grid>
                                                        <Grid container direction="row" justify="space-between" alignItems="center" style={{ display: hourLoadShow === true ? "flex" : "none" }}>
                                                                <FormControl style={{ marginTop: 10 }} component="fieldset">
                                                                    <FormLabel component="legend">Necessita mudar o Grupo e/ou Atividade?</FormLabel>
                                                                    <RadioGroup aria-label="position" name="position" value={valueRadioInfo} onChange={handleChangeRadioInfo} row required>
                                                                        <FormControlLabel value="yes"
                                                                        control={<Radio color="primary" />}
                                                                        label="Sim" labelPlacement="end" onChange={(e) => {handleInfoChange('yes')}}/>
                                                                        <FormControlLabel value="no"
                                                                        control={<Radio color="secondary" />}
                                                                        label="Não" labelPlacement="end" onChange={(e) => {handleInfoChange('no')}}/>
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                        <Grid container direction="row" justify="space-between" alignItems="center">
                                                            <div style = {{marginTop: '2%', width: '100%', display: changeInfo === true ? "flex" : "none" }}>
                                                                <FormControl style = {{width: '35%'}}>
                                                                    <InputLabel style = {{ position: 'relative' }}htmlFor="groupSelect">
                                                                        Grupo da ACG
                                                                    </InputLabel>
                                                                    <Select
                                                                        value={selectValues.group}
                                                                        className={classes.textField}
                                                                        style={{ width: '100%', marginTop: 0 }}
                                                                        onChange={handleChangeGroup}
                                                                        inputProps={{
                                                                            name: 'group',
                                                                            id: 'groupSelect',
                                                                        }}
                                                                        >
                                                                        {groups.map((group, index) => (
                                                                            <MenuItem
                                                                                key={index}
                                                                                value={group.idGrupo}
                                                                                name={group.nome}
                                                                            >
                                                                                {group.nome}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <div style={{ margin: '2%'}}></div>
                                                                <FormControl style = {{width: '60%' }}>
                                                                    <InputLabel  style = {{ position: 'relative' }} htmlFor="activitieSelect">
                                                                        Atividade
                                                                    </InputLabel>
                                                                    <Select
                                                                        value={selectValues.activitie}
                                                                        disabled={actSelect}
                                                                        className={classes.textField}
                                                                        style={{ width: '100%', marginTop: 0 }}
                                                                        onChange={handleChangeSelect}
                                                                        inputProps={{
                                                                            name: 'activitie',
                                                                            id: 'activitieSelect',
                                                                        }}
                                                                        >
                                                                            {activities.map((activitie, index) => (
                                                                                <MenuItem
                                                                                key={index}
                                                                                value={activitie.idAtividade}
                                                                                name={activitie.descricao}
                                                                                >
                                                                                    {activitie.descricao}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </Grid>
                                                        <Grid container direction="row" justify="flex-end" alignItems="center">
                                                            <Button style={{ marginTop: 5, display: showButton === true ? "flex" : "none" }} onClick={handleSubmit} variant="contained" color="primary" className={classes.button}>
                                                                <DescriptionIcon />
                                                                Confirmar
                                                            </Button>
                                                        </Grid>
                                                    </CardContent>
                                                </Modal>
                                                <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description"
                                                    open={openDetails[index]} onClose={handleCloseDetails} >
                                                    <CardContent style={modalStyle} className={classes.paperModal}>
                                                        <Grid container direction="column" justify="space-evenly" alignItems="stretch" spacing={2}>
                                                            <Grid item xs>
                                                                <Typography variant="h5" gutterBottom>
                                                                    Avaliação de Solicitação
                                                                </Typography>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-around" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                        <Typography paragraph >
                                                                            <strong>Aluno: </strong>{row.nomeAluno}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                        <Typography paragraph>
                                                                            <strong>Matrícula: </strong>{row.matricula}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph >
                                                                        <strong>Atividade: </strong>{row.atividade.descricao}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph >
                                                                        <strong>Grupo: </strong>{row.atividade.grupo.nome}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-around" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Professor Responsável: </strong>{row.profRes}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Local: </strong>{row.local}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Início: </strong>{row.dataInicio}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Fim: </strong>{row.dataFim}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph>
                                                                        <strong>Carga Horária Solicitada: </strong>{row.cargaHorariaSoli} hora(s)
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container justify="space-between" alignItems="center">
                                                                <Typography paragraph>
                                                                    <strong>Descrição: </strong>{row.descricao}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                <Grid item xs={6}>
                                                                    <Typography paragraph style={{ marginBottom: 0 }}>
                                                                        <strong>Comprovantes: </strong>
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                                                {anexos.map((anexo, index) => (
                                                                    <Grid item key={anexo.idAnexo} xs={4} style={{ maxWidth: '30%' }}>
                                                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%', margin: '1%' }}>
                                                                            <label htmlFor={anexo.idAnexo}>{anexo.doc.nome}</label>
                                                                            <Fab 
                                                                                id={anexo.idDocNecessario}
                                                                                onClick={(e) => {
                                                                                    window.open(
                                                                                        `http://localhost:2222/avaliacao/file/${anexo.nome}`,
                                                                                        '_blank',
                                                                                        'noopener'
                                                                                    )
                                                                                }}
                                                                                variant="extended"
                                                                                color="primary"
                                                                                aria-label="attach"
                                                                                className={classes.margin}>
                                                                                <GetAppIcon className={classes.extendedIcon} />
                                                                                Arquivo {index + 1}
                                                                            </Fab>
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                            <Divider style={{ marginBottom: "1%" }}/>
                                                        </Grid>
                                                        <Grid container justify="space-between" alignItems="center">
                                                                <Typography paragraph>
                                                                    <strong>Situação: </strong>{row.status}
                                                                </Typography>
                                                            </Grid>
                                                        <Grid container direction="row" justify="flex-end" alignItems="center">
                                                            <Button style={{ marginTop: 5}} onClick={handleCloseDetails} variant="contained" color="primary" className={classes.button}>
                                                                Fechar
                                                            </Button>
                                                        </Grid>
                                                    </CardContent>
                                                </Modal>
                                                <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                                                    <Grid container direction="column" justify="space-around" alignItems="center">
                                                        <DialogTitle id="alert-dialog-title">{submitMessage}</DialogTitle>
                                                        <DialogActions>
                                                            <Button onClick={handleCloseDialog} color="primary" autoFocus>
                                                                    OK!
                                                            </Button>
                                                        </DialogActions>
                                                    </Grid>
                                                </Dialog>
                                                <Dialog open={openDialogDelete} onClose={handleCloseDialogDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                                                    <Grid container direction="column" justify="space-around" alignItems="center">
                                                        <DialogTitle id="alert-dialog-title">{submitMessage}</DialogTitle>
                                                        <DialogActions>
                                                            <Button onClick={() => handleDelete(idDelete)} color="primary" autoFocus>
                                                                    Confirmar
                                                            </Button>
                                                            <Button onClick={handleCloseDialogDelete} color="primary" autoFocus>
                                                                    Cancelar
                                                            </Button>
                                                        </DialogActions>
                                                    </Grid>
                                                </Dialog>
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