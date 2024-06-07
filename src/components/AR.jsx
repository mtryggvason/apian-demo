import React from "react";

const ARView = (props) => {
  return (
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
      renderer="antialias: true; alpha: true"
    >
      <a-camera gps-new-camera="gpsMinDistance: 5"></a-camera>
      {props.location && (
        <a-entity
          material="color: red"
          geometry="primitive: box"
          gps-new-entity-place={`latitude: ${props.location.lat} longitude:${props.location.lng}`}
          scale="10 10 10"
        ></a-entity>
      )}
    </a-scene>
  );
};

export default ARView;
