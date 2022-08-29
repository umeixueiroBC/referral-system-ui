import './refferal.scss'
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import { TagsInput } from "react-tag-input-component";
import * as EmailValidator from 'email-validator';
import {Add, Restore, UndoOutlined} from '@mui/icons-material';
import {
    Button,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Select, 
    Stack,
    TextareaAutosize,
    TextField,
    Grid
} from '@mui/material';

export default function RefferralForm(this: any, props: any) {

    interface initialState {
        fullName: string;
        referred_by: string;
        ta_recruiter: string;
        phone: string;
        email: string;
        linkedin: string;
        cv: string;
        tech_stacks: string[];
        comments: string;
    }

    const initialState:initialState  = {
        fullName: '',
        referred_by: '',
        ta_recruiter: '',
        phone: '+52',
        email: '',
        linkedin: '',
        cv: '',
        tech_stacks: [],
        comments: ''
    };

    useEffect(() => {
        handleProps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleProps = () => {
        if (props) {
            setState({
                fullName: id ? props.fullName : '',
                referred_by: props.referred_by,
                ta_recruiter: id ? props.ta_recruiter : '',
                phone: id ? props.phone : "+52",
                email: id ? props.email : '',
                linkedin: props.linkedin? `https://www.linkedin.com/in/${props.linkedin}/` : '',
                cv: id ? props.cv : '',
                tech_stacks: props.tech_stacks,
                comments: props.comments
            });
        }
    };

    const recruiters: string[] = ['Ana', 'Jack', 'Mary', 'John', 'Krish', 'Navin'];

    const [
        { fullName, referred_by, ta_recruiter, phone, email, linkedin, cv, tech_stacks, comments },
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
        setState(prevState => ({ ...prevState }));
    };

    const {id}: any = useParams();

    const handleInputValidations = (event: any) => {
        let { id, value } = event.target;

        switch (id) {
            case 'fullName':
                value = value.replace(/[^a-zA-Z\s]/gi, "");
                break;
            default:
                break;
        }
        setState(prevState => ({ ...prevState, [id]: value }));
    }

    function handleNumber(event: any) {
        const { value, id } = event;

        setState(prevState => ({ ...prevState, [id]: value }));
    }

    const handleLinkedinOnFocus = (event: any) => {
        const { id, value } = event.target;
        setState(prevState => ({ ...prevState, [id]: value.slice(28,-1) }));
    }

    const handleLinkedinOnBlur = (event: any) => {
        const { id, value } = event.target;

        if(value.length<1){
            setState(prevState => ({ ...prevState, [id]: '' }));
        }
        else {
            setState(prevState => ({ ...prevState, [id]: `https://www.linkedin.com/in/${value}/` }));
        }
    }

    const isValidURL = (string: string) => {
        var res = string.match(/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ig);
        return (res !== null)
    };

    const isEmptyString = (str: string) => {
        return (typeof str === 'string' && str.trim().length === 0);
    };

    const [tags, setTags] = useState(id ? props.tech_stacks : []);

    const [open, setOpen] = useState(false);

    const handleSelection = (event: any) => {
        setState(prevState => ({ ...prevState, ta_recruiter: event.target.value }));
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
      <Stack spacing={2} direction="column">
        <div className="refferal-base">
            <form className='refferal-form'>
                <FormGroup>
                    { id && <input id="id" type="text" value={id} hidden/> }
                    <Stack spacing={4} direction={'column'}>
                        <Stack spacing={4} direction="row">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={id ? 6 : 6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="fullName"
                                        type="text"
                                        label="Full Name"
                                        variant="outlined"
                                        onChange={ handleInputValidations }
                                        value={ fullName }
                                    />
                                </Grid>
                                <Grid item xs={12} md={id ? 4 : 6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="referred_by"
                                        type="text"
                                        label="Refered by"
                                        variant="outlined"
                                        onChange={ handleInputValidations }
                                        value={referred_by}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    { id && <div>
                                    <FormControl fullWidth>
                                        <InputLabel id="ta_recruiter_label">TA Recruiter</InputLabel>
                                        <Select
                                            id="ta_recruiter"
                                            labelId="ta_recruiter_label"
                                            open={ open }
                                            onClose={ handleClose }
                                            onOpen={ handleOpen }
                                            value={ ta_recruiter }
                                            label="Ta"
                                            onChange={ handleSelection }
                                        >
                                            <MenuItem value={'None'}><em>None</em></MenuItem>
                                            {recruiters.map(name => (
                                                <MenuItem value={ name }>{ name }</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div> }
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <PhoneInput
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            autoFocus: true
                                            }}
                                        country={ 'mx' }
                                        value={ phone }
                                        onChange={ handleNumber }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        type="email"
                                        label="Email"
                                        variant="outlined"
                                        defaultValue="Email"
                                        value={ email }
                                        onChange={ handleInputValidations }
                                        error={ (isEmptyString(email) ? false : !EmailValidator.validate(email)) }
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="linkedin"
                                        type="text"
                                        label="Linkedin UserName"
                                        variant="outlined"
                                        onChange={ handleInputValidations }
                                        onFocus={ handleLinkedinOnFocus }
                                        onBlur={ handleLinkedinOnBlur }
                                        value={ linkedin }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="cv"
                                        type="text"
                                        label="CV URL"
                                        variant="outlined"
                                        onChange={ handleInputValidations }
                                        value={ cv }
                                        error={ (isEmptyString(cv) ? false : !isValidURL(cv)) }
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <TagsInput
                                        name="tech_stacks"
                                        placeHolder="Add stack"
                                        value={ tags }
                                        onChange={ setTags }
                                    />
                                    <span className="rti--instruction">press enter to add new tag</span>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <TextareaAutosize
                                id="comment"
                                maxRows={10}
                                aria-label="minimum height"
                                placeholder="Comments"
                                style={{ width: '100%', height: 180 }}
                                value={ comments }
                                onChange={ handleInputValidations }
                            />
                        </Stack>
                        <Stack spacing={4} direction="column">
                            <div className='refferal-center'>
                                <Stack spacing={2} direction="row">
                                    <Button type='reset' variant="contained" endIcon={<Restore />} onClick={clearState}>
                                        Clear
                                    </Button>
                                    { id && <Button type='reset' variant="contained" endIcon={<UndoOutlined />} onClick={handleProps}>
                                        Undo
                                    </Button> }
                                    <Button type='submit' variant="contained" endIcon={<Add />}>
                                        Save
                                    </Button>
                                </Stack>
                            </div>
                        </Stack>
                    </Stack>
                </FormGroup>
            </form>
        </div>
      </Stack>
    );
  }
