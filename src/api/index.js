import Api from './../services/httpService/http-common';
import {endPoint} from './../config/config';

let ActivitiesApi = {
    getActivities: (data) => {
        return Api.get({
            url: endPoint + '/activities',
            data,
            method: 'GET',
        })
    },
}

export default ActivitiesApi;
