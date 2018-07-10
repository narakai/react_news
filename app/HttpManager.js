import {ErrorAnayle, NetWork_Request_Error} from "./ErrorAnayle";
import ErrorBean from "./ErrorBean";
import {show} from "./ToastUtils";

/*基础链接头*/
const BaseUrl = "https://api.douban.com/v2"
/*top250*/
const Movie_UpComming_Url = "/movie/top250"
/*口碑榜*/
const Movie_Praise_Url = "/movie/weekly"
/*北美票房榜*/
const Movie_North_Url = "/movie/us_box"
/*新片榜*/
const Movie_News_Url = "/movie/new_movies"

const Base = {
    name: 'apikey',
    value: '0df993c66c0c636e29ecbb5344252a4a'
}

export default class HttpMovieManager {

    /*电影列表数据*/
    getOtherMovieData(index, start, count) {
        let Suffix = Movie_UpComming_Url;
        let key = "";
        switch (index) {
            case 0:
                break;
            case 1:
                Suffix = Movie_Praise_Url;
                key = "&" + Base.name + "=" + Base.value;
                break;
            case 2:
                Suffix = Movie_North_Url;
                break;
            case 3:
                Suffix = Movie_News_Url;
                key = "&" + Base.name + "=" + Base.value;
                break;
        }
        return new Promise((resolve, reject) => {
            this.fetchNetData(BaseUrl + Suffix + "?start=" + start + "&count=" + count + key)
                .then((data) => {
                    if (data != null) {
                        if (data.code != null && typeof data.code == 'number') {
                            reject(ErrorAnayle.getErrorBean(data.code))
                        } else if (data.subjects != null && data.subjects.length > 0) {
                            resolve(data)
                        } else {
                            reject(ErrorAnayle.getErrorBean(NetWork_Request_Error))
                        }
                    } else {
                        reject(ErrorAnayle.getErrorBean(NetWork_Request_Error))
                    }
                }).catch((error) => {
                if (error != null && error instanceof ErrorBean) {
                    reject(error)
                } else {
                    reject(ErrorAnayle.getErrorBean(NetWork_Request_Error))
                }
            })
        })
    }

    /*请求数据=本地加网络*/
    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    // console.log(response.json());
                    return response.json();
                })
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((error) => {
                    reject(ErrorAnayle.getErrorBean(NetWork_Request_Error))
                })
                .done();
        })
    }
}