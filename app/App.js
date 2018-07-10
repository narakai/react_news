/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, View} from 'react-native';
import HttpMovieManager from "./HttpManager";
import ErrorBean from "./ErrorBean";
import {show} from "./ToastUtils";

const moviesCount = 20;
const GrayColor = '#9D9D9D';
const GrayBlackColor = '#666666';
const White = '#ffffff';
const Translucent = 'rgba(125,125,125,0.6)';
const MainBg = '#f5f5f5';
const GrayWhiteColor = '#f5f5f5';
const MikeWhiteColor = '#f0ffff';
const BlackTextColor = '#444444';
const BlackColor = '#000000';
const WhiteTextColor = '#ffffff';
const itemHight = 200;


export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movieData: {},
        }
        this.HttpMovies = new HttpMovieManager();
        this.requestData()
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                {/*列表*/}
                <FlatList
                    data={this.state.movieData.subjects}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => this._renderItemView(item)}
                    getItemLayout={(data, index) => this._getItemLayout(data, index)}
                    showsVerticalScrollIndicator={false}/>
            </View>
        );
    }

    requestData() {
        let start = 0;
        this.HttpMovies.getOtherMovieData(this.index, start, moviesCount)
            .then((movies) => {
                console.log(movies);
                let preSubjects = this.state.movieData.subjects;
                if (preSubjects != null && preSubjects.length > 0) {
                    preSubjects.filter((item, i) => {
                        return i < moviesCount;
                    }).forEach((item, i) => {
                        movies.subjects.push(item)
                    })
                }
                if (movies.subjects[0].title == null) {
                    let subjects = [...movies.subjects.map(item => item.subject)];
                    movies.subjects = subjects;
                }
                this.setState({
                    movieData: movies,
                })
            })
            .catch((error) => {
                if (error != null && error instanceof ErrorBean) {
                    show(error.getErrorMsg())
                } else {
                    show("网络错误")
                }
            })
    }

    _renderItemView(item) {
        console.log(item);
        return (
            <View style={styles.item}>
                <Image
                    source={{uri: item.images.large}}
                    style={styles.item_img}/>
                <View style={styles.item_right}>
                    <Text style={styles.item_right_title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.item_right_text}
                          numberOfLines={1}>导演: {(item.directors[0] != null ? item.directors[0].name : "未知")}</Text>
                    <Text style={styles.item_right_text}
                          numberOfLines={2}>主演: {item.casts.map((data, i) => data.name).join(' ')}</Text>
                    <Text style={styles.item_right_text} numberOfLines={1}>{item.year}</Text>
                </View>
            </View>
        )
    }

    _getItemLayout(data, index) {
        return {length: itemHight, offset: itemHight * index, index}
    }
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    loading_text: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 6,
        backgroundColor: 'transparent',
    },
    reload_view: {
        padding: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        borderWidth: 3,
        borderRadius: 6,
    },
    container: {
        flex: 1,
        backgroundColor: MainBg,
    },
    toolbar_left_img: {
        width: 26,
        height: 26,
        alignSelf: 'center',
        marginLeft: 20,
    },
    toolbar_middle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolbar_middle_text: {
        fontSize: 18,
        fontWeight: '600',
        color: White
    },
    toolbar_right_img: {
        width: 26,
        height: 26,
        alignSelf: 'center',
        marginRight: 20,
    },
    item_img: {
        // alignItems相当于gravity、alignSelf相当于layout_gravity
        alignSelf: 'center',
        width: 96,
        height: 155,
        borderRadius: 4,
        marginRight: 10,
    },
    item_right: {
        alignItems: 'center',
        height: itemHight - 20,
        flex: 1,
        justifyContent: 'center',
    },
    item_right_title: {
        color: GrayBlackColor,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    item_right_text: {
        fontSize: 14,
        color: GrayColor,
        marginBottom: 4,
    },
    item_right_rating: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center',
    },
    item_right_rating_text: {
        fontSize: 14,
        color: '#ffcc33',
        fontWeight: '500',
        marginLeft: 8,
    }
});
