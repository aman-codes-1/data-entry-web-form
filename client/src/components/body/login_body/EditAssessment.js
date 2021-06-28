import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notification'
import '../auth/assets/css/style.css'
import './assets/css/style.css'
import assessmentCard from './assets/images/assessmentCard.svg'

const initialState = {
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    err: '',
    success: ''
}

function CreateAssessment() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const {user} = auth
    const [data, setData] = useState(initialState)
    const {questionTitle, option1, option2, option3, option4, err, success} = data

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }    
    
    const updateAssessmentInfo = () => {
        try {
            axios.patch('/user/update_assessment', {
                questionTitle: questionTitle ? questionTitle : user && user.assessment_questions && user.assessment_questions.questionTitle,
                option1: option1 ? option1 : user && user.assessment_questions && user.assessment_questions.option1,
                option2: option2 ? option2 : user && user.assessment_questions && user.assessment_questions.option2,
                option3: option3 ? option3 : user && user.assessment_questions && user.assessment_questions.option3,
                option4: option4 ? option4 : user && user.assessment_questions && user.assessment_questions.option4
            },{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "All details are updated."})

            history.push("/")
            history.go(0)

        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleUpdateAssessment = e => {
        e.preventDefault();
        if(questionTitle || option1 || option2 || option3 || option4) updateAssessmentInfo()
    }

    return (
        <div className="container-fluid px-1 py-5 mx-auto bgClr3">
            <div className="row d-flex justify-content-center">
                <div className="col-md-7 text-center">
                    <h2 className="Have_a_Question_in_mind">Have a Question in mind?</h2>
                    <div className="card card2">
                        {user && user.assessment_questions && user.assessment_questions.map((question) => (
                            <form className="form-card" onSubmit={handleUpdateAssessment}>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-12 flex-column d-flex"> 
                                        <label className="form-control-label px-3 form-control-label2">Question<span className="text-danger"> *</span></label>
                                        <input className="input1" type="text" id="questionTitle" name="questionTitle" defaultValue={question.questionTitle} placeholder="Enter Question" onChange={handleChangeInput} />
                                    </div>
                                </div>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label px-3 form-control-label2">Option #1<span className="text-danger"> *</span></label>
                                        <input className="input1" type="text" id="option1" name="option1" defaultValue={question.option1} placeholder="Enter Option #1" onChange={handleChangeInput} />
                                    </div>
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label px-3 form-control-label2">Option #2<span className="text-danger"> *</span></label>
                                        <input className="input1" type="text" id="option2" name="option2" defaultValue={question.option2} placeholder="Enter Option #2" onChange={handleChangeInput} />
                                    </div>
                                </div>
                                <div className="row justify-content-between text-left">
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label px-3 form-control-label2">Option #3<span className="text-danger"> *</span></label>
                                        <input className="input1" type="text" id="option3" name="option3" defaultValue={question.option3} placeholder="Enter Option #3" onChange={handleChangeInput} />
                                    </div>
                                    <div className="form-group col-sm-6 flex-column d-flex">
                                        <label className="form-control-label px-3 form-control-label2">Option #4<span className="text-danger"> *</span></label>
                                        <input className="input1" type="text" id="option4" name="option4" defaultValue={question.option4} placeholder="Enter Option #4" onChange={handleChangeInput} />
                                    </div>
                                </div>
                                <div>
                                    {err && showErrMsg(err)}
                                    {(success && showSuccessMsg(success))}
                                </div>
                                <div className="row justify-content-end">
                                    <div className="form-group col-sm-6"> <button type="submit" className="btn-block btn-primary button1" disabled={loading}>Update</button> </div>
                                </div>
                            </form>
                        ))}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="svg-pic">
                        <img src={assessmentCard} alt="login" className="login-card-img2" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAssessment
