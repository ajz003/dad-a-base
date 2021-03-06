import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ForumNav from "./forumcomp/forumNav";
import Category from "./forumlevels/Category";
import Topic from "./forumlevels/Topic";
import Post from "./forumlevels/Post";
import "./ForumStyle.css";
import "./Styles.css";
import Background from "./images/bg1.png"
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
var moment = require('moment');
moment().format();


var Bg = {
    height: "100vh",
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'fixed',
    margin: "0",
    // fixed the non repeating background
    overflowX: 'hidden'

};


class Forum extends React.Component {

    state = {
        categoryResults: [],
        topicResults: [],
        postResults: [],
        currentLevel: "Category",
        topicId: "",
        postId: "",
        postInput: "",
        topicTitle: "",
        username: ""
    };

    componentDidMount() {

        axios.get("/api/categories/all").then((response) => {

            if (response.data.length === 0) {
                axios.get("/anthony/scrapeDadForum").then(() => {
                    axios.get("/api/categories/all").then((response) => {
                        this.setState({ categoryResults: response.data })
                    })
                })
            }

            else {
                this.setState({ categoryResults: response.data })
            }

        })

        this.props.checkLogIn();
    }

    componentDidUpdate() {

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleLevelChange = (e, level) => {
        if (this.state.currentLevel === "Category") {
            let topicID = e.currentTarget.id
            axios.get(`/api/topics/${topicID}`).then(response => {
                // console.log(typeof(response.data))
                // console.log(response.data)
                // console.log("handlelevelchange response.data: " + JSON.stringify(response.data))
                // console.log("handlelevelchange response.data (JSON): " + JSON.stringify(response.data))
                // let results = JSON.stringify(response.data)
                // console.log(typeof(results))
                // update state object with newest data
                if (response.data.length === 0) {
                    console.log(this.state.topicResults, "topic results")
                    this.setState({
                        currentLevel: level,
                        topicId: topicID,
                        topicResults: []
                    });
                } else {
                    this.setState({
                        topicResults: response.data,
                        currentLevel: level,
                        topicId: topicID
                    });
                }
            });
        }
        if (this.state.currentLevel === "Topic") {
            let postId = e.currentTarget.id
            let topictitle = e.currentTarget.getAttribute('txt')

            this.setState({ currentLevel: level, postId: e.currentTarget.id, topicTitle: topictitle });
            // after component loads, get all products from db
            axios.get(`/api/posts/${postId}`).then(response => {
                // update state object with newest dat

                this.setState({
                    postResults: response.data
                });

            });
        }

    };



    upOneLevel = () => {
        if (this.state.currentLevel === "Topic") {
            this.setState({
                currentLevel: "Category",
                topicId: ""
            });

        }
        if (this.state.currentLevel === "Post") {

            axios.get(`/api/topics/${this.state.topicId}`).then(response => {
                this.setState({
                    topicResults: response.data,
                    currentLevel: "Topic",
                    postId: ""
                });
            });
        }
    };


    makeAPost = () => {

        let postId = this.state.postId;
        let userId = "1";

        axios
            .post(`/api/posts/${postId}`, {
                body: this.state.postInput,
                TopicId: postId,
                UserId: userId
            })
            .then(response => {
                let resInfo = JSON.stringify(response)

                if (response.data === false) {
                    return this.props.history.push("/Login")
                }

                axios.get(`/api/posts/${postId}`).then((res) => {


                    this.setState({
                        postResults: res.data,
                        postInput: ""
                    });

                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    makeATopic = () => {

        let topicId = this.state.topicId

        axios.post(`/api/topics/${topicId}`, {
            title: this.state.topicTitle,
            CategoryId: topicId
        }).then((response) => {

            if (response.data === false) {
                return this.props.history.push("/Login")
            }
            console.log("the response: " + response.data)
            let postId = response.data


            axios.post(`/api/posts/${postId}`, {
                body: this.state.forumInput,
                TopicId: postId
            })
                .then(response => {

                    // after component loads, get all products from db
                    axios.get(`/api/posts/${postId}`).then((res) => {
                        console.log(res)
                        // update state object with newest data
                        this.setState({
                            postResults: res.data,
                            currentLevel: "Post",
                            postId: postId,
                            postInput: ""
                        });
                        console.log(this)
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    };

    deleteAPost = (e) => {

        let specificPost = e.target.id
        let userId = e.currentTarget.getAttribute('userid')
        let author = e.currentTarget.getAttribute('author').replace(/\s+/g, '');
        console.log("userid: " + userId)

        axios
            .delete(`/api/posts/${specificPost}/${userId}/${author}`)
            .then(response => {

                if (response.data === false) {
                    return this.props.history.push("/Login")
                }

                if (response.data === true) {
                    axios.get(`/api/posts/${this.state.postId}`).then((res) => {
                        console.log(res)

                        this.setState({
                            postResults: res.data,
                            postInput: ""
                        });

                    });
                } else {
                    alert(response.data)
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    };


    deleteATopic = (e) => {

        let specificTopic = e.target.id
        let owner = e.currentTarget.getAttribute('owner')
        console.log("owner: " + owner)

        axios
            .delete(`/api/topics/${specificTopic}/${owner}`)
            .then(response => {

                if (response.data === false) {
                    return this.props.history.push("/Login")
                }

                if (response.data === true) {
                    axios.get(`/api/topics/${this.state.topicId}`).then((res) => {
                        console.log(res)

                        this.setState({
                            topicResults: res.data
                        });

                    });
                } else {
                    alert(response.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    renderLevel = () => {
        if (this.state.currentLevel === "Category") {
            return (
                <Category
                    handleLevelChange={this.handleLevelChange}
                    categoryResults={this.state.categoryResults}
                />
            );
        }
        if (this.state.currentLevel === "Topic") {
            return (
                <Topic
                    handleLevelChange={this.handleLevelChange}
                    handleChange={this.handleChange}
                    upOneLevel={this.upOneLevel}
                    makeATopic={this.makeATopic}
                    topicResults={this.state.topicResults}
                    deleteATopic={this.deleteATopic}
                    convertTime={this.convertTime}
                    username={this.props.username}
                />
            );
        }
        if (this.state.currentLevel === "Post") {
            return (
                <Post
                    postId={this.state.postId}
                    upOneLevel={this.upOneLevel}
                    handleChange={this.handleChange}
                    postInput={this.state.postInput}
                    topicTitle={this.state.topicTitle}
                    renderLevel={this.renderLevel}
                    currentLevel={this.state.currentLevel}
                    makeAPost={this.makeAPost}
                    postResults={this.state.postResults}
                    deleteAPost={this.deleteAPost}
                    convertTime={this.convertTime}
                    username={this.props.username}
                />
            );
        }
    };

    convertTime = (time) => {

        let finalDate = moment(time).format("MM-DD-YYYY, h:mm A")

        return finalDate;
    }

    forumStyle = {
        marginTop: "-30px"
    }

    render() {

        return (
            <div style={Bg}>
                <div className="forum-wrapper" style={this.forumStyle}>
                    <ForumNav />
                    {this.renderLevel()}
                </div>
            </div>
        );
    }
}

export default Forum;
