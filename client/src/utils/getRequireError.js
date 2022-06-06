export default function getRequireError(returnedError){
    if(returnedError){
        // Récupérer le message de l'erreur et la position du début de l'erreur 'VM Exception'
        let errorMessageString = JSON.stringify(returnedError.message).toString()
        let indexStart = errorMessageString.indexOf('VM Exception')

        //Récupérer le message de l'erreur à partir de la chaine 'VM Exception' et la position de la fin du message d'erreur
        let message = errorMessageString.substring(indexStart)
        let indexEnd = message.indexOf('\\\"')

        //Récupération de l'erreur
        let errorMessage = message.substring(0,indexEnd)
        alert('Transaction failed : '+errorMessage);
      
      }
}