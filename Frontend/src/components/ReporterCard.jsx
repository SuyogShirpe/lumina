
export default function ReporterCard(){
    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getInitials = (name) => {
        return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
    }


    return (
    <></>
  );
}