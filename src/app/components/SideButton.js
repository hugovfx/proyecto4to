import { Button } from "@mui/material";
import "./Side.css";

function SideButton({url, name}) {
  return (
      <Button
        variant="outlined"
        style={{ width: "80%", height: "8%", marginTop: "10%" }}
        href={url}>
        <p>{name}</p>
      </Button>
      
  );
}
export default SideButton;
