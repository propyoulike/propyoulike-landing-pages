import ApartmentDefault from "./ApartmentDefault";

// Plot template uses same structure as Apartment with plot-specific styling
const PlotDefault = (props: any) => {
  return <ApartmentDefault {...props} />;
};

export default PlotDefault;
