import './referralForm.scss'
import {
    useEffect,
    useState
} from 'react';
import PhoneInput from 'react-phone-input-2';
import {
    Add, DeleteOutlined, DownloadOutlined, Edit,
    Restore,
    UndoOutlined
} from '@mui/icons-material';
import {
    TextField,
    Button,
    Grid,
    Box,
    Chip,
    ListItem, CardContent, Card, IconButton
} from '@mui/material';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useCreateReferrals, useDownloadCvReferral, useUpdateReferral } from "../../services/referralService";
import useLocalStorage from "../storage/useLocalStorage";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "../../hooks/SnackBarProvider";

interface ReferralFormProps {
    data?: {
        id: number;
        full_name: string;
        phone_number: string;
        email: string;
        linkedin_url: string;
        cv_url: string;
        tech_stacks: string[];
        comments: string;
    };
}

const ReferralForm = (props: ReferralFormProps = {}) => {
    const [token] = useLocalStorage('token', '');
    const [tags, setTags] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isCvRequired, setIsCvRequired] = useState<boolean>(true);
    const { createReferral } = useCreateReferrals();
    const { updateReferral } = useUpdateReferral();
    const { downloadCvReferral } = useDownloadCvReferral();
    const snackbar = useSnackbar();
    const history = useHistory();

    const saveReferralFormik = useFormik({
        initialValues: {
            id: 0,
            fullName: '',
            phoneNumber: "+52",
            email: '',
            linkedinUrl: '',
            cvUrl: null,
            cvFile: null,
            cvFileInput: '',
            comments: ''
        },
        validationSchema: Yup.object({
            id: Yup.number(),
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Incorrect email').required('Email is required'),
            linkedinUrl: Yup.string().required('Linkedin username is required'),
            cvFileInput: isCvRequired ? Yup.mixed().required('CV file is required') : Yup.mixed(),
            comments: Yup.string(),
            phoneNumber: Yup.string()
        }),
        onSubmit: (values: any, e) => {
            if (isUpdating) {
                const mergedValues = {
                    ...values,
                    techStacks: String(tags)
                }

                updateReferral({
                    referral: mergedValues,
                    token
                }).then(response => {
                    snackbar.success('Referral updated successfully');
                    history.push('/referrals');
                }).catch(e => {
                    snackbar.error('Something went wrong');
                    console.log(e);
                });
            } else {
                const mergedValues = {
                    ...values,
                    techStacks: String(tags)
                }
                createReferral({
                    referral: mergedValues,
                    token
                }).then(response => {
                    snackbar.success('Referral created successfully');
                    history.push('/referrals');
                }).catch(e => {
                    snackbar.error('Something went wrong');
                    console.log(e);
                });
            }
        },
    });

    useEffect(() => {
        if (props.data && props.data.id) {
            setIsUpdating(true);
            setTags(props.data.tech_stacks);
            if (props.data.cv_url) {
                setIsCvRequired(false);
            }

            saveReferralFormik.setValues({
                id: props.data.id,
                fullName: props.data.full_name,
                email: props.data.email,
                linkedinUrl: props.data.linkedin_url,
                cvUrl: props.data.cv_url,
                cvFileInput: '',
                comments: props.data.comments,
                phoneNumber: props.data.phone_number
            });
        }
    }, []);

    function onKeyDown(keyEvent: any) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    const handleDeleteChips = (chipToDelete: any) => () => {
        setTags((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const handleDownloadCv = ({referralId, fileName}: { referralId: any; fileName: string }) => {
        downloadCvReferral({
            referralId,
            token
        }).then((response) => {
            const dataBlob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
            snackbar.success('CV downloaded', 'Referral');
        }).catch(({ response }) => {
            const fileReader = new FileReader();
            fileReader.readAsText(response.data);
            fileReader.onload = (event) => {
                const data = event.target?.result?.toString();
                if (data) {
                    try {
                        const dataResponse = JSON.parse(data);

                        if (response.status === 500 && dataResponse.errors[0] === '404 Not Found') {
                            snackbar.error('CV Not Found', 'Referral');
                            saveReferralFormik.setFieldValue('cvUrl', null);
                            setIsCvRequired(true);
                        } else {
                            snackbar.error('Error while downloading CV. Try again', 'Referral');
                        }
                    } catch (error) {
                        snackbar.error('Error processing the information', 'Referral');
                    }
                }
            }
        });
    }

    return (
        <Box id="saveReferralForm" noValidate component={'form'} onSubmit={saveReferralFormik.handleSubmit}
            onKeyDown={onKeyDown}
            width={'100%'}
            sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={2} sx={{ marginTop: '20px', justifyContent: 'center', width: '90%' }}>
                <Grid item xs={12} md={8} lg={5} order={{ xs: 1, md: 1 }}>
                    <TextField
                        autoFocus={true}
                        required
                        fullWidth
                        id={"fullName"}
                        name={"fullName"}
                        onChange={saveReferralFormik.handleChange}
                        value={saveReferralFormik.values.fullName}
                        type={"text"}
                        label={"Full Name"}
                        variant={"outlined"}
                        error={saveReferralFormik.touched.fullName && Boolean(saveReferralFormik.errors.fullName)}
                        helperText={saveReferralFormik.touched.fullName && saveReferralFormik.errors.fullName?.toString()}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={5} order={{ xs: 2, md: 2 }}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        onChange={saveReferralFormik.handleChange}
                        value={saveReferralFormik.values.email}
                        type="email"
                        label="Email"
                        variant="outlined"
                        error={saveReferralFormik.touched.email && Boolean(saveReferralFormik.errors.email)}
                        helperText={saveReferralFormik.touched.email && saveReferralFormik.errors.email?.toString()}
                    />
                </Grid>
                <Grid item xs={12} md={8} lg={6} order={{ xs: 5, md: 4 }}>
                    <TextField
                        required
                        fullWidth
                        id="linkedinUrl"
                        name="linkedinUrl"
                        onChange={saveReferralFormik.handleChange}
                        value={saveReferralFormik.values.linkedinUrl}
                        type="text"
                        label={`LinkedIn URL`}
                        variant="outlined"
                        error={saveReferralFormik.touched.linkedinUrl && Boolean(saveReferralFormik.errors.linkedinUrl)}
                        helperText={saveReferralFormik.touched.linkedinUrl && saveReferralFormik.errors.linkedinUrl?.toString()}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={6} order={{ xs: 4, md: 5 }}>
                    { saveReferralFormik.values.cvUrl ? 
                    <Box sx={{ display: 'flex'}}>
                        <TextField
                        required
                        fullWidth
                        id="cvUrl"
                        name="cvUrl"
                        value={saveReferralFormik.values.cvUrl}
                        type="text"
                        label="CV file"
                        variant="outlined"
                        />
                        <IconButton
                            color="primary"
                            component="button"
                            onClick={() => handleDownloadCv({referralId: saveReferralFormik.values.id, fileName: saveReferralFormik.values.cvUrl})}
                        >
                            <DownloadOutlined />
                        </IconButton>
                        <IconButton
                            color="error"
                            component="button"
                            onClick={() => {
                                saveReferralFormik.setFieldValue('cvUrl', null);
                                setIsCvRequired(true);
                            }}
                        >
                            <DeleteOutlined />
                        </IconButton>
                    </Box>
                    :
                    <TextField
                        fullWidth
                        id="cvFileInput"
                        name="cvFileInput"
                        onChange={(event) => {
                            const target= event.target as HTMLInputElement;

                            if (target.files) {
                                const file = target.files[0];
                                saveReferralFormik.setFieldValue('cvFile', file);
                                saveReferralFormik.setFieldValue('cvFileInput', event.currentTarget.value);
                            }
                        }}
                        value={saveReferralFormik.values.cvFileInput}
                        type="file"
                        label="Select CV file"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: '.pdf' }}
                        error={saveReferralFormik.touched.cvFileInput && Boolean(saveReferralFormik.errors.cvFileInput)}
                        helperText={saveReferralFormik.errors.cvFileInput?.toString()}
                    />
                    }
                </Grid>
                <Grid item xs={12} md={4} lg={2} order={{ xs: 3, md: 3 }}>
                    <PhoneInput
                        inputProps={{
                            required: true,
                            name: 'phoneNumber',
                            id: 'phoneNumber',
                            error: 'Phone is required',
                            helpertext: 'Phone is required'
                        }}
                        country={'mx'}
                        value={saveReferralFormik.values.phoneNumber}
                        onChange={(value, _) => {
                            saveReferralFormik.setFieldValue('phoneNumber', value)
                        }}
                        isValid={saveReferralFormik.touched.phoneNumber && !Boolean(saveReferralFormik.errors.phoneNumber)}
                        defaultErrorMessage={'Phone required'}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12} order={{ xs: 7, md: 7 }}>
                    <Card sx={{ minWidth: 275 }} variant="outlined" className={"card-form"}>
                        <CardContent className={"card-form-stacks"}>
                            <TextField
                                helperText="Please enter to add tech stacks"
                                id="tech-stacks-input"
                                label="Tech Stacks"
                                fullWidth
                                value={techStack}
                                onChange={(event: any) => {
                                    setTechStack(event.target.value);
                                }}
                                onKeyDown={(keyEvent: any) => {
                                    var standarizedTagsToCompare: string[] = tags.map((tag: string)=>{
                                        return tag.toUpperCase().split(' ').join('')
                                    });
                                    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                                        keyEvent.preventDefault();
                                        if (!standarizedTagsToCompare.includes(techStack.toUpperCase().split(' ').join(''))) {
                                            setTags((current: string[]) => {
                                                return [
                                                    ...current,
                                                    techStack.toUpperCase()
                                                ]
                                            });
                                        }

                                        setTechStack('');
                                    }
                                }}
                            />
                            {tags.map((data, key) => {
                                return (
                                    <ListItem
                                        className={'form-stacks-list'}
                                        key={`${data}${key}`}
                                    >
                                        <Chip
                                            sx={{
                                                fontWeight: 'bold'
                                            }}
                                            variant={"filled"}
                                            color={"primary"}
                                            label={data}
                                            onDelete={handleDeleteChips(data)}
                                        />
                                    </ListItem>
                                );
                            })}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12} order={{ xs: 8, md: 8 }}>
                    <TextField
                        id="comments"
                        name="comments"
                        onChange={saveReferralFormik.handleChange}
                        value={saveReferralFormik.values.comments}
                        label="Comments"
                        multiline
                        rows={4}
                        style={{ width: '100%' }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ width: '350px', display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                <Button type='reset' variant="contained" endIcon={<UndoOutlined />}
                    onClick={() => history.push('/referrals')}>
                    Cancel
                </Button>
                <Button type='reset' variant="contained" endIcon={<Restore />}
                    onClick={() => {
                        setTags([]);
                        saveReferralFormik.resetForm();
                    }}>
                    Clear
                </Button>
                <Button type='submit' variant="contained"
                    endIcon={saveReferralFormik.values.id === 0 ? <Add /> : <Edit />}>
                    {saveReferralFormik.values.id === 0 ? 'Save' : 'Update'}
                </Button>
            </Box>
        </Box>
    );
}

export default ReferralForm;
