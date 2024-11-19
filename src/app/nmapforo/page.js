import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import ContentForo from "../components/ContentForo";

export default function Home() {
  return (
    <div className="cont1">
      <Side></Side>
      <div className="cont12">
        <Nav/>
        <ContentForo name={"NMAP Foro"}/>
      </div>
    </div>
  );
}
