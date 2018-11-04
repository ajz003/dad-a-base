import React from "react";
import axios from "axios";



class Vacation extends React.Component {
    state = {
      results: []
    };
  
    componentDidMount() {
      // after component loads, get all products from db
      axios.get("/joseph/allVacations").then((response) => {
        if (response.data.length === 0) {
            axios.get("/joseph/scrapeVacations").then((res) => {
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
        <div className="topMargin">
          {this.state.results.map(item => {
              return (
              <div className="container py-3">
                <div className="card">
                  <div className="row ">
                    <div className="col-md-4">
                      <img src={item.image} className="w-101" id="vacapic"></img>
                    </div>
                    <div className="col-md-8 px-3">
                      <div className="card-block px-3 mt-3">
                        <h4 className="card-title">{item.title}</h4>
                        <p className="card-text">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                        <p className="card-text">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <a href={item.link} className="btn btn-primary" target="_blank">More Info</a>
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
  export default Vacation;