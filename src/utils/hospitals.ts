export const hospitals: any[] = [
  {
    name: "Guy's Hospital",
    code: "86933b67-3685-41ce-9da9-6e8a2987e1bc",
    coordinates: { lat: 51.50254, lon: -0.08788 },
    address: "London",
  },
  {
    name: "St Thomas' Hospital",
    code: "782bdf13-8f43-40e4-bfb2-8d7d7c1efc4f",
    coordinates: { lat: 51.4984, lon: -0.11832 },
    address: "London",
  },
  {
    name: "Royal London Hospital",
    code: "99f8c5b6-65e2-4b5f-a3c9-9e9f7a5b2e88",
    coordinates: { lat: 51.52028, lon: -0.05844 },
    address: "London",
  },
  {
    name: "King's College Hospital",
    code: "ad1a2f2b-2d49-4fda-b22b-3f1e223aef0a",
    coordinates: { lat: 51.46826, lon: -0.08949 },
    address: "London",
  },
  {
    name: "St Mary's Hospital",
    code: "c45776d3-1c5d-4d67-92a1-e8c9d8b1a934",
    coordinates: { lat: 51.51752, lon: -0.17447 },
    address: "London",
  },
  {
    name: "University College Hospital",
    code: "f1a1e7f3-3c2a-4f2e-8838-f8b3c7d3f7d7",
    coordinates: { lat: 51.52458, lon: -0.13372 },
    address: "London",
  },
  /*
  {
    name: "Addenbrooke's Hospital",
    code: "d4b3e8f7-2c3a-4f7e-8b3d-f7a7d4b3e8f7",
    coordinates: { lat: 52.1764, lon: 0.13883 },
    address: "Cambridge",
  },
  {
    name: "John Radcliffe Hospital",
    code: "e5c6d8a1-4c5f-4b6e-9c7d-a5c7e8f7d6c5",
    coordinates: { lat: 51.76341, lon: -1.22131 },
    address: "Oxford",
  },
  {
    name: "Queen Elizabeth Hospital",
    code: "f8e9d7a1-5e7f-4d8b-9c7e-a8b9d7c6e5f4",
    coordinates: { lat: 52.45087, lon: -1.83296 },
    address: "Birmingham",
  },
  */
];

export function getHospital(previousCode: string | null = null): any {
  // Filter out the previous hospital
  const filteredHospitals = hospitals.filter(
    (hospital) => hospital.code !== previousCode
  );

  // Select a random hospital from the filtered list
  const hospital =
    filteredHospitals[Math.floor(Math.random() * filteredHospitals.length)];

  return hospital;
}
