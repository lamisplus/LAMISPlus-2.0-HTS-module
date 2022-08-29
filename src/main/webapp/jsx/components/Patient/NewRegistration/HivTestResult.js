import React, {useCallback, useEffect, useState} from "react";

import {FormGroup, Label , CardBody, Spinner,Input,Form} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {toast} from "react-toastify";
// import {Link, useHistory, useLocation} from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import axios from "axios";
import {token, url as baseUrl } from "../../../../api";
import 'react-phone-input-2/lib/style.css'
import {Label as LabelRibbon, Button} from 'semantic-ui-react'
// import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";



const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}));


const HivTestResult = (props) => {
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    console.log(props.patientObj)
    const patientID= props.patientObj && props.patientObj.personResponseDto ? props.patientObj.personResponseDto.id : "";
    const clientId = props.patientObj && props.patientObj ? props.patientObj.id : "";
    const [objValues, setObjValues]= useState(
        {
            confirmatoryTest: {},
            hivTestResult: "",
            htsClientId:"",
            personId: "",
            test1: {},
            tieBreakerTest: {}
           
        }
    )

    const [initialTest, setInitailTest]= useState(
        {
            date :"",
            result  :"",            
        }
    )
    const handleInputChangeInitial = e => { 
        //setErrors({...temp, [e.target.name]:""}) 
        setInitailTest ({...initialTest,  [e.target.name]: e.target.value});            
    }
    const [confirmatoryTest, setConfirmatoryTest]= useState(
        {
            date :"",
            result  :"",            
        }
    )
    const handleInputChangeConfirmatory = e => { 
        //setErrors({...temp, [e.target.name]:""}) 
        setConfirmatoryTest ({...confirmatoryTest,  [e.target.name]: e.target.value});            
    }
    const [tieBreakerTest, setTieBreakerTest]= useState(
        {
            date :"",
            result  :"",            
        }
    )
    const handleInputChangeTie = e => { 
        //setErrors({...temp, [e.target.name]:""}) 
        setTieBreakerTest ({...tieBreakerTest,  [e.target.name]: e.target.value});            
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }
    const validate = () => {
        //HTS FORM VALIDATION
        initialTest.result &&  (temp.date = initialTest.date ? "" : "This field is required.")
        initialTest.result && (temp.date = confirmatoryTest.date ? "" : "This field is required.")
        initialTest.result && (temp.date = tieBreakerTest.date ? "" : "This field is required.")
              
                setErrors({ ...temp })
        return Object.values(temp).every(x => x == "")
    }
    const handleSubmit =(e)=>{
        handleItemClick('recency-testing', 'hiv-test')
        e.preventDefault();
            objValues.htsClientId= clientId
            objValues.confirmatoryTest= confirmatoryTest
            objValues.personId= patientID
            objValues.test1= initialTest
            objValues.tieBreakerTest=tieBreakerTest
            console.log(objValues)
            axios.put(`${baseUrl}hts/${clientId}/pre-test-counseling`,objValues,
            { headers: {"Authorization" : `Bearer ${token}`}}, )
            .then(response => {
                setSaving(false);
                props.setPatientObj(response.data)
                toast.success("HIV test successful");
                handleItemClick('recency-testing', 'hiv-test')
            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                }
                else{
                    toast.error("Something went wrong. Please try again...");
                }
            });
            
    }

    return (
        <>
            <Card >
                <CardBody>
               
                <h2 style={{color:'#000'}}>REQUEST AND RESULT FORM</h2>
                    <form >
                        <div className="row">
                        <LabelRibbon as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
                        <h4 style={{color:'#fff'}}>HIV TEST RESULT</h4>

                        </LabelRibbon>
                           <br/>
                           <div className="form-group  col-md-2"></div>
                            <h4>Initial HIV Test:</h4>
                            <div className="form-group mb-3 col-md-5">
                                <FormGroup>
                                <Label for=""> Date  </Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={initialTest.date}
                                    onChange={handleInputChangeInitial}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateOfEac1 !=="" ? (
                                    <span className={classes.error}>{errors.dateOfEac1}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>Result </Label>
                                    <select
                                        className="form-control"
                                        name="result"
                                        id="result"
                                        value={initialTest.result}
                                        onChange={handleInputChangeInitial}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Reactive</option>
                                        <option value="No">Non Reactive</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-2"></div>
                            {initialTest.result ==='Yes' && (
                            <>
                            <h4>Confirmatory Test:</h4>
                            <div className="form-group mb-3 col-md-5">
                                <FormGroup>
                                <Label for=""> Date  </Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={confirmatoryTest.date}
                                    onChange={handleInputChangeConfirmatory}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateOfEac1 !=="" ? (
                                    <span className={classes.error}>{errors.dateOfEac1}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>Result </Label>
                                    <select
                                        className="form-control"
                                        name="result"
                                        id="result"
                                        value={confirmatoryTest.result}
                                        onChange={handleInputChangeConfirmatory}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Reactive</option>
                                        <option value="No">Non Reactive</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-2"></div>
                            </>
                            )}
                            {confirmatoryTest.result ==='No' && (
                            <>
                            <h4>Tie Breaker Test:</h4>
                            <div className="form-group mb-3 col-md-5">
                                <FormGroup>
                                <Label for=""> Date  </Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={tieBreakerTest.date}
                                    onChange={handleInputChangeTie}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                               
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>Result </Label>
                                    <select
                                        className="form-control"
                                        name="result"
                                        id="result"
                                        value={tieBreakerTest.result}
                                        onChange={handleInputChangeTie}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Reactive</option>
                                        <option value="No">Non Reactive</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-2"></div>
                            </>)}
                            <div className="form-group  col-md-6">
                                {initialTest.result==='No'  && (
                                    <LabelRibbon color="green" >
                                        Negative
                                    </LabelRibbon>
                                )}
                                
                                {(initialTest.result==='Yes' && confirmatoryTest.result==='Yes' ) && (
                                    <LabelRibbon color="red" >
                                        Positive
                                    </LabelRibbon>
                                )}
                                {(initialTest.result==='Yes' && confirmatoryTest.result==='No' && tieBreakerTest.result==='' ) && (
                                    <LabelRibbon color="green" >
                                        Negative
                                    </LabelRibbon>
                                )}
                                {(confirmatoryTest.result==='No' && tieBreakerTest.result==='Yes' ) && (
                                    <LabelRibbon color="red" >
                                        Positive
                                    </LabelRibbon>
                                )}
                                {(confirmatoryTest.result==='No' && tieBreakerTest.result==='No' ) && (
                                    <LabelRibbon color="green" >
                                        Negative
                                    </LabelRibbon>
                                )}
                            </div>
                            <LabelRibbon as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
                            <h5 style={{color:'#fff'}}>Syphilis Testing</h5>
                        </LabelRibbon>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Syphilis test result *</Label>
                                    <select
                                        className="form-control"
                                        name="syphilisTestResult"
                                        id="syphilisTestResult"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Reactive</option>
                                        <option value="No">Non-Reactive</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <hr/>
                            <br/>
                            <LabelRibbon as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
                            <h5 style={{color:'#fff'}}>Hepatitis B Testing</h5>
                            </LabelRibbon>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Hepatitis B virus test result *</Label>
                                    <select
                                        className="form-control"
                                        name="hepatitisBTestResult"
                                        id="hepatitisBTestResult"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Positive</option>
                                        <option value="No">Negative</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Hepatitis C virus test result *</Label>
                                    <select
                                        className="form-control"
                                        name="hepatitisCTestResult"
                                        id="hepatitisCTestResult"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                       <option value={""}></option>
                                        <option value="Yes">Positive</option>
                                        <option value="No">Negative</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>HIV Request and Result form filled with CT Intake Form *</Label>
                                    <select
                                        className="form-control"
                                        name="hivRequestResultCT"
                                        id="hivRequestResultCT"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Completed By</Label>
                                <Input
                                    type="number"
                                    name="completedBy"
                                    id="completedBy"
                                    // value={objValues.lastViralLoad}
                                    // onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Longitude</Label>
                                <Input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    // value={objValues.lastViralLoad}
                                    // onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Latitude</Label>
                                <Input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    // value={objValues.lastViralLoad}
                                    // onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Adhoc Code</Label>
                                <Input
                                    type="number"
                                    name="adhocCode"
                                    id="adhocCode"
                                    // value={objValues.lastViralLoad}
                                    // onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                
                                </FormGroup>
                            </div>
                            
                            {saving ? <Spinner /> : ""}
                            <br />
                            <div className="row">
                            <div className="form-group mb-3 col-md-6">
                            <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('pre-test-counsel', 'pre-test-counsel')}/>
                            <Button content='Next' icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                            </div>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>                                 
        </>
    );
};

export default HivTestResult