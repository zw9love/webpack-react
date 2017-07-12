import React, {Component} from 'react';
import config from './config.json';
import styles from './Greeter.css';//导入
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
                <span>{config.greetText}666999</span>
                <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.data}</pre>
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