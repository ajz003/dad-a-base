import React from "react";
import axios from "axios";
import Background from "./images/bg1.png";
import Waterslide from "./images/waterslide.png"

var Bg = {
  height: "100vh",
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  margin: "0",
  overflowX: 'hidden'


};


class ThingsToDo extends React.Component {
    state = {
      results: [],
      title: "poop"
    };
    

    style = {
      width: '30%',
      height: '30%',
      
    }
    componentDidMount() {
        // after component loads, get all products from db
        axios.get("/john/allLaCurbed").then((response) => {
          if (response.data.length === 0) {
              axios.get("/john/scrapeLaCurbed").then((res) => {
                this.setState({
                  results: res.data
                })
              })            
          }
          else {
          this.setState({ results: response.data})
          }
    
      })
      }

      
     render() {
        return (
          <div className="topMargin" style={Bg}>
            {this.state.results.map(item => {
                return (
                <div className="container" style={{paddingTop:' 7rem '}}>
                  <div className="card">
                    <div className="row">
                      <div className="col-md-4">
                      <img src={Waterslide} width="200" height="275px" className="w-100"></img>
                      </div>
                      <div className="col-md-8 px-3">
                        <div className="card-block px-3 mt-3">
                          <h4 className="card-title">{item.title}</h4>
                          <p className="card-text">{item.description}.</p> 
                          <p className="card-text">{item.address}.</p> 
                          <a href={item.link} className="ttd btn btn-primary"target="_blank">More Info</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
          </div>
        
        
        );
      }
    }
export default ThingsToDo;

