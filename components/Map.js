import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import fetch from 'isomorphic-unfetch'

const MapComponent = withScriptjs(withGoogleMap((props) => (
    <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: props.lat, lng: props.long }}
    center={{ lat: props.lat, lng: props.long }}
    >
        {props.isMarkerShown && <Marker shape="rectangle" position={{ lat: props.lat, lng: props.long }} />}
        {props.attractions.length > 1 && props.attractions.map((attraction, i) => {
            return <Marker
                key={`${attraction.location_id}-${i}`}
                position={{lat: Number(attraction.latitude),lng: Number(attraction.longitude)}}
                label={attraction.name}
                title={attraction.name}
                />
        })}
    </GoogleMap>
)))

const Main = () => {
    let [latitude, setLatitude] = React.useState(-33.7560119)
    let [longitude, setLongitude] = React.useState(150.6038367)
    let [attractions, setAttractions] = React.useState([])
    let [address, setAddress] = React.useState('')
    let [message, setMessage] = React.useState({})

    const updateCoordinates = (e) => {
        e.preventDefault()

        setMessage({text: 'Loading..', variant: 'info'})

        const data = {
            address
        }

        fetch('/api/geocoding', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            setAttractions(response.attractionsList)
            setLatitude(response.lat)
            setLongitude(response.long)
            setMessage({})
        })
        .catch(() => setMessage({text: 'Something went wrong..', variant: 'danger'})
        )
    }

    return (
        <div>
            <p className={`alert alert-${message.variant}`}>{message.text}</p>
            <form onSubmit={(e) => updateCoordinates(e)}>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        required
                        aria-describedby="addressHelp"
                        placeholder="42 Wallaby Way, Sydney"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        />
                    <small id="addressHelp" className="form-text text-muted">The street address that you want to look-up, in the format used by the national postal service of the country concerned. Additional address elements such as business names and unit, suite or floor numbers should be avoided.</small>
                </div>
                <button className="btn mb-4 btn-primary" type='submit'>Search Location</button>
            </form>
        </div>
    )
}

export default Main
