export const map = {
  current: {
    on: jest.fn(),
    getBounds: () => {
      boundingBoxMockCall();
      return boundingBox;
    },
  },
};
export const boundingBox = {
  getNorthWest: () => ({ lat: 40.7128, lng: -74.006 }), // New York
  getSouthEast: () => ({ lat: 34.0522, lng: -118.2437 }), // Los Angeles
};
export const boundingBoxMockCall = jest.fn();

jest.mock("react-map-gl", () => ({
  Map: ({ children }) => {
    return (
      <span>
        MAP
        {children}
      </span>
    );
  },
  ScaleControl: () => {
    return <div>Test scale</div>;
  },
  Marker: ({ longitude, latitude, rotation }) => {
    return (
      <>
        <div data-testid="position">
          {latitude} - {longitude}
        </div>
        <div data-testid="rotation">{rotation}</div>
      </>
    );
  },
  Layer: ({}) => {
    return <span></span>;
  },
  Source: ({ data, ...props }) => {
    return (
      <>
        {data.geometry.coordinates.map((coordinates, index) => (
          <span
            key={index}
            data-testid={`${props.id ?? "data"}_${index}`}
            {...props}
          >
            {data.geometry.coordinates[index].join(" - ")}
          </span>
        ))}
      </>
    );
  },
  useMap: () => {
    return map;
  },
}));
