import axios from 'axios'
import _ from 'lodash'

export const validateName = (name) => {
    var regName = /^[a-zA-Z\s]*$/;

    if (!regName.test(name)) {
        return false;
    } else {
        return true;
    }
}

export const validateRegistration = (number) => {
    var size = number.toString().length
    if (size === 10) {
        return true
    } else {
        return false
    }
}

export const validateDate = (date) => {
    var varDate = new Date(date);
    var today = new Date()
    varDate.setHours(0,0,0,0)
    today.setHours(0,0,0,0)

    if (varDate > today) {
        return false
    } else {
        return true
    }
}

function getFilesList(array) {
    let list = []
    let index
    for (index = 0; index < array.length; index++) {
        list.push(array[index].file)
    }
    return list
}

export const sendForm = async (data, files) => {
    var formData = new FormData()
    _.forEach(data, (value, index)=>{
        formData.append(index, value);
    })
    _.forEach(getFilesList(files), (value)=>{
        formData.append("file", value)
    })
    axios.post('http://localhost:2222/solicitacao/', formData)
            .then(data => {
                console.log('aqui chegou')
                return true
            })
            .catch(error => {
                console.error(error.response.data.message)
                return false
            })
}

export const sendAvaliation = async (data, id) => {
    var formData = new FormData()
    _.forEach(data, (value, index)=>{
        formData.append(index, value);
    })
    axios.post(`http://localhost:2222/avaliacao/${id}`)
            .then(data => {
                console.log(data)
                return true
            })
            .catch(error => {
                console.error(error.response.data.message)
                return false
            })
}

export const deleteSolicitacao = async (itemId) => {

    axios.delete(`http://localhost:2222/solicitacao/${itemId}`, { params: { id: itemId } })
            .then(response => {
                console.log(response)
                return true
            })
            .catch(error => {
                console.error(error.response.data.message)
                return false
            })

}

export const getActivities = (array, groupKey) => {
    let activities = []
    let index
    for (index = 0; index < array.length; index++) {
        if(array[index].grupo.idGrupo === groupKey){
            activities.push(array[index])
        }
    }
    return activities
}

export const getDocs = (array, actId) => {
    let docs = []
    let index
    for (index = 0; index < array.length; index++) {
        if(array[index].idAtividade === actId){
            for (let i = 0; i < array[index].docs.length; i++) {
                docs.push(array[index].docs[i])
            }
            return docs
        }
    }
    return null
}