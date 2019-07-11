import React, { Component } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

export default class Index extends Component {
    constructor() {
        super();
        this.state = {
            login: false,
            email: "",
            password: "",
            user: []
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        Axios.post("/api/login", {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                const token = res.data.access_token;
                Axios.defaults.headers.common["Authorization"] =
                    "Bearer " + token;
                Axios.get("/api/me")
                    .then(res => {
                        this.setState({ user: res.data });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                this.setState({ login: true });
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleLogout() {
        Axios.post("/api/logout").then(res => {
            Axios.defaults.headers.common["Authorization"] = "";
            this.setState({ login: false });
            console.log(this.state.login);
        });
    }

    UserTyping(type, e) {
        switch (type) {
            case "email":
                this.setState({ email: e.target.value });
                return;
            case "password":
                this.setState({ password: e.target.value });
                return;
            default:
                return;
        }
    }

    render() {
        let name;
        if (this.state.login === false) {
            name = "まだ未ログイン";
        } else {
            name = (
                <ul>
                    <li>ログイン済み</li>
                    <li>名前：{this.state.user.name}</li>
                    <li>メールアドレス：{this.state.user.email}</li>
                </ul>
            );
        }
        console.log(this.state);
        return (
            <div className="container">
                <h4>ログイン用</h4>
                <form
                    onSubmit={e => {
                        this.handleSubmit(e);
                    }}
                >
                    <input
                        type="email"
                        placeholder="mail"
                        onChange={e => {
                            this.UserTyping("email", e);
                        }}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        onChange={e => {
                            this.UserTyping("password", e);
                        }}
                    />
                    <input type="submit" value="送信" />
                </form>
                {name}

                <button
                    type="button"
                    value="ログアウト"
                    onClick={e => {
                        this.handleLogout(e);
                    }}
                >
                    ログアウト
                </button>
            </div>
        );
    }
}

if (document.getElementById("example")) {
    ReactDOM.render(<Index />, document.getElementById("example"));
}
