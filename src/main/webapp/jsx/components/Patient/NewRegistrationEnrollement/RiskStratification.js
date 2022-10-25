
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory, } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl } from "../../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
import {  Modal } from "react-bootstrap";
import {Label as LabelRibbon, Message} from 'semantic-ui-react'

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
        '& > *': {
            margin: theme.spacing(1)
        },
        "& .card-title":{
            color:'#fff',
            fontWeight:'bold'
        },
        "& .form-control":{
            borderRadius:'0.25rem',
            height:'41px'
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
        },
        "& .dropdown-toggle::after": {
            display: " block !important"
        },
        "& select":{
            "-webkit-appearance": "listbox !important"
        },
        "& p":{
            color:'red'
        },
        "& label":{
            fontSize:'14px',
            color:'#014d88',
            fontWeight:'bold'
        }
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
    },
    success:{
        color: 'green',
        fontSize: '12.8px',
        fontWeight:'bold'
    }
}));


const BasicInfo = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [enrollSetting, setEnrollSetting] = useState([]);
    let riskCountQuestion=[]
    const [kP, setKP] = useState([]);
    const [errors, setErrors] = useState({});
    const [ageDisabled, setAgeDisabled] = useState(true);
    const [saving, setSaving] = useState(false);
    let temp = { ...errors }
    const [open, setOpen] = React.useState(false)
    const toggle = () => setOpen(!open);
    const [setting, setSetting] = useState([]);
    const [riskCount, setRiskCount] = useState(0);
    const [objValues, setObjValues]= useState(
        {
            age:"",
            dob:"",
            dateVisit: "",         
            dateOfBirth: null,
            dateOfRegistration:null,
            isDateOfBirthEstimated: "",
            targetGroup:"",
            settingModality:"",
            setting  :""

        }
    )
    const [riskAssessment, setRiskAssessment]= useState(
        {
            everHadSexualIntercourse:"",
            bloodtransInlastThreeMonths:"",
            uprotectedSexWithCasualLastThreeMonths:"",
            uprotectedSexWithRegularPartnerLastThreeMonths:"", 
            unprotectedVaginalSex:"",  
            uprotectedAnalSex:"",   
            stiLastThreeMonths:"",
            sexUnderInfluence :"",
            moreThanOneSexPartnerLastThreeMonths:"",
            experiencePain:"",
            haveSexWithoutCondom:"",
            abuseDrug:"",
            bloodTransfusion:"",
            consistentWeightFeverNightCough:"",
            soldPaidVaginalSex:"",
        }
    )
    useEffect(() => { 
        KP();
        EnrollmentSetting();
        //objValues.dateVisit=moment(new Date()).format("YYYY-MM-DD")        
        if(objValues.age!==''){
            props.setPatientObjAge(objValues.age)
        }
        
    }, [objValues.age]);
    //Get list of HIV STATUS ENROLLMENT
    const EnrollmentSetting =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/TEST_SETTING`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            //console.log(response.data);
            setEnrollSetting(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of KP
    const KP =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/TARGET_GROUP`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setKP(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    const handleInputChange = e => { 
        setErrors({...temp, [e.target.name]:""})
        if(e.target.name==='setting' && e.target.value!==""){
            SettingModality(e.target.value)
            setObjValues ({...objValues,  [e.target.name]: e.target.value}); 
        }
        if(e.target.name==='settingModality' && e.target.value!==""){
            //SettingModality(e.target.value)
            if(e.target.value==="TEST_SETTING_STANDALONE_HTS_PMTCT_(ANC1_ONLY)"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value}); 
            }else if(e.target.value==="TEST_SETTING_STANDALONE_HTS_EMERGENCY"){
                //setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_STANDALONE_HTS_INDEX"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_STANDALONE_HTS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_STANDALONE_HTS_STI"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_STANDALONE_HTS_TB"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_CT_STI"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_CT_PMTCT"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_CT_TB"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_TB_TB"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_STI_STI"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_OPD_STI"){
                //setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else if(e.target.value==="TEST_SETTING_OUTREACH_INDEX"){
                setRiskCount(1)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }else{
                setRiskCount(0)
                setObjValues ({...objValues,  [e.target.name]: e.target.value});
            }
            
        }
        
        setObjValues ({...objValues,  [e.target.name]: e.target.value});            
    }

    //Date of Birth and Age handle 
    const handleDobChange = (e) => {
        if (e.target.value) {
            const today = new Date();
            const birthDate = new Date(e.target.value);
            let age_now = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age_now--;
            }
            objValues.age=age_now
            
            //setBasicInfo({...basicInfo, age: age_now});        
        } else {
            setObjValues({...objValues, age:  ""});
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
   
        setObjValues({...objValues, dob: e.target.value});
        if(objValues.age!=='' && objValues.age<=15){
            props.setHideOtherMenu(true)
        }else if(objValues.age!=='' && objValues.age>15){
            props.setHideOtherMenu(true)
        }else{
            props.setHideOtherMenu(true)
        }

        if(objValues.age!=='' && objValues.age>=85){
            toggle()
        }
        
    }
    const handleDateOfBirthChange = (e) => {
        if (e.target.value == "Actual") {
            objValues.isDateOfBirthEstimated=false
            setAgeDisabled(true);
        } else if (e.target.value == "Estimated") {
            objValues.isDateOfBirthEstimated=true
            setAgeDisabled(false);
        }
    }
    const handleAgeChange = (e) => {
        if (!ageDisabled && e.target.value) {
            if(e.target.value!=='' && e.target.value>=85){
                toggle()
            }
            if(e.target.value!=='' && e.target.value<=15){
                props.setHideOtherMenu(false)
                
            }else if(e.target.value!=='' && e.target.value>15){
                props.setHideOtherMenu(true)
            }else{
                props.setHideOtherMenu(true)
            }
            const currentDate = new Date();
            currentDate.setDate(15);
            currentDate.setMonth(5);
            const estDob = moment(currentDate.toISOString());
            const dobNew = estDob.add((e.target.value * -1), 'years');
            setObjValues({...objValues, dob: moment(dobNew).format("YYYY-MM-DD")});
            objValues.dob =moment(dobNew).format("YYYY-MM-DD")

        }
        setObjValues({...objValues, age: e.target.value});
    }
    //Get list of DSD Model Type
    function SettingModality (settingId) {
        const setting = settingId
        axios
           .get(`${baseUrl}application-codesets/v2/${setting}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               setSetting(response.data);
           })
           .catch((error) => {
           //console.log(error);
           });
       
    }
    //End of Date of Birth and Age handling 
    /*****  Validation  */
    const validate = () => {
        //HTS FORM VALIDATION

            temp.dateVisit = objValues.dateVisit ? "" : "This field is required."  
            temp.dob = objValues.dob ? "" : "This field is required."
            temp.age = objValues.age ? "" : "This field is required."              
                setErrors({ ...temp })
        return Object.values(temp).every(x => x == "")
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }
         // Getting the number count of riskAssessment True
    const actualRiskCountTrue=Object.values(riskAssessment)
     riskCountQuestion=actualRiskCountTrue.filter((x)=> x==='true')
    const [riskAssessmentPartner, setRiskAssessmentPartner]= useState(
        {
            sexPartnerHivPositive:"",
            newDiagnosedHivlastThreeMonths:"",
            currentlyArvForPmtct :"",
            knowHivPositiveOnArv :"",
            knowHivPositiveAfterLostToFollowUp:"", 
            uprotectedAnalSex  :"",
        }
    )
    const handleInputChangeRiskAssessment = e => { 
        //setErrors({...temp, [e.target.name]:""}) 
        setRiskAssessment ({...riskAssessment,  [e.target.name]: e.target.value}); 
                            
    }
    const handleSubmit =(e)=>{
        e.preventDefault();
            //props.patientObj.personResponseDto.age = objValues.age
            props.patientObj.personResponseDto.dob = objValues.dob
            props.patientObj.personResponseDto.dateOfBirth = objValues.dob
            props.patientObj.personResponseDto.isDateOfBirthEstimated = objValues.isDateOfBirthEstimated
            props.patientObj.targetGroup = objValues.targetGroup
            props.patientObj.testingSetting = objValues.setting
            props.patientObj.dateVisit= objValues.dateVisit
            if((riskCount>0 || riskCountQuestion.length>0) && objValues.age>15){
                handleItemClick('basic', 'risk' )
                props.setExtra(objValues)
                props.setHideOtherMenu(false)
            }if(objValues.age<15){
                props.setExtra(objValues)
                handleItemClick('basic', 'risk' )
            }else{
                props.setHideOtherMenu(false)
                //toast.success("Risk stratification save succesfully!");
            }
            // if(validate()){
            // axios.post(`${baseUrl}hts`,objValues,
            // { headers: {"Authorization" : `Bearer ${token}`}},
            
            // )
            // .then(response => {
            //     setSaving(false);
            //     props.setPatientObj(response.data)
            //     if(objValues.age>14){
            //         handleItemClick('pre-test-counsel', 'basic' )
            //     }else{
            //         handleItemClick('hiv-test', 'basic' )
            //     }
                

            // })
            // .catch(error => {
            //     setSaving(false);
            //     if(error.response && error.response.data){
            //         let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            //         toast.error(errorMessage);
            //     }
            //     else{
            //         toast.error("Something went wrong. Please try again...");
            //     }
            // });
            // }
    }


    return (
        <>  
        
            <Card className={classes.root}>
                <CardBody>   
                <h2 style={{color:'#000'}}>RISK STRATIFICATION</h2>
                <br/>
                    <form >
                        <div className="row">
                        <div className="form-group  col-md-12 text-center pt-2 mb-4" style={{backgroundColor:'#992E62', width:'125%', height:'35px', color:'#fff', fontWeight:'bold'}} >Modality</div>
                            <div className="row">
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Setting</Label>
                                    <select
                                        className="form-control"
                                        name="setting"
                                        id="setting"
                                        value={objValues.setting}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}>Select</option>
                                        {enrollSetting.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                        {/* <option value="TEST_SETTING_CT">CT</option>
                                        <option value="TEST_SETTING_TB">TB</option>
                                        <option value="TEST_SETTING_STI">STI</option>
                                        <option value="TEST_SETTING_OPD">OPD</option>
                                        <option value="TEST_SETTING_WARD">WARD</option>
                                        <option value="TEST_SETTING_STANDALONE_HTS">STANDALONE HTS</option>
                                        
                                        <option value="TEST_SETTING_FP">FP</option>
                                        <option value="TEST_SETTING_OUTREACH">OUTREACH</option>
                                        <option value="TEST_SETTING_OTHERS">OTHERS</option> */}

                                    </select>
                                    {errors.setting !=="" ? (
                                    <span className={classes.error}>{errors.setting}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Modality</Label>
                                    <select
                                        className="form-control"
                                        name="settingModality"
                                        id="settingModality"
                                        value={objValues.settingModality}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}>Select</option>
                                        {setting.map((value) => (
                                            <option key={value.code} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                        
                                    </select>
                                    {errors.settingModality !=="" ? (
                                    <span className={classes.error}>{errors.settingModality}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Visit Date  </Label>
                                <Input
                                    type="date"
                                    name="dateVisit"
                                    id="dateVisit"
                                    value={objValues.dateVisit}
                                    onChange={handleInputChange}
                                    min="1983-12-31"
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                {errors.dateVisit !=="" ? (
                                    <span className={classes.error}>{errors.dateVisit}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            </div>
                            <br/>
                           
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Target Group *</Label>
                                    <select
                                        className="form-control"
                                        name="targetGroup"
                                        id="targetGroup"
                                        onChange={handleInputChange}
                                        value={objValues.targetGroup}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {kP.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.targetGroup !=="" ? (
                                        <span className={classes.error}>{errors.targetGroup}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-2 col-md-2">
                                <FormGroup>
                                    <Label>Date Of Birth</Label>
                                    <div className="radio">
                                        <label>
                                            <input
                                                type="radio"
                                                value="Actual"
                                                name="dateOfBirth"
                                                defaultChecked
                                                
                                                onChange={(e) => handleDateOfBirthChange(e)}
                                                style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                            /> Actual
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input
                                                type="radio"
                                                value="Estimated"
                                                name="dateOfBirth"
                                                
                                                onChange={(e) => handleDateOfBirthChange(e)}
                                                style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                            /> Estimated
                                        </label>
                                    </div>
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label>Date</Label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="dob"
                                        id="dob"
                                        min={objValues.dateVisit}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                        value={objValues.dob}
                                        onChange={handleDobChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    />
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label>Age</Label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="age"
                                        id="age"
                                        value={objValues.age}
                                        disabled={ageDisabled}
                                        onChange={handleAgeChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    />
                                </FormGroup>
                            </div>

                            <br />
                             
                            {objValues.age>15 && ( <>
                            {(objValues.targetGroup==="473" )&& ( <>
                            <div className="form-group  col-md-12 text-center pt-2 mb-4" style={{backgroundColor:'#992E62', width:'125%', height:'35px', color:'#fff', fontWeight:'bold'}} >HIV Risk Assessment  (Last 3 months)</div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Ever had sexual intercourse </Label>
                                    <select
                                        className="form-control"
                                        name="everHadSexualIntercourse"
                                        id="everHadSexualIntercourse"
                                        value={riskAssessment.everHadSexualIntercourse}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.everHadSexualIntercourse !=="" ? (
                                    <span className={classes.error}>{errors.everHadSexualIntercourse}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Blood transfusion in last 3 months *</Label>
                                    <select
                                        className="form-control"
                                        name="bloodtransInlastThreeMonths"
                                        id="bloodtransInlastThreeMonths"
                                        value={riskAssessment.bloodtransInlastThreeMonths}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.bloodtransInlastThreeMonths !=="" ? (
                                    <span className={classes.error}>{errors.bloodtransInlastThreeMonths}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Unprotected sex with casual partner in last 3 months *</Label>
                                    <select
                                        className="form-control"
                                        name="uprotectedSexWithCasualLastThreeMonths"
                                        id="uprotectedSexWithCasualLastThreeMonths"
                                        value={riskAssessment.uprotectedSexWithCasualLastThreeMonths}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.uprotectedSexWithCasualLastThreeMonths !=="" ? (
                                    <span className={classes.error}>{errors.uprotectedSexWithCasualLastThreeMonths}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Unprotected sex with regular partner in the last 3months</Label>
                                    <select
                                        className="form-control"
                                        name="uprotectedSexWithRegularPartnerLastThreeMonths"
                                        id="uprotectedSexWithRegularPartnerLastThreeMonths"
                                        value={riskAssessment.uprotectedSexWithRegularPartnerLastThreeMonths}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.uprotectedSexWithRegularPartnerLastThreeMonths !=="" ? (
                                    <span className={classes.error}>{errors.uprotectedSexWithRegularPartnerLastThreeMonths}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Unprotected vaginal sex</Label>
                                    <select
                                        className="form-control"
                                        name="unprotectedVaginalSex"
                                        id="unprotectedVaginalSex"
                                        value={riskAssessment.unprotectedVaginalSex}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.unprotectedVaginalSex !=="" ? (
                                    <span className={classes.error}>{errors.unprotectedVaginalSex}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Unprotected Anal sex</Label>
                                    <select
                                        className="form-control"
                                        name="uprotectedAnalSex"
                                        id="uprotectedAnalSex"
                                        value={riskAssessment.uprotectedAnalSex}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.uprotectedAnalSex !=="" ? (
                                    <span className={classes.error}>{errors.uprotectedAnalSex}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>         
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>STI in last 3 months *</Label>
                                    <select
                                        className="form-control"
                                        name="stiLastThreeMonths"
                                        id="stiLastThreeMonths"
                                        value={riskAssessment.stiLastThreeMonths}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.stiLastThreeMonths !=="" ? (
                                    <span className={classes.error}>{errors.stiLastThreeMonths}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Sex under the influence of drugs or alcohol*</Label>
                                    <select
                                        className="form-control"
                                        name="sexUnderInfluence"
                                        id="sexUnderInfluence"
                                        value={riskAssessment.sexUnderInfluence}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.sexUnderInfluence !=="" ? (
                                    <span className={classes.error}>{errors.sexUnderInfluence}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>More than 1 sex partner during last 3 months*</Label>
                                    <select
                                        className="form-control"
                                        name="moreThanOneSexPartnerLastThreeMonths"
                                        id="moreThanOneSexPartnerLastThreeMonths"
                                        value={riskAssessment.moreThanOneSexPartnerLastThreeMonths}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.moreThanOneSexPartnerLastThreeMonths !=="" ? (
                                    <span className={classes.error}>{errors.moreThanOneSexPartnerLastThreeMonths}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                          
                            <br/>
                            </>)}
                            {(objValues.targetGroup!=="473" ) && ( <>
                            <div className="form-group  col-md-12 text-center pt-2 mb-4" style={{backgroundColor:'#992E62', width:'125%', height:'35px', color:'#fff', fontWeight:'bold'}} >HIV Risk Assessment  (Last 3 months)</div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you/your partner experienced lower abdominal pain, smelly discharge, blisters and wounds around you/partner vagina, penis anus or mouth?</Label>
                                    <select
                                        className="form-control"
                                        name="experiencePain"
                                        id="experiencePain"
                                        value={riskAssessment.experiencePain}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.experiencePain !=="" ? (
                                    <span className={classes.error}>{errors.experiencePain}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you/partner had sex without a condom with someone of unknown HIV status, or you/partner raped by person with unknown HIV status? *</Label>
                                    <select
                                        className="form-control"
                                        name="haveSexWithoutCondom"
                                        id="haveSexWithoutCondom"
                                        value={riskAssessment.haveSexWithoutCondom}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.haveSexWithoutCondom !=="" ? (
                                    <span className={classes.error}>{errors.haveSexWithoutCondom}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you had a condom burst with your partner during sexual intercourse?  *</Label>
                                    <select
                                        className="form-control"
                                        name="haveCondomBurst"
                                        id="haveCondomBurst"
                                        value={riskAssessment.haveCondomBurst}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.haveCondomBurst !=="" ? (
                                    <span className={classes.error}>{errors.haveCondomBurst}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Do you/partner share needles/syringes, other sharp objects or used abuse drug substances of any kind?</Label>
                                    <select
                                        className="form-control"
                                        name="abuseDrug"
                                        id="abuseDrug"
                                        value={riskAssessment.abuseDrug}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.abuseDrug !=="" ? (
                                    <span className={classes.error}>{errors.abuseDrug}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you/partner had any blood or blood product transfusion?</Label>
                                    <select
                                        className="form-control"
                                        name="bloodTransfusion"
                                        id="bloodTransfusion"
                                        value={riskAssessment.bloodTransfusion}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.bloodTransfusion !=="" ? (
                                    <span className={classes.error}>{errors.bloodTransfusion}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you/partner experienced coughing, weight loss, fever, night sweats consistently?</Label>
                                    <select
                                        className="form-control"
                                        name="consistentWeightFeverNightCough"
                                        id="consistentWeightFeverNightCough"
                                        value={riskAssessment.consistentWeightFeverNightCough}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.consistentWeightFeverNightCough !=="" ? (
                                    <span className={classes.error}>{errors.consistentWeightFeverNightCough}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>            
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you/partner paid or sold vaginal, anal or oral sex? *</Label>
                                    <select
                                        className="form-control"
                                        name="soldPaidVaginalSex"
                                        id="soldPaidVaginalSex"
                                        value={riskAssessment.soldPaidVaginalSex}
                                        onChange={handleInputChangeRiskAssessment}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                        
                                    </select>
                                    {errors.soldPaidVaginalSex !=="" ? (
                                    <span className={classes.error}>{errors.soldPaidVaginalSex}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                           
                            <br/>
                            </>)}
                            </>)}
                            <br/>
                            <Message warning>
                                <h4>Personal HIV Risk assessment score </h4>
                                <b>Score :{riskCount + (objValues.age>15 ?riskCountQuestion.length : 0)}</b>
                            </Message>
                            <hr/>
                            <br/>
                            <div className="row">
                            <div className="form-group mb-3 col-md-6">
                           
                            <Button content='Save' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                            </div>
                            </div>
                        </div>
                    </form>
                    
                </CardBody>
            </Card> 
            <Modal show={open} toggle={toggle} className="fade" size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
             <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
                Notification!
            </Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <h4>Are you Sure of the Age entered?</h4>
                    
                </Modal.Body>
            <Modal.Footer>
                <Button onClick={toggle} style={{backgroundColor:"#014d88", color:"#fff"}}>Yes</Button>
            </Modal.Footer>
            </Modal>                             
        </>
    );
};

export default BasicInfo