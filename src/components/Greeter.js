import React, {Component} from 'react';
import config from '../assets/json/config.json';
import styles from '../assets/css/Greeter.css';//导入
import {fetchData} from '../utils/fetch'


class Greeter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    render() {
        return (
            <div className={styles.root}>
                {/*
                    style={{backgroundImage:`url(${require('../assets/img/bg.jpg')})`}}
                     行间样式是没问题的，可以加载到
                */}
                <span>{config.greetText}888</span>
                <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.data}</pre>
                <img src={require('../assets/img/bg.jpg')} className={styles.img} alt=""/>
            </div>
        );
    }

    componentDidMount() {
        // 已经拦截
        fetchData('sta/get',{},(data)=>{
            this.setState({data: data})
        })

        // 未拦截
        // fetch('/api/sta/get', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'token': 'debug'
        //     },
        //     body: JSON.stringify({})
        // }).then(function (response) {
        //     return response.text()
        // }).then(function (body) {
        //     self.setState({data: body})
        //     // document.body.innerHTML = body
        // })

    }
}

export default Greeter