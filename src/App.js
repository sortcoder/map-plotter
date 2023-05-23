import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    LoadScript,
    GoogleMap,
    MarkerClusterer,
    Marker,
    OverlayView
} from "@react-google-maps/api";
import SvgComponent from "./SvgComponent";

export default function App() {
    let [map, setMap] = useState(null);
    let canvasRef = useRef(null);

    const [markers, setMarkers] = useState([]);

    const [imageBounds, setImageBounds] = useState(null);
    const [overlayPane, setOverlayPane] = useState(
        OverlayView.OVERLAY_MOUSE_TARGET
    );

    const onLoad = useCallback((map) => {
        setMap(map);

        const bounds = new window.google.maps.LatLngBounds();
        setImageBounds(bounds);

        map.setCenter({lat: 32.803356869891665, lng: -97.09699318526077});
    }, []);

    useEffect(() => {
        if (map) {
            showImage()
        }
    }, [map])

    const onUnmount = useCallback((map) => {
        setMap(null);
    }, []);

    //Draw image
    const showImage = () => {
        // const canvas = canvasRef.current;
        // // canvas.width = 3313;
        // // canvas.height = 1082;
        // const ctx = canvas.getContext("2d");
        // let imageData = ctx.createImageData(3313, 1082);

        // let data = imageData.data;
        // for (var i = 0; i < data.length; i += 4) {
        //   data[i] = 0;
        //   data[i + 1] = 0;
        //   data[i + 2] = 0;
        //   data[i + 3] = 120;
        // }
        // ctx.putImageData(imageData, 0, 0);

        const coords = [
            {lat: 32.80333864186445, lng: -97.10203638995968},
            {lat: 32.79951016396209, lng: -97.10206512631567},
            {lat: 32.805695440945584, lng: -97.0917907513833},
            {lat: 32.801204126414625, lng: -97.09799214890047}
        ];
        const bounds = new window.google.maps.LatLngBounds();
        coords.forEach((coordPair) => bounds.extend(coordPair));
        setImageBounds(bounds);
        map.fitBounds(bounds);
        setOverlayPane(OverlayView.OVERLAY_MOUSE_TARGET);
    };

    //Get color of each pixel on mouse move
    const getRGBAFromPixel = (e) => {
        var rect = canvasRef.current.getBoundingClientRect();
        var pos = {
            x:
                ((e.clientX - rect.left) / (rect.right - rect.left)) *
                canvasRef.current.width,
            y:
                ((e.clientY - rect.top) / (rect.bottom - rect.top)) *
                canvasRef.current.height
        };
        var ctx = e.target.getContext("2d");
        var color = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        console.log(color);
    };


    const showMarkerData = (marker) => console.log(marker);
    const clearMarkers = () => setMarkers([]);
    const clearImage = () =>
        setImageBounds(new window.google.maps.LatLngBounds());

    return (
        <LoadScript googleMapsApiKey="AIzaSyDp8i_SiNUXrpREuWYpTXpBys9-sdYLWro">
            <GoogleMap
                mapContainerStyle={{width: "100%", height: "100%"}}
                zoom={17}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    mapTypeControl: false,
                    mapTypeId: "terrain"
                }}
            >
                <OverlayView
                    bounds={imageBounds}
                    mapPaneName={overlayPane}
                    children={
                        <SvgComponent />
                    }
                ></OverlayView>
            </GoogleMap>
        </LoadScript>
    );
}
