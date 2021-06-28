import React, {useState} from 'react'
import { BrowserRouter, Switch, Route, NavLink, useHistory } from 'react-router-dom'
import {useSelector} from 'react-redux'
import NotFound from '../../utils/NotFound/NotFound'
import Dashboard from './Dashboard'
import CreateAssessment from './CreateAssessment'
import EditUser from '../users/EditUser'
import EditAssessment from './EditAssessment'
import './assets/css/style.css'

function LoginBody() {

    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin} = auth

    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    const history = useHistory()

    const loadTable =  async () => {
        setLoading(false)
        setCallback(!callback)
        history.push("/")
    }

    return (  
        <BrowserRouter>
         <main className="d-flex align-items-center min-vh-90 py-3 py-md-0">
            <div className="container">
                <div className="card">
                    
                    <div className="col-md-8">
                        <div className="card-body">
                            <ul className="nav nav-pills">
                                <li style={{paddingRight: "15px"}} className="active"><NavLink exact data-toggle="pill" className="nav-link navLink" to="/" onClick={loadTable}>Dashboard</NavLink></li>
                                <li><NavLink data-toggle="pill" className="nav-link navLink" to="/create_assessment">Create Assessment</NavLink></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card-body">
                            <Switch>
                                <Route exact path="/" render={props => (<Dashboard {...props}/>)}/>
                                <Route path="/create_assessment" component={CreateAssessment} />
                                <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} exact />
                                <Route path="/edit_assessment/:questionid" component={isLogged ? EditAssessment : NotFound} exact />
                            </Switch>
                        </div>
                    </div>

                </div>
            </div>
        </main>
      </BrowserRouter>
    )
}

export default LoginBody