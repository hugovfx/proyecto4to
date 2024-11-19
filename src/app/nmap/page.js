import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";
import ButtonChat from "../components/ButtonChat";

export default function Home() {
  return (
    <div className="cont1">
      <Side></Side>
      <div className="cont12">
        <Nav/>
        <Content name={"NMAP"} info={"Nmap es una herramienta de código abierto utilizada para escanear redes y puertos. Permite a los usuarios identificar dispositivos en una red, detectar aplicaciones instaladas, y recopilar información sobre los servicios en ejecución. Es ampliamente utilizada en estudios de seguridad informática y para la administración de redes."}/>
      </div>
      <ButtonChat/>
    </div>
  );
}
