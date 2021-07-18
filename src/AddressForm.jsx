import React,{useEffect, useState} from 'react'
import { InputLabel,Button,MenuItem,Select,Grid,Typography } from '@material-ui/core'
import { useForm,FormProvider } from 'react-hook-form'
import FormInput from './FormInput'
import {commerce} from "./commerce";
import {Link} from "react-router-dom";

const AddressForm = ({checkoutToken,next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm()

    const options = shippingOptions.map(sO=>({id: sO.id,label: `${sO.description}- (${sO.price.formatted_with_symbol})`}))

    //
    const fetchShippingCountries = async (checkoutTokenId)=>{
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        console.log("countries: "+ JSON.stringify(countries));
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubdivisions = async (countryCode) => {
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode)
        console.log("subdivisions: "+ subdivisions)
        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }

    const fetchShippingOptions = async (checkoutTokenId,country,region=null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId,{country,region})
        console.log("options: "+ options)
        setShippingOptions(options)
        setShippingOption((options)[0].id)
    }

    //
    useEffect(() => {
       fetchShippingCountries(checkoutToken.id)
    }, [])

    useEffect(() => {
       if(shippingCountry) fetchSubdivisions(shippingCountry)
    }, [shippingCountry]);

    useEffect(()=>{
        if(shippingSubdivision) fetchShippingOptions(checkoutToken.id,shippingCountry,shippingSubdivision)
    },[shippingSubdivision])


    //
    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=>next({...data,shippingCountry,shippingSubdivision,shippingOption}))}>
                    <Grid container spacing={3}>
                    <FormInput required name="firstName" label="First name" />
                    <FormInput required name="lastName" label="Last name" />
                    <FormInput required name="address1" label="Address line 1" />
                    <FormInput required name="email" label="Email" />
                    <FormInput required name="city" label="City" />
                    <FormInput required name="zip" label="Zip / Postal code" />
                       <Grid item xs={12} sm={6}>
                          <InputLabel >Shipping Country</InputLabel>
                          <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)}>
                              {Object.entries(shippingCountries).map(([code,name])=> ({id:code, label: name})).map(item => (
                                  <MenuItem value={item.id} key={item.id} >
                                      {item.label}
                             </MenuItem>
                              ))}
                          </Select>
                       </Grid>
                       <Grid item xs={12} sm={6}>
                          <InputLabel >Shipping Sub Division</InputLabel>
                          <Select value={shippingSubdivision} fullWidth onChange={(e)=> setShippingSubdivision(e.target.value)}>
                              {Object.entries(shippingSubdivisions).map(([code,name])=> ({id:code, label: name})).map(item => (
                                  <MenuItem value={item.id} key={item.id} >
                                      {item.label}
                                  </MenuItem>
                              ))}
                          </Select>
                       </Grid>
                       <Grid item xs={12} sm={6}>
                          <InputLabel >Shipping Options</InputLabel>
                          <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)}>
                              {options.map(option=>(
                                  <MenuItem value={option.id} key={option.id} >
                                      {option.label}
                                  </MenuItem>
                              ))}
                          </Select>
                       </Grid>
                     </Grid>
                    <br/>
                    <div style={{display: 'flex',justifyContent: 'space-between'}}>
                        <Button component={Link} to={"/cart"} variant="outlined">Back To Cart</Button>
                        <Button variant={"contained"} type="submit" color="primary">Next</Button>
                    </div>
                </form>

            </FormProvider>
        </>
    )
}

export default AddressForm


