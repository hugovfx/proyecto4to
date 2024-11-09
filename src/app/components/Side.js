import { Button } from "@mui/material";
import "./Side.css";
import SideButton from "./SideButton";
function Side() {
  return (
    <div className="side">
      <SideButton url={"/Plantilla"} name={"Plantilla"}/>
      <SideButton url={"/nmap"} name={"NMAP"}/>
    </div>
  );
}
export default Side;
