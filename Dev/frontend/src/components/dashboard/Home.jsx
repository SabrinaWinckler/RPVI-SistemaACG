import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, Typography, Grid } from '@material-ui/core';

import { UserContext } from '../../context/UserContext'

import student from '../../assets/studentIconW.png'
import coord from '../../assets/coordinatorIconW.png'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        margin: 'auto',
        width: '50%',
        marginTop: theme.spacing(4),
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        minHeight: '15%',
        minWidth: '15%',
        maxHeight: '15%',
        maxWidth: '15%',
    },
}));

export default function PaperSheet() {
    const classes = useStyles();

    const { user, setUser } = useContext(UserContext)

    const handleUser = event => {
        switch (event.target.id) {
            case 'disc':
                setUser('discente')
                console.log(event.target.id)
                break;
            case 'coord':
                setUser('coordenador')
                console.log(event.target.id)
                break
            default:
                break;
        }

        console.log(user)
    }

    return (
        <div>
            <Paper className={classes.root} styles={{}}>
                <Typography variant="h5" component="h3">
                    Bem vindo ao P.IN.G.A.!
                </Typography>
                <Typography component="p">
                    Escolha seu perfil de usuário:
                </Typography>
                <Grid container direction="row" justify="space-around" alignItems="center">
                        <Button variant="contained" id="disc" onClick={handleUser} className={classes.button} style={{ backgroundColor: '#009045' }} href="/painel">
                            <Grid container id="disc" direction="column" justify="center" alignItems="center">
                                <img id="disc" src={student} style={{ width: 50, height: 50 }} alt="Student" />
                                <Typography id="disc" variant="button" display="block" gutterBottom>
                                    Discente
                            </Typography>
                            </Grid>
                        </Button>
                        <Button variant="contained" id="coord" onClick={handleUser} className={classes.button} style={{ backgroundColor: '#009045' }} href="/painel">
                            <Grid container id="coord" direction="column" justify="center" alignItems="center">
                                <img src={coord} id="coord" style={{ width: 50, height: 50 }} alt="Coordinator" />
                                <Typography id="coord" variant="button" display="block" gutterBottom>
                                    Coordenador
                            </Typography>
                            </Grid>
                        </Button>
                </Grid>
            </Paper>
        </div>
    );
}