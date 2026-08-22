import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method , url , bodyData , headers , params) => {
    return axiosInstance({
        method : `${method}`,
        url : `${url}`,
        data : bodyData ? bodyData : null,
        headers : headers ? headers : null,
        params : params ? params : null
    })
}

// backend call services se ja rhi hai

// backend se data lane ke liye axios call karne hai by apiconnector
// example in navbar -> for catalog