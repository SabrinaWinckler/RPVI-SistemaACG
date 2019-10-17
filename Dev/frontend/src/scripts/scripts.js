import axios from 'axios'

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

export const sendForm = async (data) => {
    var formData = new FormData()
    formData.append("data", JSON.stringify(data))
    // const blob = new Blob([file], {
    //     type: 'application/json'
    //   });
    // formData.append("file", blob)
    axios.post('http://localhost:8081/solicitacao/', JSON.stringify(data))
            .then(data => {
                console.log(data)
                return true
            })
            .catch(error => {
                console.error(error.response.data.message)
                return false
            })
    // const response = await fetch(url, { method: method, body: JSON.stringify(json) })
    // return response.ok;
}

export const deleteSolicitacao = async (itemId) => {

    axios.delete(`http://localhost:8081/solicitacao/${itemId}`, { params: { id: itemId } })
            .then(response => {
                console.log(response)
                return true
            })
            .catch(error => {
                console.error(error.response.data.message)
                return false
            })

}