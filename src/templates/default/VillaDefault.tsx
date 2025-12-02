import ApartmentDefault from "./ApartmentDefault";

// Villa template uses same structure as Apartment with villa-specific styling
const VillaDefault = (props: any) => {
  return <ApartmentDefault {...props} />;
};

export default VillaDefault;
